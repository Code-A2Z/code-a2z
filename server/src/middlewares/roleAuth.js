export const isCollaborator = (req, res, next) => {
  const allowed = ["user", "maintainer", "admin"];

  if (!req.user || !allowed.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Users, Maintainers, and Admins can view notes",
    });
  }

  next();
};

export const isMaintainer = (req, res, next) => {
  const allowed = ["maintainer", "admin"];

  if (!req.user || !allowed.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Only maintainers or admins can modify notes",
    });
  }

  next();
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }

  next();
};
