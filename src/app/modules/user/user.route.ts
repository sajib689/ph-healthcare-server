import express from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../helper/fileUpload";
const router = express.Router();

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  userController.createPatient,
);

export const userRoute = router;
