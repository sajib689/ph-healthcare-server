import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../helper/pick";
import { doctorFilterabledFields } from "./doctor.conosten";
import ApiError from "../../errors/ApiError";

const getFromDb = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, doctorFilterabledFields);

  const result = await DoctorService.getFromDb(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Doctor retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DoctorService.updateDoctor(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Doctor updated successfully!",
    data: result,
  });
});

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid id");
  }

  const result = await DoctorService.getSingleDoctor(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Doctor retrieved successfully!",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, "Id missing");
  }
  const result = await DoctorService.deleteDoctor(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Doctor deleted successfully!",
    data: result,
  });
  
});

export const DoctorController = {
  getFromDb,
  updateDoctor,
  getSingleDoctor,
  deleteDoctor,
};
