import express from "express"
import { AppointmentsController } from "./appointment.controller";
import auth from "../../helper/auth";
import { Role } from "@prisma/client";

const router = express.Router()

router.post("/",auth(Role.PATIENT), AppointmentsController.insertAppointments)
router.get("/",auth(Role.PATIENT, Role.DOCTOR), AppointmentsController.getAllAppointments)
router.delete("/:id",auth(Role.ADMIN), AppointmentsController.deleteAppointments)
router.patch("/:id",auth(Role.ADMIN, Role.DOCTOR), AppointmentsController.updateAppointmentStatus)

export const appointmentRoute = router