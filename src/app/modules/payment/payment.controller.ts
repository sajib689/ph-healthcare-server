import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  const result = await PaymentService.stripeWebhook(req.body, signature);
    console.log(result)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Webhook request sent successfully!",
    data: result,
  });
});

export const PaymentController = {
  stripeWebhook,
};
