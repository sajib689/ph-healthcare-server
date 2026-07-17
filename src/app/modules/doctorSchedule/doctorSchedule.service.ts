import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types/common";

const insertIntoDb = async (
  user: IJWTPayload,
  payload: {
    schedulesIds: string[];
  },
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorScheduleData = payload.schedulesIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  return await prisma.doctorSchedule.createMany({
    data: doctorScheduleData,
  });

};


export const DoctorScheduleService = {
  insertIntoDb,
};
