import { prisma } from "../../shared/prisma";

const insertAppointments = async (payload: any) => {
    
  const result = await prisma.appointment.create(payload);
  return result;
};

export const AppointmentService = {
  insertAppointments,
};
