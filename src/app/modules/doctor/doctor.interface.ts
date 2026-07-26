import { Gender } from "@prisma/client";

export type IDoctorUpdateInput = {
  name: string;
  email: string;
  contactNumber: string;
  address: string | null;
  registrationNumber: string;
  experienceYears: number;
  gender: Gender;
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  isDeleted: boolean;
  specialties: [
    {
      specialtyId: string;
      isDeleted?: boolean;
    },
  ];
};
