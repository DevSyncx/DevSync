import React, { useState, useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  isLoading,
  variant = 'destructive',
  requiresTypeConfirmation = true,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const expectedText = 'DELETE';

  const isConfirmationValid = !requiresTypeConfirmation || 
    confirmationText.toUpperCase() === expectedText;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleConfirm = () => {
    if (isConfirmationValid) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setConfirmationText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={handleClose}
      />
      <div className="relative z-50 w-full max-w-lg mx-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full">
          {/* Header */}
          <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
            <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${
                variant === 'destructive' ? 'text-red-500' : 'text-orange-500'
              }`} />
              {title}
            </h3>
            <p className="text-sm text-gray-500 text-left">
              {description}
            </p>
          </div>

          {requiresTypeConfirmation && variant === 'destructive' && (
            <div className="space-y-2 mb-6">
              <label htmlFor="confirmation" className="text-sm font-medium leading-none">
                Type <span className="font-mono font-bold">{expectedText}</span> to confirm:
              </label>
              <input
                id="confirmation"
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={expectedText}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 h-10 py-2 px-4 disabled:opacity-50 disabled:pointer-events-none"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isConfirmationValid || isLoading}
              className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 py-2 px-4 disabled:opacity-50 disabled:pointer-events-none ${
                variant === 'destructive' 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
