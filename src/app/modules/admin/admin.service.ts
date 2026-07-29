import { Admin, Prisma, Status } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { adminSearchableFields } from "./admin.constant";
import { prisma } from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const getAllFromDb = async ({
  options,
  filters,
}: {
  options: IOptions;
  filters: any;
}) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.AdminWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((filed) => ({
        [filed]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const whereConditions: Prisma.AdminWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.admin.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleAdmin = async (id: string) => {
  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not Found");
  }
  const result = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  });
  return result;
};

const deleteAdmin = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (tnx) => {
    const adminDeleteData = await tnx.admin.delete({
      where: {
        id,
      },
    });
    await tnx.user.delete({
      where: {
        email: adminDeleteData.email,
      },
    });

    return adminDeleteData;
  });
  return result;
};

const updateAdmin = async (
  id: string,
  data: Partial<Admin>,
): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

const softDeleteAdmin = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tnx) => {

    const deleteAdmin = await tnx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await tnx.user.update({
      where: {
        email: deleteAdmin.email,
      },
      data: {
        status: Status.DELETED,
      },
    });
    
    return deleteAdmin;
  });
  return result;
};

export const AdminService = {
  getAllFromDb,
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
  softDeleteAdmin
};
