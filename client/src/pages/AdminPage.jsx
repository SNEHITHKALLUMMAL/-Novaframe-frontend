import { useState } from 'react';
import { LayoutDashboard, Users, Clapperboard, Cpu, CreditCard, HardDrive, ScrollText } from 'lucide-react';
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
  { id: 'storage', label: 'Storage & Config', icon: HardDrive, Component: StorageConfigTab },
  { id: 'audit', label: 'Audit Log', icon: ScrollText, Component: AuditLogTab },
];

/**
 * GPU/worker-process monitoring and automated content moderation are
 * intentionally not tabs here — there's no live worker/GPU registry or
 * content-classification system to report on truthfully in this build
 * (see docs/ADMIN_DASHBOARD.md). Moderation is covered narrowly instead:
 * an admin can already delete any video via a dedicated endpoint
 * (adminDeleteVideo) — a full flagged-content queue needs real detection
 * infrastructure this build doesn't have.
 */
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.Component ?? OverviewTab;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Admin</h1>
        <p className="text-muted-foreground">Platform-wide monitoring and management.</p>
      </div>

      <div className="flex flex-wrap gap-1 rounded-md border border-border bg-secondary p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <ActiveComponent />
    </div>
  );
}
