import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../helper/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/",auth (Role.ADMIN), ScheduleController.insertIntoDb);
router.get("/",auth (Role.ADMIN, Role.DOCTOR), ScheduleController.doctorSchedule);
router.delete("/:id",auth (Role.ADMIN), ScheduleController.deleteScheduleFromDb);

export const scheduleRoute = router;
