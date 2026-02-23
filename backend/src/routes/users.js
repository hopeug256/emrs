const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({ order: [["createdAt", "DESC"]] });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { username, fullName, role, password, patientId } = req.body;
    if (!username || !fullName || !role || !password) {
      return res.status(400).json({ message: "username, fullName, role, password are required" });
    }
    if (role === "patient" && !patientId) {
      return res.status(400).json({ message: "patientId is required for patient role" });
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      fullName,
      role,
      patientId: role === "patient" ? patientId : null,
      passwordHash,
      mustChangePassword: true,
      isActive: true
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const user = await User.scope("withPassword").findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {
      fullName: req.body.fullName ?? user.fullName,
      role: req.body.role ?? user.role,
      isActive: req.body.isActive ?? user.isActive
    };
    updates.patientId = updates.role === "patient" ? req.body.patientId ?? user.patientId : null;
    if (updates.role === "patient" && !updates.patientId) {
      return res.status(400).json({ message: "patientId is required for patient role" });
    }

    if (req.body.password) {
      updates.passwordHash = await bcrypt.hash(req.body.password, 10);
      updates.mustChangePassword = true;
    }

    await user.update(updates);
    const sanitized = await User.findByPk(user.id);
    res.json(sanitized);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
