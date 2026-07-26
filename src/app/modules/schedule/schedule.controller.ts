import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import pick from "../../helper/pick";
import { IJWTPayload } from "../../types/common";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const data = await ScheduleService.insertIntoDb(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Schedule data inserted successfully",
    data: data,
  });
});

const doctorSchedule = catchAsync(async (req: Request & {user?: IJWTPayload}, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["startDateTime", "endDateTime"]);

  const user = req.user 
  
  const result = await ScheduleService.scheduleForDoctor(user as IJWTPayload, options, filters);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Doctor's schedule retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const deleteScheduleFromDb = catchAsync(async (req: Request, res: Response) => {

  const scheduleId = req.params.id;
  const data = await ScheduleService.deleteScheduleFromDb(scheduleId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Schedule data deleted successfully",
    data: data,
  });

});

export const ScheduleController = {
  insertIntoDb,
  doctorSchedule,
  deleteScheduleFromDb,
};
