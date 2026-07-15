import express from "express";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post("/", ScheduleController.insertIntoDb);
router.get("/", ScheduleController.doctorSchedule);
router.delete("/:id", ScheduleController.deleteScheduleFromDb);

export const scheduleRoute = router;
