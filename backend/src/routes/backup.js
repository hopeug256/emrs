const express = require("express");
const { BackupSchedule, BackupLog } = require("../models");

const router = express.Router();

router.post("/run/:scheduleId", async (req, res, next) => {
  try {
    const schedule = await BackupSchedule.findByPk(req.params.scheduleId);
    if (!schedule) return res.status(404).json({ message: "Backup schedule not found" });

    const log = await BackupLog.create({
      backupScheduleId: schedule.id,
      runAt: new Date(),
      status: "Success",
      detail: `Backup run simulated for ${schedule.name}`,
      triggeredByUserId: req.user.id
    });
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
