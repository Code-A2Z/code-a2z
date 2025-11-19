import { Request, Response, NextFunction } from "express";

export const isCollaborator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowed = ["COLLABORATOR", "MAINTAINER", "ADMIN"];
  if (!req.user || !allowed.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Collaborators, Maintainers and Admins can view notes"
    });
  }
  next();
};

export const isMaintainer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowed = ["MAINTAINER", "ADMIN"];
  if (!req.user || !allowed.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Only maintainers or admins can modify notes"
    });
  }
  next();
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin access only"
    });
  }
  next();
};
