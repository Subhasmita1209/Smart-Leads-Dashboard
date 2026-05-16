import { useAuthStore } from '@/store/authStore';
import StatsCards from '@/components/leads/StatsCards';
import { useLeadStats, useLeads } from '@/hooks/useLeads';
import { StatusBadge, SourceBadge } from '@/components/ui/Badges';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Globe, Instagram, Users } from 'lucide-react';

const sourceIcons = {
  Website: Globe,
  Instagram,
  Referral: Users,
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const location = useLocation();
  const isNewUser = location.state?.isNewUser;

  const { data: statsData } = useLeadStats();
  const { data: recentData } = useLeads({ sort: 'latest', page: 1 });

  const stats = statsData?.data;
  const recentLeads = recentData?.data?.slice(0, 5) ?? [];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {isNewUser ? 'Welcome' : 'Welcome back'}, {user?.name}
        </h1>

        <p
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          Monitor your leads, track conversions, and manage your sales pipeline efficiently.
        </p>
      </div>

      {/* Stats */}
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Leads */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <h2
              className="font-semibold text-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              Recent Leads
            </h2>

            <Link
              to="/leads"
              className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div
            className="divide-y"
            style={{ borderColor: 'var(--border)' }}
          >
            {recentLeads.length === 0 ? (
              <p
                className="px-5 py-8 text-sm text-center"
                style={{ color: 'var(--text-secondary)' }}
              >
                No leads available yet. Start by creating your first lead.
              </p>
            ) : (
              recentLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {lead.name}
                    </p>

                    <p
                      className="text-xs mt-0.5"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {lead.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <SourceBadge source={lead.source} />
                    <StatusBadge status={lead.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Leads by Source */}
        <div className="card overflow-hidden">
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <h2
              className="font-semibold text-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              Leads by Source
            </h2>
          </div>

          <div className="p-5 space-y-4">
            {!stats?.bySource || stats.bySource.length === 0 ? (
              <p
                className="text-sm text-center"
                style={{ color: 'var(--text-secondary)' }}
              >
                No source data available yet
              </p>
            ) : (
              stats.bySource.map((item) => {
                const Icon =
                  sourceIcons[item._id as keyof typeof sourceIcons] || Globe;

                const pct =
                  stats.total > 0
                    ? Math.round((item.count / stats.total) * 100)
                    : 0;

                return (
                  <div key={item._id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Icon
                          size={14}
                          style={{ color: 'var(--text-secondary)' }}
                        />

                        <span
                          className="text-sm"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {item._id}
                        </span>
                      </div>

                      <span
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {item.count} ({pct}%)
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}