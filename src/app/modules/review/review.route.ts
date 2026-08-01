import express from "express";
import { ReviewController } from "./review.controller";
import auth from "../../helper/auth";
import { Role } from "@prisma/client";
const router = express.Router();

router.post("/",auth (Role.PATIENT), ReviewController.insertReview)
router.get("/", auth (Role.PATIENT), ReviewController.getAllReviews)

export const reviewRoute = router;