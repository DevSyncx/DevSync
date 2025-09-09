// src/components/DashBoard/CardWrapper.jsx
export default function CardWrapper({ children, className = "" }) {
  return (
  <div className={`bg-[var(--card)] rounded-xl p-6 shadow-md ${className}`}>
      {children}
    </div>
  );
}
