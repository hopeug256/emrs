const express = require("express");
const { Op } = require("sequelize");
const { Notification, Appointment, Patient, Provider, Department } = require("../models");

const router = express.Router();

router.post("/appointment-reminders/generate", async (req, res, next) => {
  try {
    const hours = Number(req.body.hours || 24);
    const now = new Date();
    const until = new Date(now.getTime() + hours * 60 * 60 * 1000);

    const upcoming = await Appointment.findAll({
      where: {
        status: "Scheduled",
        scheduledAt: { [Op.gte]: now, [Op.lte]: until }
      },
      include: [{ model: Patient }, { model: Provider }, { model: Department }]
    });

    const created = [];
    for (const appt of upcoming) {
      const reminder = await Notification.create({
        patientId: appt.patientId,
        appointmentId: appt.id,
        createdByUserId: req.user.id,
        channel: "InApp",
        type: "AppointmentReminder",
        title: "Upcoming appointment reminder",
        message: `Appointment on ${new Date(appt.scheduledAt).toLocaleString()} with ${appt.Provider ? `${appt.Provider.firstName} ${appt.Provider.lastName}` : "provider"}.`,
        status: "Sent",
        sentAt: new Date()
      });
      created.push(reminder);
    }

    res.json({ generated: created.length, reminders: created });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

