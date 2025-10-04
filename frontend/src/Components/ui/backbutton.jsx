import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      aria-label="Go back"
      className="p-2 cursor-pointer"
    >
      <ArrowLeft className="h-5 w-5 text-[var(--backround)] dark:text-[var(--foreground)]" />
    </button>
  );
}
