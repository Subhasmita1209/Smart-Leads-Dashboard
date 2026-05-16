import { Search, X, SlidersHorizontal } from 'lucide-react';
import { LeadFilters, LeadSource, LeadStatus, SortOrder } from '@/types';

interface Props {
  filters: LeadFilters;
  searchInput: string;
  onSearchChange: (val: string) => void;
  onFilterChange: (key: keyof LeadFilters, value: string) => void;
  onClear: () => void;
}

const hasActiveFilters = (filters: LeadFilters, search: string) =>
  Boolean(filters.status || filters.source || search || filters.sort !== 'latest');

export default function LeadFiltersBar({
  filters,
  searchInput,
  onSearchChange,
  onFilterChange,
  onClear,
}: Props) {
  const active = hasActiveFilters(filters, searchInput);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
        <input
          type="text"
          className="input-field pl-9 pr-4"
          placeholder="Search by name or email..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filters row */}
      <div className="flex gap-2 items-center">
        <SlidersHorizontal size={15} style={{ color: 'var(--text-secondary)' }} />

        <select
          className="input-field w-auto text-xs"
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          {(['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[]).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="input-field w-auto text-xs"
          value={filters.source || ''}
          onChange={(e) => onFilterChange('source', e.target.value)}
        >
          <option value="">All Sources</option>
          {(['Website', 'Instagram', 'Referral'] as LeadSource[]).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="input-field w-auto text-xs"
          value={filters.sort || 'latest'}
          onChange={(e) => onFilterChange('sort', e.target.value)}
        >
          {(['latest', 'oldest'] as SortOrder[]).map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        {active && (
          <button onClick={onClear} className="btn-secondary text-xs gap-1.5 px-3">
            <X size={13} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
