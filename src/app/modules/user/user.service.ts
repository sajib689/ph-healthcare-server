import { prisma } from "../../shared/prisma";
import { createPatientInput } from "./user.interface";
import bcrypt from "bcrypt";

const createPatient = async (payload: any) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: payload.patient.email,
        password: hashPassword,
      },
    });

    return await tnx.patient.create({
      data: {
        name: payload.patient.name,
        email: payload.patient.email,
      },
    });
  });

  return result;
};

export const userService = {
  createPatient,
};
