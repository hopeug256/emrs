const express = require("express");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/auth");
const { User, RefreshToken, SecurityEvent } = require("../models");
const {
  buildAccessToken,
  issueRefreshTokenForUser,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens
} = require("../services/tokenService");

const router = express.Router();

function getSourceIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
}

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }

    const user = await User.scope("withPassword").findOne({ where: { username } });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.role === "patient" && !user.patientId) {
      return res.status(403).json({ message: "Patient account is not linked to a patient profile" });
    }

    const accessToken = buildAccessToken(user);
    const { rawToken: refreshToken } = await issueRefreshTokenForUser(user.id);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        patientId: user.patientId || null,
        mustChangePassword: user.mustChangePassword
      },
      mustChangePassword: user.mustChangePassword
    });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "refreshToken is required" });
    }

    const existingToken = await findRefreshToken(refreshToken);
    if (!existingToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    if (existingToken.revokedAt) {
      if (existingToken.replacedByTokenId) {
        await SecurityEvent.create({
          userId: existingToken.userId,
          eventType: "REFRESH_TOKEN_REUSE_DETECTED",
          sourceIp: getSourceIp(req),
          details: "A previously rotated refresh token was presented."
        });
        await revokeAllUserRefreshTokens(existingToken.userId);
        return res.status(401).json({
          message: "Refresh token reuse detected. All sessions invalidated.",
          code: "REFRESH_TOKEN_REUSE_DETECTED"
        });
      }
      return res.status(401).json({ message: "Refresh token has been revoked" });
    }

    if (new Date(existingToken.expiresAt) <= new Date()) {
      return res.status(401).json({ message: "Refresh token expired" });
    }

    const user = await User.findByPk(existingToken.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid user session" });
    }

    const { rawToken: nextRawToken, refreshToken: nextTokenRecord } = await issueRefreshTokenForUser(
      user.id
    );
    await revokeRefreshToken(existingToken, nextTokenRecord.id);

    res.json({
      accessToken: buildAccessToken(user),
      refreshToken: nextRawToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        patientId: user.patientId || null,
        mustChangePassword: user.mustChangePassword
      },
      mustChangePassword: user.mustChangePassword
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      patientId: user.patientId || null,
      mustChangePassword: user.mustChangePassword
    });
  } catch (error) {
    next(error);
  }
});

router.post("/change-password", authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "currentPassword and newPassword are required" });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: "newPassword must be at least 8 characters" });
    }

    const user = await User.scope("withPassword").findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await user.update({
      passwordHash: newHash,
      mustChangePassword: false
    });

    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { userId: user.id, revokedAt: null } }
    );

    const accessToken = buildAccessToken(user);
    const { rawToken: refreshToken } = await issueRefreshTokenForUser(user.id);

    res.json({
      message: "Password updated",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        patientId: user.patientId || null,
        mustChangePassword: false
      },
      mustChangePassword: false
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(200).json({ message: "Logged out" });
    }

    const existingToken = await findRefreshToken(refreshToken);
    if (existingToken && !existingToken.revokedAt) {
      await revokeRefreshToken(existingToken);
    }

    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
