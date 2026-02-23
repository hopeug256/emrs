const express = require("express");
const { Appointment, AppointmentSeries } = require("../models");

const router = express.Router();

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

router.post("/appointments/recurring", async (req, res, next) => {
  try {
    const {
      seriesNumber,
      patientId,
      providerId,
      departmentId,
      reason,
      startDate,
      frequency = "Weekly",
      intervalValue = 1,
      occurrences = 4,
      bookingRuleId
    } = req.body;
    if (!seriesNumber || !patientId || !providerId || !startDate) {
      return res.status(400).json({ message: "seriesNumber, patientId, providerId, startDate are required" });
    }

    const series = await AppointmentSeries.create({
      seriesNumber,
      patientId,
      providerId,
      bookingRuleId: bookingRuleId || null,
      frequency,
      intervalValue,
      occurrences
    });

    const created = [];
    let current = new Date(startDate);
    for (let i = 0; i < occurrences; i += 1) {
      const appointment = await Appointment.create({
        scheduledAt: current,
        reason: reason || "Recurring appointment",
        status: "Scheduled",
        patientId,
        providerId,
        departmentId: departmentId || null,
        appointmentSeriesId: series.id
      });
      created.push(appointment);
      const step = frequency === "Daily" ? 1 : frequency === "Monthly" ? 30 : 7;
      current = addDays(current, step * intervalValue);
    }

    res.status(201).json({ series, appointments: created });
  } catch (error) {
    next(error);
  }
});

router.post("/appointments/:id/confirm", async (req, res, next) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    await appt.update({
      notes: `${appt.notes || ""}\n[Confirmed at ${new Date().toISOString()}]`.trim()
    });
    res.json(appt);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

