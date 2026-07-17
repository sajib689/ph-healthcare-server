import express from "express";
import { SpecialtiesController } from "./specialties.controller";

const router = express.Router();

router.post("/create-specialties", SpecialtiesController.createSpecialties)

export const specialtiesRoute = router;
