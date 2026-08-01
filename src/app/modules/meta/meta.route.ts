import express from "express";
import { MetaController } from "./meta.controller";

const router = express.Router();

router.get("/meta", MetaController.metaData);

export const metaRoute = router;
