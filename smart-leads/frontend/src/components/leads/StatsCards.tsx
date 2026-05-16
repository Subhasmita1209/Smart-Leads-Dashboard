import { TrendingUp, Users, CheckCircle, XCircle, PhoneCall } from 'lucide-react';
import { useLeadStats } from '@/hooks/useLeads';

const statusConfig = {
  New: { color: 'bg-blue-500', icon: Users },
  Contacted: { color: 'bg-yellow-500', icon: PhoneCall },
  Qualified: { color: 'bg-green-500', icon: CheckCircle },
  Lost: { color: 'bg-red-500', icon: XCircle },
};

export default function StatsCards() {
  const { data, isLoading } = useLeadStats();
  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 mb-3" />
            <div className="h-7 w-16 rounded bg-slate-200 dark:bg-slate-700 mb-2" />
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    );
  }

  const statusMap: Record<string, number> = {};
  stats?.byStatus.forEach((s) => { statusMap[s._id] = s.count; });

  const cards = [
    { label: 'Total Leads', value: stats?.total ?? 0, icon: TrendingUp, color: 'bg-brand-500' },
    { label: 'New', value: statusMap['New'] ?? 0, icon: statusConfig.New.icon, color: statusConfig.New.color },
    { label: 'Qualified', value: statusMap['Qualified'] ?? 0, icon: statusConfig.Qualified.icon, color: statusConfig.Qualified.color },
    { label: 'Lost', value: statusMap['Lost'] ?? 0, icon: statusConfig.Lost.icon, color: statusConfig.Lost.color },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="card p-5 animate-fade-in">
          <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
            <Icon size={17} className="text-white" />
          </div>
          <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</p>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
        </div>
      ))}
    </div>
  );
}
