import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer token

    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).send({ error: "Invalid token" });
  }
}