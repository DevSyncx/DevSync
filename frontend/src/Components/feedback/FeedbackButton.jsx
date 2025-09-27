import React from "react";
import { MessageSquarePlus } from "lucide-react";
import { useFeedback } from "../../context/FeedbackContext";

export default function FeedbackButton() {
  const { openFeedbackPopup } = useFeedback();
  
  return (
    <button
      onClick={openFeedbackPopup}
      className="flex items-center gap-2 text-[17px] font-medium transition duration-200"
      style={{ color: "var(--accent)" }}
    >
      <MessageSquarePlus className="h-4 w-4" /> Give Feedback
    </button>
  );
}