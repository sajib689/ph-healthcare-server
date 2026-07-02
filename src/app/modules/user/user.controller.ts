import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";

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
  
  const filters = pick(req.query, ["searchTerm", "role", "status", "email"])
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])

  
  const result = await userService.getAllFromDb(filters, options)

  sendResponse(res, {
    success: true,
    statusCode: 201,
    meta: result.meta,
    data: result.data,
    message: "Users retrieved successfully."
  })

})

export const userController = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllFromDb
};
