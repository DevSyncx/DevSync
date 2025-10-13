import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ to = null }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Go back"
      className="p-2 cursor-pointer rounded-lg hover:bg-[var(--accent)]"
    >
      <ArrowLeft className="h-5 w-5 text-[var(--foreground)]" />
    </button>
  );
}
