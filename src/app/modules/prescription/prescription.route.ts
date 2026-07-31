import express from "express"
import { PrescriptionController } from "./prescription.controller";
import auth from "../../helper/auth";
import { Role } from "@prisma/client";

const router = express.Router()

router.post("/",auth(Role.DOCTOR, Role.ADMIN), PrescriptionController.createPrescription)
router.get("/",auth(Role.DOCTOR, Role.ADMIN), PrescriptionController.prescriptionsLists)
router.get("/my",auth(Role.PATIENT, Role.ADMIN), PrescriptionController.getMyPrescriptionLists)

export const prescriptionRoute = router