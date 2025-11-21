export const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "You must be logged in to access this resource"
    });
  }

  next();
};
