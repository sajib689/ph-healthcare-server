import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";
import { MetaService } from "./meta.service";

const metaData = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;

    const metaDate = await MetaService.getMetaDate(user as IJWTPayload);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Meta data retrieved successfully!",
      data: metaDate,
    });
  },
);

export const MetaController = {
  metaData,
};