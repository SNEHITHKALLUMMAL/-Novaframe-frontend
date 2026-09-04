import { useState } from 'react';
import { LayoutDashboard, Users, Clapperboard, Cpu, CreditCard, HardDrive, ScrollText, Shield } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { OverviewTab } from '../components/admin/OverviewTab.jsx';
import { UsersTab } from '../components/admin/UsersTab.jsx';
import { JobsTab } from '../components/admin/JobsTab.jsx';
import { ModelsTab } from '../components/admin/ModelsTab.jsx';
import { SubscriptionsTab } from '../components/admin/SubscriptionsTab.jsx';
import { StorageConfigTab } from '../components/admin/StorageConfigTab.jsx';
import { AuditLogTab } from '../components/admin/AuditLogTab.jsx';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, Component: OverviewTab },
  { id: 'users', label: 'Users', icon: Users, Component: UsersTab },
  { id: 'jobs', label: 'Jobs', icon: Clapperboard, Component: JobsTab },
  { id: 'models', label: 'AI Models', icon: Cpu, Component: ModelsTab },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, Component: SubscriptionsTab },
  { id: 'storage', label: 'Storage', icon: HardDrive, Component: StorageConfigTab },
  { id: 'audit', label: 'Audit Log', icon: ScrollText, Component: AuditLogTab },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.Component ?? OverviewTab;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-highlight" />
          Admin Panel
        </h1>
        <p className="text-muted-foreground mt-1">Platform-wide monitoring and management.</p>
      </div>

      {/* Tab bar — scrollable on mobile */}
      <div className="flex gap-1 rounded-xl border border-border bg-secondary/50 p-1 overflow-x-auto w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-150',
              activeTab === id
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
        <ActiveComponent />
      </div>
    </div>
  );
}
