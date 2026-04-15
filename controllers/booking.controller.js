import pool from "../config/db.js";

export async function bookSeat(req, res) {
  const id = req.params.id;
  const userId = req.user.id;

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
      [id, `user-${userId}`]
    );

    await conn.query("COMMIT");

    res.send({ message: "Seat booked successfully" });
  } catch (err) {
    await conn.query("ROLLBACK");
    res.status(500).send({ error: "Booking failed" });
  } finally {
    conn.release();
  }
}