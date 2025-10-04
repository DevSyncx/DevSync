import React from 'react';
import { AccountDangerZone } from '@/Components/settings/AccountDangerZone';
import { Bell, Palette, Shield, User } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Profile Settings */}
        <div className="rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </h3>
            <p className="text-sm text-gray-500">
              Update your personal information and profile settings.
            </p>
          </div>
          <div className="p-6 pt-0">
            <p className="text-sm text-gray-500">
              Profile settings section - to be implemented
            </p>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </h3>
            <p className="text-sm text-gray-500">
              Configure your notification preferences.
            </p>
          </div>
          <div className="p-6 pt-0">
            <p className="text-sm text-gray-500">
              Notification settings section - to be implemented
            </p>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </h3>
            <p className="text-sm text-gray-500">
              Manage your privacy and security settings.
            </p>
          </div>
          <div className="p-6 pt-0">
            <p className="text-sm text-gray-500">
              Privacy and security settings section - to be implemented
            </p>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </h3>
            <p className="text-sm text-gray-500">
              Customize the look and feel of DevSync.
            </p>
          </div>
          <div className="p-6 pt-0">
            <p className="text-sm text-gray-500">
              Theme and appearance settings section - to be implemented
            </p>
          </div>
        </div>

        {/* Account Management */}
        <AccountDangerZone />
      </div>
    </div>
  );
};

export default Settings;
