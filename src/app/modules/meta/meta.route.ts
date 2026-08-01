import express from "express";
import { MetaController } from "./meta.controller";
import auth from "../../helper/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT),
  MetaController.metaData,
);

export const metaRoute = router;
