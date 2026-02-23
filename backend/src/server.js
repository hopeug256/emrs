require("dotenv").config();
const bcrypt = require("bcryptjs");
const app = require("./app");
const {
  sequelize,
  Department,
  Provider,
  Patient,
  Medication,
  User,
  TheatreRoom,
  TheatreProcedure,
  Surgery
} = require("./models");

const port = process.env.PORT || 4000;

async function seed() {
  const [dept] = await Department.findOrCreate({
    where: { name: "General Medicine" },
    defaults: { location: "Block A" }
  });

  await Provider.findOrCreate({
    where: { providerCode: "DOC-1001" },
    defaults: {
      firstName: "Aisha",
      lastName: "Rahman",
      specialty: "Internal Medicine",
      departmentId: dept.id
    }
  });

  await Patient.findOrCreate({
    where: { mrn: "MRN-0001" },
    defaults: {
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      dateOfBirth: "1990-05-15",
      phone: "555-0101",
      status: "Active"
    }
  });

  await Medication.findOrCreate({
    where: { name: "Paracetamol" },
    defaults: { genericName: "Acetaminophen", form: "Tablet", strength: "500mg", stockQuantity: 120 }
  });

  const [room] = await TheatreRoom.findOrCreate({
    where: { code: "OT-1" },
    defaults: {
      name: "Operation Theatre 1",
      location: "Surgical Block - Floor 2",
      status: "Available"
    }
  });

  const [procedure] = await TheatreProcedure.findOrCreate({
    where: { code: "APP-001" },
    defaults: {
      name: "Appendectomy",
      specialty: "General Surgery",
      estimatedDurationMinutes: 90,
      riskLevel: "Medium"
    }
  });

  const defaultPasswordHash = await bcrypt.hash("ChangeMe123!", 10);
  const defaultUsers = [
    { username: "admin", fullName: "System Admin", role: "admin" },
    { username: "doctor", fullName: "Demo Doctor", role: "doctor" },
    { username: "nurse", fullName: "Demo Nurse", role: "nurse" },
    { username: "receptionist", fullName: "Front Desk", role: "receptionist" }
  ];

  for (const user of defaultUsers) {
    const [record, created] = await User.findOrCreate({
      where: { username: user.username },
      defaults: {
        ...user,
        passwordHash: defaultPasswordHash,
        mustChangePassword: true,
        isActive: true
      }
    });

    if (!created && record.mustChangePassword !== true) {
      await record.update({ mustChangePassword: true });
    }
  }

  const samplePatient = await Patient.findOne({ where: { mrn: "MRN-0001" } });
  if (samplePatient) {
    await User.findOrCreate({
      where: { username: "patient1" },
      defaults: {
        fullName: `${samplePatient.firstName} ${samplePatient.lastName}`,
        role: "patient",
        patientId: samplePatient.id,
        passwordHash: defaultPasswordHash,
        mustChangePassword: true,
        isActive: true
      }
    });
  }

  const patient = await Patient.findOne({ where: { mrn: "MRN-0001" } });
  const provider = await Provider.findOne({ where: { providerCode: "DOC-1001" } });

  if (patient && provider) {
    await Surgery.findOrCreate({
      where: { surgeryNumber: "SURG-1001" },
      defaults: {
        surgeryNumber: "SURG-1001",
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        priority: "Elective",
        status: "Scheduled",
        theatreRoomId: room.id,
        theatreProcedureId: procedure.id,
        patientId: patient.id,
        primarySurgeonId: provider.id,
        notes: "Sample scheduled surgery"
      }
    });
  }
}

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    await seed();
    app.listen(port, () => {
      console.log(`EMRS backend running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
