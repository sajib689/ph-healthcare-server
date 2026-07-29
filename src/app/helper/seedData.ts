import bcrypt from "bcrypt";
import { Gender, Role, Status } from "@prisma/client";
import { prisma } from "../shared/prisma";

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const futureDate = (daysFromNow: number, hour: number, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const specialtiesData = [
  { title: "Cardiology", icon: "❤️" },
  { title: "Neurology", icon: "🧠" },
  { title: "Dermatology", icon: "🩺" },
  { title: "Pediatrics", icon: "👶" },
  { title: "Orthopedics", icon: "🦴" },
];

const doctorProfiles = [
  {
    name: "Dr. Anik Ahmed",
    email: "anik.ahmed@example.com",
    profilePhoto: "https://i.pravatar.cc/150?img=10",
    contactNumber: "+8801710012345",
    address: "House 15, Banani, Dhaka",
    registrationNumber: "REG-1001",
    experienceYears: 8,
    gender: Gender.MALE,
    appointmentFee: 1500,
    qualification: "MBBS, FCPS",
    currentWorkingPlace: "City Care Hospital",
    designation: "Consultant Cardiologist",
  },
  {
    name: "Dr. Riya Islam",
    email: "riya.islam@example.com",
    profilePhoto: "https://i.pravatar.cc/150?img=12",
    contactNumber: "+8801710012346",
    address: "Road 5, Dhanmondi, Dhaka",
    registrationNumber: "REG-1002",
    experienceYears: 6,
    gender: Gender.FEMALE,
    appointmentFee: 1300,
    qualification: "MBBS, FCPS",
    currentWorkingPlace: "Green Valley Clinic",
    designation: "Consultant Neurologist",
  },
  {
    name: "Dr. Fahim Hossain",
    email: "fahim.hossain@example.com",
    profilePhoto: "https://i.pravatar.cc/150?img=14",
    contactNumber: "+8801710012347",
    address: "Sector 7, Uttara, Dhaka",
    registrationNumber: "REG-1003",
    experienceYears: 5,
    gender: Gender.MALE,
    appointmentFee: 1200,
    qualification: "MBBS, MCPS",
    currentWorkingPlace: "North Care Hospital",
    designation: "Dermatologist",
  },
  {
    name: "Dr. Sara Rahman",
    email: "sara.rahman@example.com",
    profilePhoto: "https://i.pravatar.cc/150?img=16",
    contactNumber: "+8801710012348",
    address: "House 34, Mirpur, Dhaka",
    registrationNumber: "REG-1004",
    experienceYears: 7,
    gender: Gender.FEMALE,
    appointmentFee: 1250,
    qualification: "MBBS, FCPS",
    currentWorkingPlace: "Family Health Clinic",
    designation: "Pediatrician",
  },
];

const patientProfiles = [
  {
    name: "Rashed Khan",
    email: "rashed.khan@example.com",
    profilePhoto: "https://i.pravatar.cc/150?img=20",
    address: "House 22, Gulshan, Dhaka",
  },
  {
    name: "Mina Akter",
    email: "mina.akter@example.com",
    profilePhoto: "https://i.pravatar.cc/150?img=22",
    address: "House 51, Motijheel, Dhaka",
  },
  {
    name: "Tania Chowdhury",
    email: "tania.chowdhury@example.com",
    profilePhoto: "https://i.pravatar.cc/150?img=24",
    address: "House 18, Banani, Dhaka",
  },
  {
    name: "Imran Hossain",
    email: "imran.hossain@example.com",
    profilePhoto: "https://i.pravatar.cc/150?img=26",
    address: "House 7, Mirpur, Dhaka",
  },
];

const ensureUser = async (email: string, role: Role, passwordHash: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      email,
      password: passwordHash,
      role,
      status: Status.ACTIVE,
      needPasswordChange: false,
    },
  });
};

const createAdmin = async (passwordHash: string) => {
  const adminEmail = "admin@example.com";
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });
  if (existingAdmin) {
    console.log("Admin user already exists.");
    return;
  }

  await ensureUser(adminEmail, Role.ADMIN, passwordHash);

  await prisma.admin.create({
    data: {
      name: "Super Admin",
      email: adminEmail,
      profilePhoto: "https://i.pravatar.cc/150?img=5",
      contactNumber: "+8801712345678",
    },
  });

  console.log("Seeded admin user.");
};

