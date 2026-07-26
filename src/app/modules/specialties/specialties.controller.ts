import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";
import httpStatus from "http-status";

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.insertSpecialties(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specialties created success",
    data: result,
  });
});

const specialtiesAll = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.getAllFromDb();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specialties retrieved success",
    data: result,
  });
});

const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await SpecialtiesService.deleteSpecialties(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specialties deleted successfully!",
    data: result,
  });
});

export const SpecialtiesController = {
  createSpecialties,
  specialtiesAll,
  deleteSpecialties
};
