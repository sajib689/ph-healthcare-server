import { prisma } from "../../shared/prisma";
import { createPatientInput } from "./user.interface";
import bcrypt from "bcrypt";

const createPatient = async (payload: createPatientInput) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: payload.email,
        password: hashPassword,
      },
    });
    
  });
};

export const userService = {
  createPatient,
};
