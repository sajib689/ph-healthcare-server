const insertIntoDb = async (payload: any) => {
  console.log("Payload received in service:", payload);
  // Here you would typically insert the payload into your database.
  // For demonstration purposes, we'll just return the payload.
  return payload;
};

export const ScheduleService = {
  insertIntoDb,
};
