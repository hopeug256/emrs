const express = require("express");
const { Op } = require("sequelize");
const {
  CalendarEvent,
  Appointment,
  Surgery,
  TelemedicineSession,
  Patient,
  Provider,
  TheatreProcedure
} = require("../models");

const router = express.Router();

router.get("/timeline", async (req, res, next) => {
  try {
    const start = req.query.start ? new Date(req.query.start) : new Date(Date.now() - 7 * 86400000);
    const end = req.query.end ? new Date(req.query.end) : new Date(Date.now() + 30 * 86400000);

    const [events, appointments, surgeries, teleSessions] = await Promise.all([
      CalendarEvent.findAll({
        where: { startAt: { [Op.between]: [start, end] } },
        include: [Patient, Provider, Appointment, Surgery, TelemedicineSession],
        order: [["startAt", "ASC"]]
      }),
      Appointment.findAll({
        where: { scheduledAt: { [Op.between]: [start, end] } },
        include: [Patient, Provider],
        order: [["scheduledAt", "ASC"]]
      }),
      Surgery.findAll({
        where: { scheduledStart: { [Op.between]: [start, end] } },
        include: [Patient, { model: Provider, as: "primarySurgeon" }, TheatreProcedure],
        order: [["scheduledStart", "ASC"]]
      }),
      TelemedicineSession.findAll({
        where: { scheduledAt: { [Op.between]: [start, end] } },
        include: [Patient, Provider],
        order: [["scheduledAt", "ASC"]]
      })
    ]);

    const normalized = [
      ...events.map((event) => ({
        id: event.id,
        source: "CalendarEvent",
        type: event.eventType,
        title: event.title,
        startAt: event.startAt,
        endAt: event.endAt,
        status: event.status,
        patient: event.Patient ? `${event.Patient.mrn} - ${event.Patient.firstName} ${event.Patient.lastName}` : null,
        provider: event.Provider ? `${event.Provider.providerCode} - ${event.Provider.firstName} ${event.Provider.lastName}` : null
      })),
      ...appointments.map((item) => ({
        id: item.id,
        source: "Appointment",
        type: "Appointment",
        title: item.reason || "Consultation",
        startAt: item.scheduledAt,
        endAt: item.scheduledAt,
        status: item.status,
        patient: item.Patient ? `${item.Patient.mrn} - ${item.Patient.firstName} ${item.Patient.lastName}` : null,
        provider: item.Provider ? `${item.Provider.providerCode} - ${item.Provider.firstName} ${item.Provider.lastName}` : null
      })),
      ...surgeries.map((item) => ({
        id: item.id,
        source: "Surgery",
        type: "Surgery",
        title: item.TheatreProcedure?.name || "Surgery",
        startAt: item.scheduledStart,
        endAt: item.scheduledEnd || item.scheduledStart,
        status: item.status,
        patient: item.Patient ? `${item.Patient.mrn} - ${item.Patient.firstName} ${item.Patient.lastName}` : null,
        provider: item.primarySurgeon
          ? `${item.primarySurgeon.providerCode} - ${item.primarySurgeon.firstName} ${item.primarySurgeon.lastName}`
          : null
      })),
      ...teleSessions.map((item) => ({
        id: item.id,
        source: "TelemedicineSession",
        type: "Telemedicine",
        title: "Virtual Consultation",
        startAt: item.scheduledAt,
        endAt: item.scheduledAt,
        status: item.status,
        patient: item.Patient ? `${item.Patient.mrn} - ${item.Patient.firstName} ${item.Patient.lastName}` : null,
        provider: item.Provider ? `${item.Provider.providerCode} - ${item.Provider.firstName} ${item.Provider.lastName}` : null
      }))
    ].sort((a, b) => new Date(a.startAt) - new Date(b.startAt));

    res.json({
      start: start.toISOString(),
      end: end.toISOString(),
      total: normalized.length,
      items: normalized
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
