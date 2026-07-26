import * as z from "zod";

const createPatientValidationSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required"),
    address: z.string().optional(),
  }),
});

const createAdminValidationSchema = z.object({
  password: z.string(),
  admin: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required"),
    contactNumber: z.string().nonempty("Contact Number is required"),
  }),
});

const doctorSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email(),
  contactNumber: z.string().nonempty(),
  address: z.string().optional(),
  registrationNumber: z.string().nonempty(),
  experienceYears: z.number(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  appointmentFee: z.number(),
  qualification: z.string().nonempty(),
  currentWorkingPlace: z.string().nonempty(),
  designation: z.string().nonempty(),
  profilePhoto: z.string().optional(),
});

const createDoctorValidationSchema = z.object({
  password: z.string(),
  doctor: doctorSchema,
});

export const UserValidation = {
  createPatientValidationSchema,
  createAdminValidationSchema,
  createDoctorValidationSchema
};
