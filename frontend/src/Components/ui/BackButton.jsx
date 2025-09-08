import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

/**
 * Reusable BackButton component for navigation.
 * Navigates to previous page or dashboard if no history.
 *
 * Usage: <BackButton />
 */
export default function BackButton({ to = '/dashboard', className = '' }) {
  const navigate = useNavigate();

  function handleBack() {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(to);
    }
  }

  return (
    <Button
      onClick={handleBack}
      variant="ghost"
      size="icon"
      aria-label="Go back"
      className={`fixed top-4 left-4 z-50 rounded-full shadow-md bg-white/80 hover:bg-white dark:bg-black/60 dark:hover:bg-black/80 border border-gray-200 dark:border-gray-700 backdrop-blur-md transition-all ${className}`}
    >
      <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
    </Button>
  );
}
