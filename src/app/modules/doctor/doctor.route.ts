import express from "express";
import { DoctorController } from "./doctor.controller";

const router = express.Router();

router.get("/", DoctorController.getFromDb);
router.patch("/:id", DoctorController.updateDoctor);

export const doctorRoute = router;
