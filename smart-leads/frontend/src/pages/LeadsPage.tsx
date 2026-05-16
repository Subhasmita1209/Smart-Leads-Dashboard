import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Lead, LeadFilters } from '@/types';
import { useLeads } from '@/hooks/useLeads';
import { useDebounce } from '@/hooks/useDebounce';
import { leadService } from '@/services/leadService';
import { useAuthStore } from '@/store/authStore';
import LeadsTable from '@/components/leads/LeadsTable';
import LeadFiltersBar from '@/components/leads/LeadFiltersBar';
import LeadFormModal from '@/components/leads/LeadFormModal';
import DeleteModal from '@/components/leads/DeleteModal';
import toast from 'react-hot-toast';

export default function LeadsPage() {
  const { token } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1 });

  const debouncedSearch = useDebounce(searchInput, 400);

  const activeFilters: LeadFilters = {
    ...filters,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading } = useLeads(activeFilters);
  const leads = data?.data ?? [];
  const meta = data?.meta;

  const handleFilterChange = (key: keyof LeadFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  const handleClear = () => {
    setSearchInput('');
    setFilters({ sort: 'latest', page: 1 });
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLead(null);
  };

  const handleExportCSV = () => {
    const url = leadService.getExportUrl({
      status: filters.status,
      source: filters.source,
      search: debouncedSearch,
    });

    // Fetch with auth token
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        toast.success('CSV exported successfully!');
      })
      .catch(() => toast.error('Failed to export CSV'));
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Leads</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {meta ? `${meta.total} total leads` : 'Manage your leads'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="btn-secondary text-xs">
            <Download size={14} />
            Export CSV
          </button>
          <button onClick={() => setShowForm(true)} className="btn-primary text-xs">
            <Plus size={14} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <LeadFiltersBar
        filters={filters}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onFilterChange={handleFilterChange}
        onClear={handleClear}
      />

      {/* Table */}
      <LeadsTable
        leads={leads}
        meta={meta}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeletingLead}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />

      {/* Modals */}
      {showForm && (
        <LeadFormModal
          lead={editingLead}
          onClose={handleCloseForm}
        />
      )}
      {deletingLead && (
        <DeleteModal
          leadId={deletingLead._id}
          leadName={deletingLead.name}
          onClose={() => setDeletingLead(null)}
        />
      )}
    </div>
  );
}
