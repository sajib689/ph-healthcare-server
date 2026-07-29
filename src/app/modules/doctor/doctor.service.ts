import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.conosten";
import { prisma } from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { openai } from "../../helper/openRouter";

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
  return await prisma.$transaction(async (tnx) => {
    if (specialties && specialties.length > 0) {
      const deleteSpecialtiesIds = specialties.filter(
        (specialty) => specialty.isDeleted,
      );

      // deleted the dr specialty using the for loop
      for (const specialty of deleteSpecialtiesIds) {
        await tnx.doctorSpecialties.deleteMany({
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
        await tnx.doctorSpecialties.create({
          data: {
            doctorId: id,
            specialtiesId: specialty.specialtyId,
          },
        });
      }
    }

    const result = await tnx.doctor.update({
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
  });
};

const getSingleDoctor = async (id: string) => {
  const result = await prisma.doctor.findFirstOrThrow({
    where: {
      id,
    },
  });
  return result;
};

const deleteDoctor = async (id: string) => {
  const result = await prisma.doctor.delete({
    where: {
      id,
    },
  });
  return result;
};

const getAiSuggestion = async (payload: { symptoms: string }) => {
    if (!(payload && payload.symptoms)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "symptoms is required!")
    };

    const doctors = await prisma.doctor.findMany({
        where: { isDeleted: false },
        include: {
            doctorSpecialties: {
                include: {
                   specialties: true
                }
            }
        }
    });

    console.log("doctors data loaded.......\n");
    const prompt = `
You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
Each doctor has specialties and years of experience.
Only suggest doctors who are relevant to the given symptoms.

Symptoms: ${payload.symptoms}

Here is the doctor list (in JSON):
${JSON.stringify(doctors, null, 2)}

Return your response in JSON format with full individual doctor data. 
`;

    console.log("analyzing......\n")
    const completion = await openai.chat.completions.create({
        model: 'openai/gpt-oss-20b:free',
        messages: [
            {
                role: "system",
                content:
                    "You are a helpful AI medical assistant that provides doctor suggestions.",
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });
console.log(completion.choices[0].message)
    // const result = await extractJsonFromMessage(completion.choices[0].message)
    // return result;
}

export const DoctorService = {
  getFromDb,
  updateDoctor,
  getSingleDoctor,
  deleteDoctor,
  getAiSuggestion,
};
