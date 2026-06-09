import { createPatientInput } from "./user.interface";
import bcrypt from "bcrypt";

const createPatient = async (payload: createPatientInput) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);

  const result = {
    ...payload,
    password: hashPassword,
  };
  return result;
  
};

export const userService = {
  createPatient,
};
