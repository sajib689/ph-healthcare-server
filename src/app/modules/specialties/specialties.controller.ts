import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";
import  httpStatus  from 'http-status';

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.insertSpecialties(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specialties created success",
    data: result,
  });
});


export const SpecialtiesController = {
    createSpecialties
}