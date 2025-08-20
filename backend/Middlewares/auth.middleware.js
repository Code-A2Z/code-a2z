import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    const cookieToken = req.cookies?.access_token;
    const authHeader = req.header("Authorization");
    const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const token = cookieToken || bearerToken;

    if (!token) {
        return res.status(401).json({ error: "Access Denied: No Token Provided" });
    }

    try {
        jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ error: "Access token is invalid" });
            }
            req.user = user.id;
            next();
        });
    } catch (error) {
        res.status(500).json({ error: "Token not found" });
    }
};
