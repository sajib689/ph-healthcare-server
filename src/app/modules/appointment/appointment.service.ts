import { randomUUID } from "node:crypto";
import { AppointmentStatus, PaymentStatus, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types/common";

const insertAppointments = async (user: IJWTPayload, payload: any) => {
  if (!user?.email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User information is missing.");
  }

  if (!payload?.doctorId || !payload?.scheduleId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "doctorId and scheduleId are required.",
    );
  }

  return prisma.$transaction(async (tx) => {
    const patientData = await tx.patient.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });

    const doctorData = await tx.doctor.findUniqueOrThrow({
      where: {
        id: payload.doctorId,
        isDeleted: false,
      },
    });

    const availableSchedule = await tx.doctorSchedule.findFirst({
      where: {
        doctorId: payload.doctorId,
        scheduleId: payload.scheduleId,
        isBooked: false,
      },
    });

    if (!availableSchedule) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Selected schedule is not available.",
      );
    }

    const videoCallingId = randomUUID();

    const appointment = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
        status: AppointmentStatus.SCHEDULED,
        paymentStatus: PaymentStatus.UNPAID,
      },
    });

    await tx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    const transactionId = randomUUID();

    await tx.payment.create({
      data: {
        appointmentId: appointment.id,
        amount: doctorData.appointmentFee,
        transactionId,
        paymentGateWayData: Prisma.JsonNull,
      },
    });

    return appointment;
  });
};

const getAllFromDb = async (user: IJWTPayload) => {
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  // Admin
  if (user.role === "ADMIN") {
    return prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  if (user.role === "PATIENT") {
    const patient = await prisma.patient.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });

    return prisma.appointment.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
        payments: true
      },
    });
  }

  if (user.role === "DOCTOR") {
    const doctor = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });

    return prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });
  }

  throw new ApiError(httpStatus.FORBIDDEN, "Invalid role");
};

const deleteAppointment = async (id: string) => {
  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, "Id is missing!");
  }

  const result = await prisma.$transaction(async (tnx) => {
    const appointments = await tnx.appointment.findUniqueOrThrow({
      where: {
        id,
      },
    });

    await tnx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: appointments.doctorId,
          scheduleId: appointments.scheduleId,
        },
      },
      data: {
        isBooked: false,
      },
    });
    return tnx.appointment.delete({
      where: {
        id,
      },
    });
  });

  return result;
};

export const AppointmentService = {
  insertAppointments,
  getAllFromDb,
  deleteAppointment,
};
