import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../helper/fileUpload";

const insertSpecialties = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadFileToCloudinary(req.file);
    req.body.icon = uploadResult?.secure_url;
  }
  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getAllFromDb = async (req: Request, res: Response) => {
    
}

export const SpecialtiesService = {
  insertSpecialties,
};
