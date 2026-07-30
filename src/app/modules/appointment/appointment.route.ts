import express from "express"
import { AppointmentsController } from "./appointment.controller";

const router = express.Router()

router.post("/", AppointmentsController.insertAppointments)


export const appointmentRoute = router