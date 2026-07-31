import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { PrescriptionService } from "./prescription.service";
import { IJWTPayload } from "../../types/common";
import pick from "../../helper/pick";

const createPrescription = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;

    const result = await PrescriptionService.createPrescription(
      user as IJWTPayload,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Prescription created successfully!",
      data: result,
    });
  },
);

const prescriptionsLists = catchAsync(async (req: Request, res: Response) => {

  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["searchTerm", "name", "email", "address"]);

  const result = await PrescriptionService.getAllPrescriptions(options, filters)

      sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Prescription retrieved successfully!",
      data: result,
    });
});

const getMyPrescriptionLists = catchAsync(async (req: Request & {user?: any}, res: Response) => {
  const user = req.user
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["searchTerm", "name", "email", "address"]);

  const result = await PrescriptionService.getMyPrescriptions(user,options,filters)

     sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Patient prescriptions retrieved successfully!",
      data: result,
    });
})

export const PrescriptionController = {
  createPrescription,
  prescriptionsLists,
  getMyPrescriptionLists
};
