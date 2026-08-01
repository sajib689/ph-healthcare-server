import { randomUUID } from "node:crypto";
import { AppointmentStatus, PaymentStatus, Prisma, Role } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types/common";
import { stripe } from "../../helper/stripe";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { meta } from "zod/v4/core";

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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,

      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(doctorData.appointmentFee * 100),
            product_data: {
              name: `Appointment with ${doctorData.name}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointment.id,
        paymentId: patientData.id,
      },

      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    });

    return {
      checkoutUrl: session.url,
    };

    // return appointment;
  });
};

const getAllFromDb = async (
  user: IJWTPayload,
  options: IOptions,
  filters: any,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filtersData } = filters;

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user.role === Role.PATIENT) {
    andConditions.push({
      patient: {
        email: user.email,
      },
    });
  } else if (user.role === Role.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user.email,
      },
    });
  }

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          patient: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          doctor: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filtersData).length > 0) {
    const filterConditions = Object.keys(filtersData).map((key) => ({
      [key]: {
        equals: (filtersData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  const whereCondition: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereCondition,
    skip,
    take: limit,
    include:
      user.role === Role.PATIENT
        ? {
            doctor: true,
          }
        : {
            patient: true,
          },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.appointment.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
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

const updateAppointmentStatus = async (
  id: string,
  status: AppointmentStatus,
  user: IJWTPayload,
) => {
  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      doctor: true,
    },
  });

  if (user.role === Role.DOCTOR) {
    if (!(user?.email === appointmentData.doctor.email)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "This is not your appointment",
      );
    }
    return await prisma.appointment.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
};

const cancelUnpaidAppointment = async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  const unpaidAppointments = await prisma.appointment.findMany({
    where: {
      createdAt: {
        lte: thirtyMinutesAgo,
      },
      paymentStatus: PaymentStatus.UNPAID,
      status: AppointmentStatus.IN_PROGRESS,
    },
  });
  const appointmentIds = unpaidAppointments.map(
    (appointment) => appointment.id,
  );

  await prisma.$transaction(async (tnx) => {
    await tnx.payment.deleteMany({
      where: {
        id: {
          in: appointmentIds,
        },
      },
    });
    await tnx.appointment.deleteMany({
      where: {
        id: {
          in: appointmentIds,
        },
      },
    });

    for (const unpaidAppointment of unpaidAppointments) {
      await tnx.doctorSchedule.update({
        where: {
          doctorId_scheduleId: {
            doctorId: unpaidAppointment.doctorId,
            scheduleId: unpaidAppointment.scheduleId,
          },
        },
        data: {
          isBooked: false,
        },
      });
    }
  });
};

export const AppointmentService = {
  insertAppointments,
  getAllFromDb,
  deleteAppointment,
  updateAppointmentStatus,
  cancelUnpaidAppointment,
};
