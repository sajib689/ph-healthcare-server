import express from "express";
import { userRoute } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { scheduleRoute } from "../modules/schedule/schedule.route";
import { doctorScheduleRoute } from "../modules/doctorSchedule/doctorSchedule.route";

import { specialtiesRoute } from "../modules/specialties/specialties.route";
import path from "node:path";
import { doctorRoute } from "../modules/doctor/doctor.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/auth",
    route: authRoutes,
  },

  {
    path: "/schedule",
    route: scheduleRoute,
  },
  {
    path: "/doctor-schedule",
    route: doctorScheduleRoute,
  },
  {
    path: "/specialties",
    route: specialtiesRoute,
  },
  {
    path: "/doctor",
    route: doctorRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
