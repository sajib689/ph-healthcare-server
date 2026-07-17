import { Request } from "express";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcrypt";
import { fileUploader } from "../../helper/fileUpload";
import { Prisma, Role } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { userSearchableFields } from "./user.constant";

const createPatient = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadFileToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadResult?.secure_url;
  }

  const hashPassword = await bcrypt.hash(req.body.password, 10);

  const result = await prisma.$transaction(async (tnx: any) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashPassword,
      },
    });

    return await tnx.patient.create({
      data: req.body.patient,
    });
  });

  return result;
};

const createDoctor = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadFileToCloudinary(req.file);
    req.body.doctor.profilePhoto = uploadResult?.secure_url;
  }

  const hashPassword = await bcrypt.hash(req.body.password, 10);

  const result = await prisma.$transaction(async (tnx: any) => {
    await tnx.user.create({
      data: {
        email: req.body.doctor.email,
        password: hashPassword,
        role: Role.DOCTOR
      },
    });
    return await tnx.doctor.create({
      data: req.body.doctor,
    });
  });
  return result;
};

const createAdmin = async (req: Request) => {
  // file upload
  if (req.file) {
    const uploadResult = await fileUploader.uploadFileToCloudinary(req.file);
    req.body.admin.profilePhoto = uploadResult?.secure_url;
  }

  const hashPassword = await bcrypt.hash(req.body.password, 10);

  const result = await prisma.$transaction(async (tnx: any) => {
    await tnx.user.create({
      data: {
        email: req.body.admin.email,
        password: hashPassword,
         role: Role.ADMIN
      },
    });

    await tnx.admin.create({
      data: req.body.admin,
    });
  });

  return result;
};

const getAllFromDb = async (params: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};
  const result = await prisma.user.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.user.count({
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

export const userService = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllFromDb,
};
