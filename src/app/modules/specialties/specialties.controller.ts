import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.insertSpecialties(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Specialties created success",
    data: result,
  });
});


export const SpecialtiesController = {
    createSpecialties
}