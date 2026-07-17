import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../helper/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/",auth (Role.DOCTOR, Role.ADMIN), ScheduleController.insertIntoDb);
router.get("/", ScheduleController.doctorSchedule);
router.delete("/:id", ScheduleController.deleteScheduleFromDb);

export const scheduleRoute = router;
