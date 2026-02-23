const express = require("express");
const {
  Patient,
  Provider,
  Appointment,
  Encounter,
  Prescription,
  LabOrder,
  RadiologyOrder,
  Invoice,
  TelemedicineSession,
  ClinicalDocument
} = require("../models");

const router = express.Router();

router.get("/patient-summary", async (req, res, next) => {
  try {
    let patientId = req.query.patientId;
    if (req.user.role === "patient") {
      patientId = req.user.patientId;
      if (!patientId) {
        return res.status(403).json({ message: "Patient user is not linked to a patient record" });
      }
    } else if (!patientId) {
      return res.status(400).json({ message: "patientId is required" });
    }

    const patient = await Patient.findByPk(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const [
      appointments,
      prescriptions,
      labOrders,
      radiologyOrders,
      invoices,
      telemedicineSessions,
      documents
    ] = await Promise.all([
      Appointment.findAll({ where: { patientId }, order: [["scheduledAt", "DESC"]], limit: 10 }),
      Prescription.findAll({ where: { patientId }, order: [["createdAt", "DESC"]], limit: 10 }),
      LabOrder.findAll({ where: { patientId }, order: [["orderedAt", "DESC"]], limit: 10 }),
      RadiologyOrder.findAll({ where: { patientId }, order: [["createdAt", "DESC"]], limit: 10 }),
      Invoice.findAll({ where: { patientId }, order: [["issuedAt", "DESC"]], limit: 10 }),
      TelemedicineSession.findAll({ where: { patientId }, order: [["scheduledAt", "DESC"]], limit: 10 }),
      ClinicalDocument.findAll({ where: { patientId }, order: [["createdAt", "DESC"]], limit: 10 })
    ]);

    res.json({
      patient,
      appointments,
      prescriptions,
      labOrders,
      radiologyOrders,
      invoices,
      telemedicineSessions,
      documents
    });
  } catch (error) {
    next(error);
  }
});

router.get("/physician-summary", async (req, res, next) => {
  try {
    if (req.user.role === "patient") {
      return res.status(403).json({ message: "Forbidden for patient role" });
    }
    const providerId = req.query.providerId;
    if (!providerId) return res.status(400).json({ message: "providerId is required" });

    const provider = await Provider.findByPk(providerId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    const [appointments, encounters, prescriptions, labOrders, radiologyOrders, telemedicineSessions] =
      await Promise.all([
        Appointment.findAll({ where: { providerId }, order: [["scheduledAt", "DESC"]], limit: 20 }),
        Encounter.findAll({ where: { providerId }, order: [["encounterDate", "DESC"]], limit: 20 }),
        Prescription.findAll({ where: { providerId }, order: [["createdAt", "DESC"]], limit: 20 }),
        LabOrder.findAll({ where: { orderedByProviderId: providerId }, order: [["orderedAt", "DESC"]], limit: 20 }),
        RadiologyOrder.findAll({ where: { orderedByProviderId: providerId }, order: [["createdAt", "DESC"]], limit: 20 }),
        TelemedicineSession.findAll({ where: { providerId }, order: [["scheduledAt", "DESC"]], limit: 20 })
      ]);

    res.json({
      provider,
      appointments,
      encounters,
      prescriptions,
      labOrders,
      radiologyOrders,
      telemedicineSessions
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
