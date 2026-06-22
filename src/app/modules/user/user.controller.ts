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

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createDoctor(req)

  sendResponse(res, {
    success: true,
    statusCode: 201,
    data: result,
    message: "Doctor created successfully!"
  })
})

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req)

  sendResponse(res, {
    success: true,
    statusCode: 201,
    data: result,
    message: "Admin created successfully!"
  })
  
})

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)

  const result = await userService.getAllFromDb({
    page,
    limit
  })

  sendResponse(res, {
    success: true,
    statusCode: 201,
    data: result,
    message: "Users retrieved successfully."
  })
})

export const userController = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllFromDb
};