const createSpecialties = async () => {
  const savedSpecialties = [] as { id: string; title: string }[];

  for (const specialty of specialtiesData) {
    const existing = await prisma.specialties.findFirst({
      where: { title: specialty.title },
    });

    if (existing) {
      savedSpecialties.push(existing);
      continue;
    }

    const created = await prisma.specialties.create({
      data: specialty,
    });
    savedSpecialties.push(created);
  }

  console.log(`Seeded ${savedSpecialties.length} specialties.`);
  return savedSpecialties;
};

const createDoctors = async (specialtyIds: string[], passwordHash: string) => {
  const doctorRecords = [] as Array<{ id: string; email: string; name: string }>;

  for (const doctor of doctorProfiles) {
    const existing = await prisma.doctor.findUnique({
      where: { email: doctor.email },
    });

    if (existing) {
      doctorRecords.push(existing);
      continue;
    }

    await ensureUser(doctor.email, Role.DOCTOR, passwordHash);

    const createdDoctor = await prisma.doctor.create({
      data: {
        ...doctor,
      },
    });

    doctorRecords.push(createdDoctor);
  }

  const specialtyAssignments = doctorRecords.flatMap((doctor) => {
    const selected = [
      specialtyIds[randomInt(0, specialtyIds.length - 1)],
      specialtyIds[randomInt(0, specialtyIds.length - 1)],
    ]
      .filter((value, index, self) => self.indexOf(value) === index)
      .slice(0, 2);

    return selected.map((specialtyId) => ({
      doctorId: doctor.id,
      specialtiesId: specialtyId,
    }));
  });

  await prisma.doctorSpecialties.createMany({
    data: specialtyAssignments,
    skipDuplicates: true,
  });

  console.log(`Seeded ${doctorRecords.length} doctors.`);
  return doctorRecords;
};

const createPatients = async (passwordHash: string) => {
  const patientRecords = [] as Array<{ id: string; email: string }>

  for (const patient of patientProfiles) {
    const existing = await prisma.patient.findUnique({
      where: { email: patient.email },
    });

    if (existing) {
      patientRecords.push(existing);
      continue;
    }

    await ensureUser(patient.email, Role.PATIENT, passwordHash);

    const createdPatient = await prisma.patient.create({
      data: {
        ...patient,
      },
    });

    patientRecords.push(createdPatient);
  }

  console.log(`Seeded ${patientRecords.length} patients.`);
  return patientRecords;
};

const createSchedules = async (doctors: Array<{ id: string; name: string }>) => {
  const scheduleTemplates = [
    { days: 1, hour: 9 },
    { days: 1, hour: 10 },
    { days: 2, hour: 11 },
    { days: 2, hour: 14 },
    { days: 3, hour: 15 },
  ];

  for (const doctor of doctors) {
    for (const template of scheduleTemplates) {
      const startDateTime = futureDate(template.days, template.hour);
      const endDateTime = new Date(startDateTime.getTime() + 35 * 60 * 1000);

      let schedule = await prisma.schedule.findFirst({
        where: { startDateTime },
      });

      if (!schedule) {
        schedule = await prisma.schedule.create({
          data: {
            startDateTime,
            endDateTime,
          },
        });
      }

      await prisma.doctorSchedule.upsert({
        where: {
          doctorId_scheduleId: {
            doctorId: doctor.id,
            scheduleId: schedule.id,
          },
        },
        create: {
          doctorId: doctor.id,
          scheduleId: schedule.id,
          isBooked: false,
        },
        update: {},
      });
    }
  }

  console.log(`Seeded schedules for ${doctors.length} doctors.`);
};

const seedData = async () => {
  try {
    const passwordHash = await bcrypt.hash("Password123!", 10);

    await createAdmin(passwordHash);
    const specialties = await createSpecialties();
    const doctors = await createDoctors(specialties.map((item) => item.id), passwordHash);
    await createPatients(passwordHash);
    await createSchedules(doctors);

    console.log("Fake data seed finished successfully.");
  } catch (error) {
    console.error("Error seeding fake data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export default seedData;
