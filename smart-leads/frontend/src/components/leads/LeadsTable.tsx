import { Pencil, Trash2, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Lead, PaginationMeta } from '@/types';
import { StatusBadge, SourceBadge } from '@/components/ui/Badges';

interface Props {
  leads: Lead[];
  meta?: PaginationMeta;
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onPageChange: (page: number) => void;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 rounded bg-slate-200 dark:bg-slate-700" style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function LeadsTable({ leads, meta, isLoading, onEdit, onDelete, onPageChange }: Props) {
  if (!isLoading && leads.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Users size={22} style={{ color: 'var(--text-secondary)' }} />
        </div>
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>No leads found</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Try adjusting your filters or add a new lead
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }}>
              {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {isLoading
              ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              : leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors animate-fade-in">
                    <td className="px-4 py-3.5">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {lead.name}
                      </span>
                    </td>
                    <td className="px-4 py-3.5" style={{ color: 'var(--text-secondary)' }}>
                      {lead.email}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <SourceBadge source={lead.source} />
                    </td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onEdit(lead)}
                          className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-brand-600 dark:text-brand-400 transition-colors"
                          title="Edit lead"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(lead)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                          title="Delete lead"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Showing {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} leads
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(meta.page - 1)}
              disabled={!meta.hasPrevPage}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(meta.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  meta.page === i + 1
                    ? 'bg-brand-600 text-white'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                style={meta.page === i + 1 ? {} : { color: 'var(--text-secondary)' }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange(meta.page + 1)}
              disabled={!meta.hasNextPage}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
