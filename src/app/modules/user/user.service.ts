import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { createPatientInput } from "./user.interface";
import bcrypt from "bcrypt";
import { fileUploader } from "../../helper/fileUpload";

const createPatient = async (req: Request) => {
  
  if (req.file) {
    const uploadResult = await fileUploader.uploadFileToCloudinary(req.file);
    console.log(uploadResult);
  }

  const hashPassword = await bcrypt.hash(req.body.password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashPassword,
      },
    });

    return await tnx.patient.create({
      data: {
        name: req.body.patient.name,
        email: req.body.patient.email,
      },
    });
  });

  return result;
};

export const userService = {
  createPatient,
};
