import React, { useEffect } from "react";
import FeedbackPopup from "./FeedbackPopup";
import { useFeedback } from "../../context/FeedbackContext";

const FEEDBACK_INTERVAL_DAYS = 5; // Number of days between feedback prompts
const FEEDBACK_STORAGE_KEY = "devSync_feedback_state";

export default function FeedbackController({ user }) {
  const { showFeedbackPopup, openFeedbackPopup, closeFeedbackPopup } = useFeedback();
  
  // Check if we should show feedback popup based on last shown date
  useEffect(() => {
    // Only run this if user is logged in
    if (!user) return;
    
    // Get a reliable user ID (could be different formats depending on auth method)
    const userId = user.id || user.githubId || user._id || (typeof user === 'string' ? user : null);
    
    // Log the user format for debugging
    console.log("FeedbackController received user:", { 
      hasId: !!user.id,
      hasGithubId: !!user.githubId,
      has_id: !!user._id,
      userId
    });
    
    if (!userId) {
      console.error("FeedbackController: Unable to determine user ID", user);
      return;
    }

    // Check local storage for feedback state
    const storedState = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    const feedbackState = storedState ? JSON.parse(storedState) : null;
    
    const shouldShowFeedback = () => {
      // If no previous feedback state, show the popup
      if (!feedbackState) return true;
      
      // If user ID has changed, show the popup
      if (feedbackState.userId !== userId) return true;
      
      // Check if enough time has passed since last feedback
      const lastShownDate = new Date(feedbackState.lastShown);
      const currentDate = new Date();
      
      // Calculate days since last shown
      const daysSinceLastShown = Math.floor(
        (currentDate - lastShownDate) / (1000 * 60 * 60 * 24)
      );
      
      return daysSinceLastShown >= FEEDBACK_INTERVAL_DAYS;
    };
    
    // Show feedback popup if needed with a slight delay after login
    if (shouldShowFeedback()) {
      // Show feedback form after a short delay
      const timer = setTimeout(() => {
        openFeedbackPopup();
      }, 5000); // 5 seconds delay
      
      return () => clearTimeout(timer);
    }
  }, [user, openFeedbackPopup]);
  
  // Handle feedback submission
  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      // Get authentication tokens from different sources
      const jwtToken = localStorage.getItem("token");
      const githubToken = localStorage.getItem("github_token") || sessionStorage.getItem("github_token");
      
      // Prepare headers with available authentication
      const headers = {
        "Content-Type": "application/json"
      };
      
      if (jwtToken) {
        headers["x-auth-token"] = jwtToken;
      }
      
      if (githubToken) {
        headers["Authorization"] = `Bearer ${githubToken}`;
      }
      
      // Send feedback to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback`, {
        method: "POST",
        headers,
        body: JSON.stringify(feedbackData),
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Close the popup
      closeFeedbackPopup();
      
      // Get the user ID (support multiple authentication methods)
      const userId = user.id || user.githubId || user._id || (typeof user === 'string' ? user : null);
      
      // Update local storage with the new date
      localStorage.setItem(
        FEEDBACK_STORAGE_KEY,
        JSON.stringify({
          userId: userId,
          lastShown: new Date().toISOString(),
        })
      );
      
      // Show success message
      alert("Thank you for your feedback!");
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again later.");
    }
  };
  
  return (
    <FeedbackPopup
      open={showFeedbackPopup}
      onOpenChange={closeFeedbackPopup}
      onSubmit={handleFeedbackSubmit}
      userInfo={user}
    />
  );
}