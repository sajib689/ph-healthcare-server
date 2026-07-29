import express from "express";
import { DoctorController } from "./doctor.controller";

const router = express.Router();

router.get("/", DoctorController.getFromDb);
router.patch("/:id", DoctorController.updateDoctor);
router.get("/:id", DoctorController.getSingleDoctor)
router.delete("/:id", DoctorController.deleteDoctor)

router.post("/suggestion", DoctorController.getAiSuggestion)

export const doctorRoute = router;
