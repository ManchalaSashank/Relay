import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ valid: false });

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
    if (err) return res.status(401).json({ valid: false });
    req.userId = userData.userId;
    next();
  });
};
