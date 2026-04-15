import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { generateToken } from "../utils/jwt.js";

export async function register(req, res) {
  const { email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users(email, password) VALUES($1,$2) RETURNING id,email",
      [email, hashed]
    );

    res.send(result.rows[0]);
  } catch (err) {
    res.status(400).send({ error: "User already exists" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rowCount === 0) {
    return res.status(400).send({ error: "User not found" });
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).send({ error: "Wrong password" });
  }

  const token = generateToken(user);

  res.send({ token });
}