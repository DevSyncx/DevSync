import { AccountDangerZone } from '@/Components/settings/AccountDangerZone';

export const Settings = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* ...existing settings sections... */}

        {/* Account Management */}
        <AccountDangerZone />
      </div>
    </div>
  );
};