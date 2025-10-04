import { useState } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useAccountManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();

  const deactivateAccount = async () => {
    if (!user?.id) {
      toast.error('User not found');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}/deactivate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account deactivated successfully');
        logout();
        return { success: true, data };
      } else {
        toast.error(data.message || 'Failed to deactivate account');
        return { success: false, error: data.message };
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!user?.id) {
      toast.error('User not found');
      return;
    }

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
        return { success: true };
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete account');
        return { success: false, error: data.message };
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deactivateAccount,
    deleteAccount,
    isLoading,
  };
};
