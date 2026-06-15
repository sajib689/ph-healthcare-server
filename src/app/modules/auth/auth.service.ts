import { Role, Status } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { email } from "zod";
import config from "../../../config";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: Status.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user?.password as string,
  );

  if (!isCorrectPassword) {
    throw new Error("Password or email invalid");
  }

  const accessToken = await jwt.sign(
    {
      email: user?.email,
      role: user?.role,
    },
    config?.JWT_TOKEN,
    {
      algorithm: "HS256",
      expiresIn: "1h",
    },
  );

  const refreshToken = await jwt.sign(
    {
      email: user?.email,
      role: user?.role,
    },
    config.JWT_REFRESH_TOKEN,
    {
      algorithm: "HS256",
      expiresIn: "7d",
    },
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

export const AuthService = {
  login,
};
