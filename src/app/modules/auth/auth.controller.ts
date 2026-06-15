import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../shared/sendResponse";

const login = catchAsync(async (req: Request, res: Response) => {
    
  const result = await AuthService.login(req.body);

  sendResponse(res, {
    message: "Login Successfully!",
    statusCode: 201,
    success: true,
    data: result,
  });
});

export const AuthController = {
  login,
};
