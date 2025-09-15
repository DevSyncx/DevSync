import express from "express";
import Feedback from "../models/feedback.js";

const router = express.Router();

// POST /api/feedback
router.post("/", async (req, res) => {
  try {
    const { userId, rating, comment, category } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: "Rating and comment required" });
    }

    const feedback = await Feedback.create({
      userId,
      rating,
      comment,
      category,
      date: new Date()
    });

    res.status(201).json({ message: "Feedback saved", feedback });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
