import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.conosten";
import { prisma } from "../../shared/prisma";

const getFromDb = async (filters: any, options: IOptions) => {
  // pagination and filter get from the controller
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andCondition: Prisma.DoctorWhereInput[] = [];

  //   searchTerm wise work
  if (searchTerm) {
    OR: doctorSearchableFields.map((filed) => ({
      [filed]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));
  }

  //   filter wise work
  if (Object.keys(filtersData).length > 0) {
    const filterConditions = Object.keys(filtersData).map((key) => ({
      [key]: {
        equals: (filtersData as any)[key],
      },
    }));
    andCondition.push(...filterConditions);
  }

  const whereCondition: Prisma.DoctorWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {}

    const result = await prisma.doctor.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      }

    })

    const doctorCount = await prisma.doctor.count({
      where: whereCondition
    })

    return {
      meta: {
        page,
        limit,
        total: doctorCount
      },
      data: result
    }
};

export const DoctorService = {
  getFromDb,
};
