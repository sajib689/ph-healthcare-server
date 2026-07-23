import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../helper/pick";
import { doctorFilterabledFields } from "./doctor.conosten";

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


export const DoctorController = {
  getFromDb,
};
