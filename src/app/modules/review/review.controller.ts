import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ReviewService } from "./review.service";
import { IJWTPayload } from "../../types/common";

const insertReview = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.insertReview(
      user as IJWTPayload,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Review inserted successfully!",
      data: result,
    });
  },
);

const getAllReviews = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.getAllReviews(user as IJWTPayload);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Reviews fetched successfully!",
      data: result,
    });
  },
);


export const ReviewController = {
  insertReview,
  getAllReviews
};
