import { prisma } from "../shared/prisma";
import bcrypt from "bcrypt";
import { Role, Status } from "@prisma/client";

const seedAdmin = async () => {
  try {
    const admin = "admin@example.com";
    const isAdminExists = await prisma.user.findUnique({
      where: {
        email: admin,
      },
    });

    if (isAdminExists) {
      console.log("Admin Already exits");
      return
    }
    const hashPassword = await bcrypt.hash("123456", 10);

    await prisma.$transaction(async (tnx) => {
      await tnx.user.create({
        data: {
          email: admin,
          password: hashPassword,
          role: Role.ADMIN,
          status: Status.ACTIVE,
          needPasswordChange: false,
        },
      });
      await tnx.admin.create({
        data: {
          name: "Super Admin",
          email: admin,
          profilePhoto: "https://i.pravatar.cc/300",
          contactNumber: "+8801712345678",
        },
      });
    });
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

export default seedAdmin