import { useState } from 'react';
import { User, CreditCard, Settings } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { ProfileTab } from '../components/settings/ProfileTab.jsx';
import { BillingTab } from '../components/settings/BillingTab.jsx';

const TABS = [
  { id: 'billing', label: 'Plans & Billing', icon: CreditCard },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('billing');

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-muted-foreground" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your plan, billing, and account.</p>
      </div>

      {/* Tab bar */}
      <div className="inline-flex rounded-xl border border-border bg-secondary/50 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150',
              tab === id
                ? 'bg-card text-foreground shadow-sm border border-border/50'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {tab === 'billing' && <BillingTab />}
        {tab === 'profile' && <ProfileTab />}
      </div>
    </div>
  );
}
