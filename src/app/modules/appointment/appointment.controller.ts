import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { IJWTPayload } from "../../types/common";
import pick from "../../helper/pick";

const insertAppointments = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;

    const result = await AppointmentService.insertAppointments(
      user as IJWTPayload,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Appointment created successfully!",
      data: result,
    });
  },
);

const getAllAppointments = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["searchTerm", "name", "email", "address"]);

    const user = req.user;

    const result = await AppointmentService.getAllFromDb(
      user as IJWTPayload,
      options,
      filters,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Appointment retrieved successfully!",
      data: result,
    });
  },
);

const deleteAppointments = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AppointmentService.deleteAppointment(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Appointment deleted successfully!",
    data: result,
  });
});

const updateAppointmentStatus = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const id = req.params.id;
    const user = req.user;
    const status = req.body;

    const result = await AppointmentService.updateAppointmentStatus(
      id,
      status,
      user as IJWTPayload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Appointment updated successfully!",
      data: result,
    });
  },
);

export const AppointmentsController = {
  insertAppointments,
  getAllAppointments,
  deleteAppointments,
  updateAppointmentStatus
};
