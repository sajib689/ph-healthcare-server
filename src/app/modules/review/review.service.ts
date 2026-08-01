import { AppointmentStatus, PaymentStatus, Review } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import httpStatus from "http-status";
import { IJWTPayload } from "../../types/common";

const insertReview = async (user: IJWTPayload, reviewData: Review) => {
  const appointment = await prisma.appointment.findFirstOrThrow({
    where: {
      id: reviewData.appointmentId,
      appointmentId: reviewData.appointmentId,
      patientId: user.id,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
  });

  const isExitingReview = await prisma.review.findFirst({
    where: {
      appointmentId: appointment.id,
      patientId: user.id,
    },
  });

  if (isExitingReview) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already submitted a review for this appointment",
    );
  }

  if (reviewData.rating < 1 || reviewData.rating > 5) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Rating must be between 1 and 5",
    );
  }

  return await prisma.review.create({
    data: reviewData,
  });
};

const getAllReviews = async (user: IJWTPayload) => {
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  return await prisma.review.findMany({
    where: {
      patientId: user.id,
    },
  });
};

export const ReviewService = {
  insertReview,
  getAllReviews,
};
