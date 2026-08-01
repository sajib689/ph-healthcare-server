import express from "express";
import { userRoute } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { scheduleRoute } from "../modules/schedule/schedule.route";
import { doctorScheduleRoute } from "../modules/doctorSchedule/doctorSchedule.route";
import { specialtiesRoute } from "../modules/specialties/specialties.route";
import { doctorRoute } from "../modules/doctor/doctor.route";
import path from "node:path";
import { patientRouter } from "../modules/patient/patient.route";
import { adminRoute } from "../modules/admin/admin.route";
import { appointmentRoute } from "../modules/appointment/appointment.route";
import { prescriptionRoute } from "../modules/prescription/prescription.route";
import { reviewRoute } from "../modules/review/review.route";
import { metaRoute } from "../modules/meta/meta.route";

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
  {
    path: "/patient",
    route: patientRouter,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/appointment",
    route: appointmentRoute,
  },
  {
    path: "/prescription",
    route: prescriptionRoute,
  },
  {
    path: "/review",
    route: reviewRoute,
  },
  {
    path: "/meta-data",
    route: metaRoute,
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
