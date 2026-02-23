const express = require("express");
const { Appointment } = require("../models");

const router = express.Router();

router.post("/:id/mark-no-show", async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    await appointment.update({
      status: "NoShow",
      notes: req.body.notes || appointment.notes
    });
    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
