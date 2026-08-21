import { useState } from 'react';
import { User, CreditCard } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { ProfileTab } from '../components/settings/ProfileTab.jsx';
import { BillingTab } from '../components/settings/BillingTab.jsx';

const TABS = [
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('billing');

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your plan, billing, and account.</p>
      </div>

      <div className="inline-flex rounded-md border border-border bg-secondary p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
              tab === id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'billing' && <BillingTab />}
      {tab === 'profile' && <ProfileTab />}
    </div>
  );
}
