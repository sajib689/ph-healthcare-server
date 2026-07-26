import { z } from "zod";

const createSpecialtiesValidation = z.object({
  title: z.string().nonempty("Title is required!"),

  icon: z.string().nonempty("Icon is required!"),

  doctorSpecialties: z.array(
    z.object({
      name: z.string().nonempty("Specialty name is required!"),
      description: z.string().optional(),
    }),
  ),
});

export const SpecialtiesValidation = {
  createSpecialtiesValidation,
};
