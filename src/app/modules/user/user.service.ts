import { Request } from "express";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcrypt";
import { fileUploader } from "../../helper/fileUpload";
import { Prisma, Role, Status } from "@prisma/client";

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
      },
    });

    await tnx.admin.create({
      data: req.body.admin,
    });
  });

  return result;
};

const getAllFromDb = async ({
  page,
  limit,
  sortBy,
  sortOrder,
  searchTerm,
  role,
  status,
}: {
  page: number;
  limit: number;
  sortBy?: "asc" | "desc";
  sortOrder?: string;
  searchTerm?: string;
  role?: string;
  status?: string;
}) => {
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    ...(searchTerm && {
      email: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }),
    ...(role && {
      role: role as Role,
    }),
    ...(status && {
      status: status as Status,
    }),
  };

  const result = await prisma.user.findMany({
    skip,
    take: limit,
    where,
    orderBy: sortBy
      ? {
          [sortBy]: sortOrder,
        }
      : {},
  });
  return result;
};

export const userService = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllFromDb,
};
