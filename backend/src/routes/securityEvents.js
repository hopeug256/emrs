const express = require("express");
const { SecurityEvent, User } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const events = await SecurityEvent.findAll({
      include: [{ model: User }],
      order: [["createdAt", "DESC"]]
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
