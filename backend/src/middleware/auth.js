const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret);

    const user = await User.findByPk(payload.sub);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid user session" });
    }

    req.user = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      patientId: user.patientId || null,
      mustChangePassword: user.mustChangePassword
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authenticate;
