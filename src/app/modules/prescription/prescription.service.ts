import {
  AppointmentStatus,
  PaymentStatus,
  Prescription,
  Prisma,
  Role,
} from "@prisma/client";
import { IJWTPayload } from "../../types/common";
import { prisma } from "../../shared/prisma";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";

const createPrescription = async (
  user: IJWTPayload,
  payload: Partial<Prescription>,
) => {
  if (user.role !== Role.DOCTOR) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only doctors can create prescriptions.",
    );
  }

  if (!payload.appointmentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Appointment ID is required.");
  }

  

  const appointmentData = await prisma.appointment.findFirst({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });

  console.log(appointmentData);

  if (appointmentData?.doctor.email !== user.email) {
    throw new ApiError(httpStatus.FORBIDDEN, "This is not your appointment.");
  }

  if (!payload.followUpDate) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Follow-up date is required.");
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions ?? "",
      followUpDate: payload.followUpDate,
    },
    include: {
      patient: true,
    },
  });

  return result;
};

const getAllPrescriptions = async (options: IOptions, filters: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.PrescriptionWhereInput[] = [];

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
        {
          instructions: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filters = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filters);
  }

  const whereConditions: Prisma.PrescriptionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.prescription.findMany({
    skip,
    take: limit,
    where: whereConditions,
    include: {
      patient: true,
      doctor: true,
      appointment: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.prescription.count({
    where: whereConditions,
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

const getMyPrescriptions = async (
  user: IJWTPayload,
  options: IOptions,
  filters: any,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.PrescriptionWhereInput[] = [];
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
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filters = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filters);
  }

  const whereConditions: Prisma.PrescriptionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.prescription.findMany({
    where: {
      appointment: {
        patientId: user.id,
      },
      ...whereConditions,
    },
    include: {
      appointment: {
        include: {
          patient: true,
          doctor: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.prescription.count({
    where: whereConditions,
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

export const PrescriptionService = {
  createPrescription,
  getAllPrescriptions,
  getMyPrescriptions,
};
