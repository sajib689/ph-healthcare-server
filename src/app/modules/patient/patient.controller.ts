import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { PatientService } from "./patient.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../helper/pick";

const getAllPatient = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
    const filters = pick(req.query, ["searchTerm", "name", "email", "address"])
  const result = await PatientService.getAllPatient(options, filters);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Patient retrieved successfully!",
    data: result,
  });
});

const getSinglePatient = catchAsync(async(req: Request, res: Response) => {
    const id = req.params.id
    const result = await PatientService.getSinglePatient(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Patient retrieved successfully!",
        data: result
    })
})

const deletePatient = catchAsync(async(req: Request, res: Response) => {
    const id = req.params.id
    const result = await PatientService.deletePatient(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Patient deleted successfully!",
        data: result
    })
})

export const PatientController = {
  getAllPatient,
  getSinglePatient,
  deletePatient
};
