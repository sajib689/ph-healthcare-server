import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../helper/pick";
import { AdminService } from "./admin.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["searchTerm", "name", "email", "address"]);

  const result = await AdminService.getAllFromDb({ options, filters });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admins retrieved successfully!",
    data: result,
  });
});

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AdminService.getSingleAdmin(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin retrieved successfully!",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AdminService.deleteAdmin(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin deleted successfully!",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await AdminService.updateAdmin(id, data);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin updated successfully!",
    data: result,
  });
});

const adminSoftDelete = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AdminService.softDeleteAdmin(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin soft deleted successfully!",
    data: result,
  });
});

export const AdminController = {
  getAllFromDb,
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
  adminSoftDelete
};
