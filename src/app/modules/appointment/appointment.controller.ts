import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";

const insertAppointments = catchAsync(async (req: Request, res: Response) => {

})

export const AppointmentsController = {
    insertAppointments
}