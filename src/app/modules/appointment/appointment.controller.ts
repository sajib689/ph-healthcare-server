import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import  httpStatus  from 'http-status';

const insertAppointments = catchAsync(async (req: Request, res: Response) => {

    const result = await AppointmentService.insertAppointments(req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Appointment created successfully!",
        data: result
    })
})

export const AppointmentsController = {
    insertAppointments
}