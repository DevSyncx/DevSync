import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // npm i framer-motion

const STORAGE_KEY = "devsync-feedback-lastshown";

export default function FeedbackModal({ userId = null, justLoggedIn = false, daysInterval = 5 }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("");
  const [allowAnonymous, setAllowAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const last = raw ? new Date(raw) : null;
      const now = new Date();
      const msInterval = daysInterval * 24 * 60 * 60 * 1000;

      if (justLoggedIn) {
        if (!last || now.getTime() - last.getTime() > 60 * 1000) {
          setTimeout(() => setOpen(true), 800);
        }
        return;
      }

      if (!last || now.getTime() - last.getTime() >= msInterval) {
        const t = setTimeout(() => setOpen(true), 2500);
        return () => clearTimeout(t);
      }
    } catch (e) {
      console.warn("FeedbackModal: localStorage issue", e);
    }
  }, [justLoggedIn, daysInterval]);

  const handleClose = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {}
  };

  const validate = () => {
    if (rating < 1 || rating > 5) {
      setError("Please give a rating between 1 and 5 stars.");
      return false;
    }
    if (!comment || comment.trim().length < 5) {
      setError("Comment should be at least 5 characters.");
      return false;
    }
    setError(null);
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      userId: allowAnonymous ? null : userId,
      rating,
      comment: comment.trim(),
      category: category || null,
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSuccess("Thanks! Your feedback was recorded.");
      setTimeout(() => handleClose(), 900);
    } catch (err) {
      setError(err.message || "Error submitting feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const Star = ({ filled, onClick, index }) => (
    <button
      aria-label={`${index + 1} star`}
      onClick={onClick}
      className="p-1 rounded hover:scale-110 transition-transform"
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        className={`w-6 h-6 ${filled ? "text-yellow-400" : "text-slate-300"}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.964a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.374 2.455a1 1 0 00-.364 1.118l1.287 3.963c.3.922-.755 1.688-1.538 1.118L12 17.347l-3.374 2.455c-.783.57-1.838-.196-1.538-1.118l1.287-3.963a1 1 0 00-.364-1.118L4.637 9.39c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.964z"
        />
      </svg>
    </button>
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-xl z-10"
      >
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Share your feedback</h3>
          <button onClick={handleClose} className="p-2 hover:bg-slate-200 rounded-full">
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-1 mt-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} index={i} filled={i < rating} onClick={() => setRating(i + 1)} />
              ))}
              <span className="ml-2 text-sm text-slate-500">{rating ? `${rating}/5` : "No rating"}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Feedback</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="What did you like? What can we improve?"
              className="w-full border rounded-lg p-2 text-sm bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category (optional)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full border rounded-md p-2 text-sm"
            >
              <option value="">Select category</option>
              <option value="UI">UI</option>
              <option value="Features">Features</option>
              <option value="Performance">Performance</option>
              <option value="Bug">Bug</option>
              <option value="Suggestion">Suggestion</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allowAnonymous}
              onChange={(e) => setAllowAnonymous(e.target.checked)}
            />
            <label className="text-sm">Submit as anonymous</label>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}

          <div className="flex justify-end gap-3">
            <button onClick={handleClose} className="px-3 py-2 bg-slate-100 rounded-md">
              Close
            </button>
            <button
              onClick={submit}
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
