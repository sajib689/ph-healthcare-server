import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../helper/auth";
import { Role } from "@prisma/client";
import validationRequest from "../../middlewares/validationRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = express.Router();

router.post(
  "/",
  validationRequest(
    DoctorScheduleValidation.createDoctorScheduleValidationSchema,
  ),
  auth(Role.DOCTOR),
  DoctorScheduleController.insertIntoDb,
);

export const doctorScheduleRoute = router;
