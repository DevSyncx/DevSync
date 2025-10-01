import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

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

  const handleConfirm = () => {
    if (isConfirmationValid) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setConfirmationText('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${
              variant === 'destructive' ? 'text-red-500' : 'text-orange-500'
            }`} />
            {title}
          </DialogTitle>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>

        {requiresTypeConfirmation && variant === 'destructive' && (
          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type <span className="font-mono font-bold">{expectedText}</span> to confirm:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={expectedText}
              className="font-mono"
            />
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={!isConfirmationValid || isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
