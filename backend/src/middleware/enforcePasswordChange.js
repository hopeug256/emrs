function enforcePasswordChange(req, res, next) {
  if (req.user?.mustChangePassword) {
    return res.status(403).json({
      message: "Password reset required before accessing this resource",
      code: "PASSWORD_RESET_REQUIRED"
    });
  }
  next();
}

module.exports = enforcePasswordChange;
