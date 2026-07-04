import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../helper/fileUpload";
import { UserValidation } from "./user.validation";
import auth from "../../helper/auth";
import { Role } from "@prisma/client";
const router = express.Router();

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatientValidationSchema.parse(
      JSON.parse(req.body.data),
    );
    return userController.createPatient(req, res, next);
  },
);

router.post(
  "/create-admin",
  auth(Role.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdminValidationSchema.parse(
      JSON.parse(req.body.data),
    );
  },
);
router.post(
  "/create-doctor",
  auth(Role.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createDoctorValidationSchema.parse(
      JSON.parse(req.body.data),
    );
  },
);

router.get("/", auth(Role.ADMIN, Role.DOCTOR), userController.getAllFromDb);

export const userRoute = router;
