import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesController } from "./specialties.controller";
import { fileUploader } from "../../helper/fileUpload";
import { SpecialtiesValidation } from "./specialties.validation";

const router = express.Router();

router.post(
  "/create-specialties",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.createSpecialtiesValidation.parse(
      JSON.parse(req.body.data),
    );
    return SpecialtiesController.createSpecialties(req, res, next);
  },
  SpecialtiesController.createSpecialties,
);

export const specialtiesRoute = router;
