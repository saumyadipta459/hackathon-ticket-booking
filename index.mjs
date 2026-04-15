import express from "express";
import cors from "cors";

import pool from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json()); // ✅ no body-parser


app.get("/seats", async (req, res) => {
  const result = await pool.query("SELECT * FROM seats");
  res.send(result.rows);
});


app.put("/:id/:name", async (req, res) => {
  const id = req.params.id;
  const name = req.params.name;

  const conn = await pool.connect();

  try {
    await conn.query("BEGIN");

    const result = await conn.query(
      "SELECT * FROM seats WHERE id=$1 AND isbooked=0 FOR UPDATE",
      [id]
    );

    if (result.rowCount === 0) {
      await conn.query("ROLLBACK");
      return res.send({ error: "Seat already booked" });
    }

    await conn.query(
      "UPDATE seats SET isbooked=1, name=$2 WHERE id=$1",
      [id, name]
    );

    await conn.query("COMMIT");

    res.send({ message: "Seat booked (legacy endpoint)" });
  } catch (err) {
    await conn.query("ROLLBACK");
    res.status(500).send({ error: "Booking failed" });
  } finally {
    conn.release();
  }
});


app.use("/auth", authRoutes);
app.use("/booking", bookingRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});