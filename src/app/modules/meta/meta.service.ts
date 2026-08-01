import { PaymentStatus, Role } from "@prisma/client";
import { IJWTPayload } from "../../types/common";
import { prisma } from "../../shared/prisma";

const getMetaDate = async (user: IJWTPayload) => {

  console.log("User:", user);
  console.log("Role:", user.role);
  console.log("Role enum:", Role);

  let metaData;
  switch (user?.role) {
    case Role.ADMIN:
      metaData = "Admin Meta Data";
      metaData = await getAdminMetaData();
      break;
    case Role.DOCTOR:
      metaData = "Doctor Meta Data";
      metaData = await getDoctorMetaData(user);
      break;
    case Role.PATIENT:
      metaData = "Patient Meta Data";
      metaData = await getPatientMetaData(user);
      break;
    default:
      throw new Error("Invalid user role");
  }
  return metaData;
};

const getAdminMetaData = async () => {
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const appointmentCount = await prisma.appointment.count();
  const reviewCount = await prisma.review.count();
  const prescriptionCount = await prisma.prescription.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });
  const totalPayments = await prisma.payment.count();
  const barChartData = await getBarChartData();
  const pieChart = await pieChartData();
  const metaData = {
    totalPatients: patientCount,
    totalDoctors: doctorCount,
    totalAppointments: appointmentCount,
    totalReviews: reviewCount,
    totalPrescriptions: prescriptionCount,
    totalRevenue: totalRevenue._sum.amount,
    totalPayments: totalPayments,
    barChartData,
    pieChart,
  };

  return metaData;
};

const getDoctorMetaData = async (user: IJWTPayload) => {
  const totalAppointments = await prisma.appointment.count({
    where: {
      doctorId: user.id,
    },
  });
  const totalReviews = await prisma.review.count({
    where: {
      doctorId: user.id,
    },
  });

  return { totalAppointments, totalReviews };
};

const getPatientMetaData = async (user: IJWTPayload) => {
  const totalAppointments = await prisma.appointment.count({
    where: {
      patientId: user.id,
    },
  });
  const totalReviews = await prisma.review.count({
    where: {
      patientId: user.id,
    },
  });
  const totalPrescriptions = await prisma.prescription.count({
    where: {
      patientId: user.id,
    },
  });

  return { totalAppointments, totalReviews, totalPrescriptions };
};

const getBarChartData = async () => {
  const appointmentsPerMonth = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") AS month,
        CAST(COUNT(*) AS INTEGER) AS COUNT
        FROM "appointments"
        GROUP BY month
        ORDER BY month asc
 `;

  return appointmentsPerMonth;
};

const pieChartData = async () => {
  const appointmentsPerStatus = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  const dataFormate = appointmentsPerStatus.map(({ status, _count }) => ({
    status,
    count: Number(_count.id),
  }));

  return dataFormate;
};

export const MetaService = {
  getMetaDate,
 
};
