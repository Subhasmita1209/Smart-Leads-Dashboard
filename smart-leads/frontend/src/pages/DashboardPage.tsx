import { useAuthStore } from '@/store/authStore';
import { useLeadStats, useLeads } from '@/hooks/useLeads';
import { StatusBadge, SourceBadge } from '@/components/ui/Badges';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Globe,
  Instagram,
  Users,
  TrendingUp,
  UserPlus,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const sourceIcons = {
  Website: Globe,
  Instagram,
  Referral: Users,
};


const sourceBarColors: Record<string, string> = {
  Website: '#1a56db',
  Instagram: '#ec4899',
  Referral: '#10b981',
};


const sourceIconStyles: Record<string, { bg: string; color: string }> = {
  Website: { bg: '#eff6ff', color: '#1d4ed8' },
  Instagram: { bg: '#fdf2f8', color: '#be185d' },
  Referral: { bg: '#f0fdf4', color: '#15803d' },
};


const statCardConfig = [
  {
    key: 'total',
    label: 'Total Leads',
    icon: TrendingUp,
    iconBg: '#6366f1',
  },
  {
    key: 'new',
    label: 'New',
    icon: UserPlus,
    iconBg: '#3b82f6',
  },
  {
    key: 'qualified',
    label: 'Qualified',
    icon: CheckCircle,
    iconBg: '#10b981',
  },
  {
    key: 'lost',
    label: 'Lost',
    icon: XCircle,
    iconBg: '#ef4444',
  },
];


const avatarPalette = [
  { bg: '#f0f0ff', color: '#5145cd' },
  { bg: '#f0f0ff', color: '#5145cd' },
  { bg: '#f0f0ff', color: '#5145cd' },
  { bg: '#fff3e0', color: '#e65100' },
  { bg: '#fce4ec', color: '#c62828' },
];


const statusColorMap: Record<string, { bg: string; color: string }> = {
  new: { bg: '#e8eeff', color: '#1e40af' },
  contacted: { bg: '#fef9e7', color: '#92400e' },
  qualified: { bg: '#e8f5e9', color: '#166534' },
  converted: { bg: '#ecfdf5', color: '#065f46' },
  lost: { bg: '#fef2f2', color: '#991b1b' },
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}


