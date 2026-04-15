import jwt from "jsonwebtoken";

const SECRET = "supersecretkey";

export function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET, {
    expiresIn: "1d",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}