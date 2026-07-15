import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../helper/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/",auth(Role.DOCTOR), DoctorScheduleController.insertIntoDb)

export const doctorScheduleRoute = router;