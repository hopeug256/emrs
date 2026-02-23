const express = require("express");

const router = express.Router();

router.get("/sdk-config", async (req, res) => {
  res.json({
    clientId: req.mobileClient.clientId,
    platform: req.mobileClient.platform,
    minSdkVersion: req.mobileClient.minSdkVersion,
    features: {
      patientPortal: true,
      telemedicine: true,
      reminders: true,
      careSummaryExchange: true
    }
  });
});

module.exports = router;

