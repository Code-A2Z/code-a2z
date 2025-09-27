import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access Denied: No Token Provided" });
  }

  try {
    jwt.verify(
      token.split(" ")[1],
      process.env.SECRET_ACCESS_KEY,
      (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Access token is invalid" });
        }
        req.user = {
          id: user.id,
          department: user.department,
          role: user.role,
        };
        next();
      },
    );
  } catch {
    res.status(500).json({ error: "Token not found" });
  }
};
