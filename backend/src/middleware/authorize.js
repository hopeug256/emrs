function authorize(methodRoles) {
  return (req, res, next) => {
    const role = req.user?.role;
    const allowed = methodRoles[req.method] || methodRoles["*"] || [];
    if (!allowed.includes(role)) {
      return res.status(403).json({ message: "Forbidden for your role" });
    }
    next();
  };
}

module.exports = authorize;
