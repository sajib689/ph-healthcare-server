import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createPatient(req);
  
  sendResponse(res, {
    success: true,
    statusCode: 201,
    data: result,
    message: "Patient created successfully",
  });
  
});

export const userController = {
  createPatient,
};
