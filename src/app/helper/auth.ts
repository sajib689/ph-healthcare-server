import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "./jwtHelper";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.cookies.accessToken || req.headers.authorization;

      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "You are not authorized to access this route",
        );
      }

      const jwtSecret = process.env.JWT_TOKEN;

      if (!jwtSecret) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "JWT_TOKEN is not defined");
      }

      const decoded = jwtHelper.verifyToken(token, jwtSecret);

      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
