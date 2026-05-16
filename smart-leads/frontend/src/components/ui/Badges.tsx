import { LeadStatus, LeadSource } from '@/types';

export function StatusBadge({ status }: { status: LeadStatus }) {
  const classMap: Record<LeadStatus, string> = {
    New: 'badge-new',
    Contacted: 'badge-contacted',
    Qualified: 'badge-qualified',
    Lost: 'badge-lost',
  };
  return <span className={classMap[status]}>{status}</span>;
}

export function SourceBadge({ source }: { source: LeadSource }) {
  const styles: Record<LeadSource, string> = {
    Website: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Instagram: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    Referral: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[source]}`}>
      {source}
    </span>
  );
}
