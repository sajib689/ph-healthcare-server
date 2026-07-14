import { addMinutes, addHours, format } from "date-fns";
import { prisma } from "../../shared/prisma";

const insertIntoDb = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const intervalTime = 30;
  const schedules = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  // Loop through the date range and create schedule entries in the database
  while (currentDate <= lastDate) {
    // startDateTime is the start time of the current date in the range, which is used to determine when to start creating schedule entries
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0]),
        ),
        Number(startTime.split(":")[1]),
      ),
    );
    // endDateTime is the end time of the last date in the range, which is used to determine when to stop creating schedule entries
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(lastDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0]),
        ),
        Number(endTime.split(":")[1]),
      ),
    );

    // Loop through the time slots and create schedule entries in the database
    while (startDateTime < endDateTime) {
      const slotStartDateTime = startDateTime;
      const slotEndDateTime = addMinutes(startDateTime, intervalTime);

      const scheduleData = {
        startDateTime: slotStartDateTime,
        endDateTime: slotEndDateTime,
      };
      // Check if the schedule already exists in the database
      const isExisting = await prisma.schedule.findFirst({
        where: scheduleData,
      });
      // If the schedule does not exist, create a new entry in the database
      if (!isExisting) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }
      slotStartDateTime.setMinutes(
        slotStartDateTime.getMinutes() + intervalTime,
      );
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const scheduleForDoctor = async (doctorId: string) => {
  console.log("doctorId", doctorId);
};

export const ScheduleService = {
  insertIntoDb,
  scheduleForDoctor,
};
