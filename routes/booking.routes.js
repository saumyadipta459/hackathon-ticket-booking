import express from "express";
import { bookSeat } from "../controllers/booking.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// CLEAN ROUTE
router.put("/:id", authMiddleware, bookSeat);

export default router;