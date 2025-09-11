import React from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../ui/BackButton";

/**
 * Layout wrapper that adds a back button to all pages except home ("/").
 * Usage: <PageWithBackButton><YourPageComponent /></PageWithBackButton>
 */
export default function PageWithBackButton({ children }) {
  const location = useLocation();
  // Hide back button on home page
  const hideBack = location.pathname === "/";

  return (
    <>
      {!hideBack && <BackButton />}
      {children}
    </>
  );
}
