import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { prisma } from "../../shared/prisma";
import { patientSearchableFields } from "./patient.conostent";

const getAllPatient = async (options: IOptions, filters: any) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andCondition: Prisma.PatientWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: patientSearchableFields.map((filed) => ({
        [filed]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const whereCondition: Prisma.PatientWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};


  const result = await prisma.patient.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const patientCount = await prisma.patient.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: patientCount,
    },
    data: result,
  };
};

const getSinglePatient = async (id: string) => {
    const result = await prisma.patient.findFirstOrThrow({
        where: {
            id
        }
    })
    return result
}

const deletePatient = async (id: string) => {
    const result = await prisma.patient.delete({
        where: {
            id
        }
    })
    return result
}

export const PatientService = {
  getAllPatient,
  getSinglePatient,
  deletePatient
};
