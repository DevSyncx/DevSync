import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  userId: { type: String, default: null }, // null if anonymous
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  category: { type: String, default: "General" },
  date: { type: Date, default: Date.now },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
