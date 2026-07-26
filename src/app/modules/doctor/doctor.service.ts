import { Doctor, Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.conosten";
import { prisma } from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";

const getFromDb = async (filters: any, options: IOptions) => {
  // pagination and filter get from the controller
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andCondition: Prisma.DoctorWhereInput[] = [];

  //   searchTerm wise work
  if (searchTerm) {
    andCondition.push({
      OR: doctorSearchableFields.map((filed) => ({
        [filed]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
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
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.doctor.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const doctorCount = await prisma.doctor.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: doctorCount,
    },
    data: result,
  };
};

const updateDoctor = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>,
) => {
  const doctorInfo = await prisma.doctor.findFirstOrThrow({
    where: {
      id,
    },
  });
  const { specialties, ...doctorData } = payload;

  if (specialties && specialties.length > 0) {
    const deleteSpecialtiesIds = specialties.filter(
      (specialty) => specialty.isDeleted,
    );

    // deleted the dr specialty using the for loop
    for (const specialty of deleteSpecialtiesIds) {
      await prisma.doctorSpecialties.deleteMany({
        where: {
          doctorId: id,
          specialtiesId: specialty.specialtyId,
        },
      });
    }
    // for the create specialtiesId first filter the data then using
    // the for loop create
    
    const createSpecialtyIds = specialties.filter(
      (specialty) => !specialty.isDeleted,
    );

    for (const specialty of createSpecialtyIds) {
      await prisma.doctorSpecialties.create({
        data: {
          doctorId: id,
          specialtiesId: specialty.specialtyId,
        },
      });
    }
  }

  const result = await prisma.doctor.update({
    where: {
      id: doctorInfo.id,
    },
    data: doctorData,
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  return result;
};

export const DoctorService = {
  getFromDb,
  updateDoctor,
};
