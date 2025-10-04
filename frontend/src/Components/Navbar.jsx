import React, { useState } from 'react';
import { Trash2, UserX, AlertTriangle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { ConfirmationModal } from './ConfirmationModal';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const AccountDangerZone = () => {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();

  const handleDeactivateAccount = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}/deactivate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Account deactivated successfully');
        logout();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to deactivate account');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
      setShowDeactivateModal(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('Account deleted permanently');
        logout();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete account');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription className="text-red-600">
          These actions are irreversible. Please proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deactivate Account */}
        <div className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
          <div>
            <h4 className="font-semibold text-orange-900">Deactivate Account</h4>
            <p className="text-sm text-orange-700">
              Temporarily disable your account. You can reactivate it later.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
            onClick={() => setShowDeactivateModal(true)}
            disabled={isLoading}
          >
            <UserX className="h-4 w-4 mr-2" />
            Deactivate
          </Button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div>
            <h4 className="font-semibold text-red-900">Delete Account</h4>
            <p className="text-sm text-red-700">
              Permanently remove your account and all associated data.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteModal(true)}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={handleDeactivateAccount}
        title="Deactivate Account"
        description="Your account will be disabled until reactivated. You won't be able to log in or access DevSync, but your data will be preserved."
        confirmText="Deactivate Account"
        isLoading={isLoading}
        variant="warning"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="Your account and all associated data will be permanently removed. This action cannot be undone."
        confirmText="Delete Account Forever"
        isLoading={isLoading}
        variant="destructive"
      />
    </Card>
  );
};