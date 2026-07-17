import { prisma } from "../../shared/prisma";
import bcrypt from "bcrypt";
import config from "../../../config";
import { jwtHelper } from "../../helper/jwtHelper";
import { Status } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: Status.ACTIVE,
    },
  });

  if (!user) {
    throw new Error("User not found!");
  }

  const isCorrectPassword = await bcrypt.compare(
    payload?.password,
    user?.password as string,
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password or email invalid");
  }

  const accessToken = jwtHelper.generateToken(
    {
      id: user?.id,
      email: user?.email,
      role: user?.role,
    },
    config.JWT_TOKEN,
    "1h",
  );

  const refreshToken = jwtHelper.generateToken(
    {
      id: user?.id,
      email: user?.email,
      role: user?.role,
    },
    config.JWT_REFRESH_TOKEN,
    "7d",
  );
  const { password, ...userWithoutPassword } = user;

  return {
    accessToken,
    refreshToken,
    userWithoutPassword,
  };
};

export const AuthService = {
  login,
};