function getStatValue(stats: any, key: string): number {
  if (!stats) return 0;
  if (key === 'total') return stats.total ?? 0;

  const found = stats.byStatus?.find(
    (s: any) => s._id?.toLowerCase() === key
  );

  return found?.count ?? 0;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const location = useLocation();
  const isNewUser = location.state?.isNewUser;

  const { data: statsData } = useLeadStats();
  const { data: recentData } = useLeads({ sort: 'latest', page: 1 });

  const stats = statsData?.data;
  const recentLeads = recentData?.data?.slice(0, 5) ?? [];

  return (
    <>
      <style>{`
        :root {
          --card-bg: #ffffff;
        }

        .dark {
          --card-bg: #111827;
        }

        .dash-page {
          padding: 32px 36px;
          animation: dashFadeIn 0.3s ease;
        }

        @keyframes dashFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .dash-title {
          font-size: 26px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.3px;
          margin: 0 0 5px;
        }

        .dash-sub {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        .user-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 5px 14px 5px 6px;
          flex-shrink: 0;
          background: var(--card-bg);
        }

        .dark .user-pill {
          border-color: rgba(255,255,255,0.06);
        }

        .user-pill-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          flex-shrink: 0;
        }

        .user-pill-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }

        
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }

        @media (max-width: 900px) {
          .stat-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .stat-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px 22px 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          cursor: default;
          transition:
            transform 0.22s cubic-bezier(.22,1,.36,1),
            box-shadow 0.22s cubic-bezier(.22,1,.36,1),
            background 0.25s ease;
        }

        .dark .stat-card {
          background: #111827;
          border-color: rgba(255,255,255,0.06);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.10);
        }

        .dark .stat-card:hover {
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
        }

        .stat-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-value {
          font-size: 36px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
          margin: 0;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 4px 0 0;
          font-weight: 400;
        }

    
   .dash-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr; /* Recent Leads bigger */
  gap: 20px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .dash-grid {
    grid-template-columns: 1fr;
  }
}

        .dash-card {
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          background: var(--card-bg);
          display: flex;
          flex-direction: column;
          height: 100%;
          transition:
            background 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .dark .dash-card {
          background: #111827;
          border-color: rgba(255,255,255,0.06);
        }

        .dash-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
        }

        .dark .dash-card-head {
          border-bottom-color: rgba(255,255,255,0.06);
        }

        .dash-card-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .dash-view-all {
          font-size: 13px;
          font-weight: 500;
          color: #6366f1;
          display: flex;
          align-items: center;
          gap: 3px;
          text-decoration: none;
        }

        .dash-view-all:hover {
          opacity: 0.75;
        }

       
        .lead-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid var(--border);
          transition: background 0.12s;
        }

        .dark .lead-row {
          border-bottom-color: rgba(255,255,255,0.06);
        }

        .lead-row:last-child {
          border-bottom: none;
        }

        .lead-row:hover {
          background: var(--hover-bg, rgba(0,0,0,0.02));
        }

        .dark .lead-row:hover {
          background: rgba(255,255,255,0.03);
        }

        .lead-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .lead-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .lead-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          margin: 0 0 2px;
        }

        .lead-email {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 0;
        }

        .badge-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .empty-msg {
          padding: 40px 20px;
          text-align: center;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .source-row-wrap {
          padding: 15px 20px;
        }

        .source-row-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 9px;
        }

        .source-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--text-primary);
        }

        .source-icon-pill {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .source-count {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .source-divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 0;
        }

        .dark .source-divider {
          border-top-color: rgba(255,255,255,0.06);
        }

        .bar-track {
          height: 5px;
          border-radius: 999px;
          background: var(--border);
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.7s cubic-bezier(.22,1,.36,1);
        }

        .status-section-head {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          padding: 14px 20px 8px;
          border-top: 1px solid var(--border);
          margin-top: 2px;
          display: block;
        }

        .dark .status-section-head {
          border-top-color: rgba(255,255,255,0.06);
        }

        .status-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 0 20px 16px;
        }

        .status-mini {
          border-radius: 10px;
          padding: 12px 14px;
        }

        .status-mini-num {
          font-size: 22px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 4px;
        }

        .status-mini-lbl {
          font-size: 12px;
          opacity: 0.8;
        }
          
          
      `}</style>

      <div className="dash-page">

      
        <div className="dash-header">
          <div>
            <h1 className="dash-title">
              {isNewUser ? 'Welcome' : 'Welcome back'}, {user?.name}
            </h1>

            <p className="dash-sub">
              Monitor your leads, track conversions, and manage your sales pipeline efficiently.
            </p>
          </div>

          {user?.name && (
            <div className="user-pill">
              <div className="user-pill-avatar">
                {getInitials(user.name)}
              </div>

              <span className="user-pill-name">
                {user.name}
              </span>
            </div>
          )}
        </div>

   
        <div className="stat-grid">
          {statCardConfig.map(({ key, label, icon: Icon, iconBg }) => (
            <div className="stat-card" key={key}>
              <div
                className="stat-icon-wrap"
                style={{ background: iconBg }}
              >
                <Icon
                  size={22}
                  color="#ffffff"
                  strokeWidth={2}
                />
              </div>

              <div>
                <p className="stat-value">
                  {getStatValue(stats, key)}
                </p>

                <p className="stat-label">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-grid">

          <div className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">
                Recent Leads
              </h2>

              <Link to="/leads" className="dash-view-all">
                View all <ArrowRight size={13} />
              </Link>
            </div>

            <div>
              {recentLeads.length === 0 ? (
                <p className="empty-msg">
                  No leads available yet. Start by creating your first lead.
                </p>
              ) : (
                recentLeads.map((lead, idx) => {
                  const palette =
                    avatarPalette[idx % avatarPalette.length];

                  return (
                    <div
                      key={lead._id}
                      className="lead-row"
                    >
                      <div className="lead-left">
                        <div
                          className="lead-avatar"
                          style={{
                            background: palette.bg,
                            color: palette.color,
                          }}
                        >
                          {getInitials(lead.name)}
                        </div>

                        <div>
                          <p className="lead-name">
                            {lead.name}
                          </p>

                          <p className="lead-email">
                            {lead.email}
                          </p>
                        </div>
                      </div>

                      <div className="badge-row">
                        <SourceBadge source={lead.source} />
                        <StatusBadge status={lead.status} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

     
          <div className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">
                Leads by Source
              </h2>
            </div>

            {!stats?.bySource || stats.bySource.length === 0 ? (
              <p className="empty-msg">
                No source data available yet
              </p>
            ) : (
              stats.bySource.map((item, idx) => {
                const Icon =
                  sourceIcons[
                    item._id as keyof typeof sourceIcons
                  ] || Globe;

                const pct =
                  stats.total > 0
                    ? Math.round(
                        (item.count / stats.total) * 100
                      )
                    : 0;

                const iconStyle =
                  sourceIconStyles[
                    item._id as keyof typeof sourceIconStyles
                  ] || {
                    bg: '#f1f5f9',
                    color: '#475569',
                  };

                const barColor =
                  sourceBarColors[
                    item._id as keyof typeof sourceBarColors
                  ] || '#1a56db';

                return (
                  <div key={item._id}>
                    {idx > 0 && (
                      <hr className="source-divider" />
                    )}

                    <div className="source-row-wrap">
                      <div className="source-row-top">
                        <div className="source-left">
                          <div
                            className="source-icon-pill"
                            style={{
                              background: iconStyle.bg,
                              color: iconStyle.color,
                            }}
                          >
                            <Icon size={14} />
                          </div>

                          <span>{item._id}</span>
                        </div>

                        <span className="source-count">
                          {item.count} ({pct}%)
                        </span>
                      </div>

                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${pct}%`,
                            background: barColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {stats?.byStatus &&
              stats.byStatus.length > 0 && (
                <>
                  <span className="status-section-head">
                    Status breakdown
                  </span>

                  <div className="status-grid">
                    {stats.byStatus.map((s) => {
                      const key =
                        s._id?.toLowerCase() ?? '';

                      const c =
                        statusColorMap[key] || {
                          bg: '#f1f5f9',
                          color: '#475569',
                        };

                      return (
                        <div
                          key={s._id}
                          className="status-mini"
                          style={{
                            background: c.bg,
                          }}
                        >
                          <div
                            className="status-mini-num"
                            style={{
                              color: c.color,
                            }}
                          >
                            {s.count}
                          </div>

                          <div
                            className="status-mini-lbl"
                            style={{
                              color: c.color,
                            }}
                          >
                            {s._id.charAt(0).toUpperCase() +
                              s._id.slice(1)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </>
  );
}