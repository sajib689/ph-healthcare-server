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
  const sortBy = req.query.sortBy as "asc" || "desc"
  const sortOrder = req.query.sortOrder as string
  const searchTerm = req.query.searchTerm as string
  const role = req.query.role as string
  const status = req.query.status as string
  
  const result = await userService.getAllFromDb({
    page,
    limit,
    sortBy,
    sortOrder,
    searchTerm,
    role,
    status
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
