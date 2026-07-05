import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const data = await ScheduleService.insertIntoDb(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Schedule data inserted successfully",
    data: data,
  });
});

export const ScheduleController = {
  insertIntoDb,
};
