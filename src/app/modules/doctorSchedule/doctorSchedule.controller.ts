import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";


const insertIntoDb = catchAsync(async (req: Request & { user?: any}, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleService.insertIntoDb(req.body, user);

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