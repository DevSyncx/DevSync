// src/Components/ui/Card.jsx
import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border bg-white shadow p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`font-bold text-lg mb-2 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return <div className={`mt-2 border-t pt-2 ${className}`}>{children}</div>;
}

