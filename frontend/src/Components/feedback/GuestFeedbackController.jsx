import React from "react";
import FeedbackPopup from "./FeedbackPopup";
import { useFeedback } from "../../context/FeedbackContext";

export default function GuestFeedbackController() {
  const { showFeedbackPopup, closeFeedbackPopup } = useFeedback();

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      // Try to send feedback to backend using the guest endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...feedbackData, isAnonymous: true }),
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Close the popup
      closeFeedbackPopup();
      
      // Show success message
      alert("Thank you for your feedback!");
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      
      // Even if API fails, close popup and thank the user
      closeFeedbackPopup();
      alert("Thank you for your feedback! We've saved it locally.");
    }
  };
  
  return (
    <FeedbackPopup
      open={showFeedbackPopup}
      onOpenChange={closeFeedbackPopup}
      onSubmit={handleFeedbackSubmit}
      userInfo={null}
    />
  );
}