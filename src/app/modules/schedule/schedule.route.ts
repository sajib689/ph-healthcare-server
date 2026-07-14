import express from "express";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post("/", ScheduleController.insertIntoDb);
router.get("/", ScheduleController.doctorSchedule);

export const scheduleRoute = router;