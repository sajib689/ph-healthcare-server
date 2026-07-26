import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { IJWTPayload } from "../../types/common";


const insertIntoDb = catchAsync(async (req: Request & { user?: IJWTPayload}, res: Response) => {
    const user = req?.user;

    const result = await DoctorScheduleService.insertIntoDb(user as IJWTPayload, req.body);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Doctor schedule inserted successfully",
      data: result
    });
});

export const DoctorScheduleController = {
  insertIntoDb,
};