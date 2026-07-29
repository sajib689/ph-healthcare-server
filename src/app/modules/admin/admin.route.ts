import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get("/", AdminController.getAllFromDb)
router.get("/:id", AdminController.getSingleAdmin)
router.delete("/:id", AdminController.deleteAdmin)
router.delete("/:id/soft", AdminController.adminSoftDelete)
router.patch("/:id", AdminController.updateAdmin)

export const adminRoute = router;
