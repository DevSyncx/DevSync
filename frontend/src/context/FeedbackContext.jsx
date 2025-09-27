import React, { createContext, useContext, useState } from "react";

const FeedbackContext = createContext(null);

export function FeedbackProvider({ children }) {
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  
  const openFeedbackPopup = () => {
    setShowFeedbackPopup(true);
  };
  
  const closeFeedbackPopup = () => {
    setShowFeedbackPopup(false);
  };
  
  return (
    <FeedbackContext.Provider 
      value={{ 
        showFeedbackPopup, 
        openFeedbackPopup, 
        closeFeedbackPopup 
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
}