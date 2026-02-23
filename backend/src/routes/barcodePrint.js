const express = require("express");
const { BarcodeLabel, PrintJob } = require("../models");

const router = express.Router();

router.get("/resolve/:barcode", async (req, res, next) => {
  try {
    const label = await BarcodeLabel.findOne({ where: { barcode: req.params.barcode, status: "Active" } });
    if (!label) return res.status(404).json({ message: "Barcode not found" });
    res.json(label);
  } catch (error) {
    next(error);
  }
});

router.post("/print-jobs/:id/mark-printed", async (req, res, next) => {
  try {
    const job = await PrintJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: "Print job not found" });
    await job.update({ status: "Printed", printedAt: new Date() });
    res.json(job);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

