const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { RefreshToken } = require("../models");

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateRefreshTokenString() {
  return crypto.randomBytes(64).toString("hex");
}

function buildAccessToken(user) {
  const secret = process.env.JWT_SECRET || "dev-secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "15m";
  return jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn });
}

function getRefreshExpiryDate() {
  const days = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 14);
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function issueRefreshTokenForUser(userId) {
  const rawToken = generateRefreshTokenString();
  const refreshToken = await RefreshToken.create({
    userId,
    tokenHash: hashToken(rawToken),
    expiresAt: getRefreshExpiryDate()
  });
  return { rawToken, refreshToken };
}

async function findRefreshToken(rawToken) {
  return RefreshToken.findOne({ where: { tokenHash: hashToken(rawToken) } });
}

async function revokeRefreshToken(tokenRecord, replacedByTokenId = null) {
  tokenRecord.revokedAt = new Date();
  tokenRecord.replacedByTokenId = replacedByTokenId;
  await tokenRecord.save();
}

async function revokeAllUserRefreshTokens(userId) {
  await RefreshToken.update(
    { revokedAt: new Date() },
    { where: { userId, revokedAt: null } }
  );
}

module.exports = {
  buildAccessToken,
  issueRefreshTokenForUser,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens
};
