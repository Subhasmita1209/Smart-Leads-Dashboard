import { useState, FormEvent, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Lead, LeadFormData, LeadSource, LeadStatus } from '@/types';
import { useCreateLead, useUpdateLead } from '@/hooks/useLeads';

interface Props {
  lead?: Lead | null;
  onClose: () => void;
}

const defaultForm: LeadFormData = {
  name: '',
  email: '',
  status: 'New',
  source: 'Website',
  notes: '',
};

export default function LeadFormModal({ lead, onClose }: Props) {
  const [form, setForm] = useState<LeadFormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: createLead, isPending: isCreating } = useCreateLead();
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();
  const isLoading = isCreating || isUpdating;
  const isEditing = Boolean(lead);

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        notes: lead.notes || '',
      });
    }
  }, [lead]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.length < 2) e.name = 'Name is required (min 2 chars)';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.source) e.source = 'Source is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    if (isEditing && lead) {
      updateLead({ id: lead._id, data: form }, { onSuccess: onClose });
    } else {
      createLead(form, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative card w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isEditing ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Full Name *</label>
              <input
                type="text"
                className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                placeholder="Jane Smith"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="col-span-2">
              <label className="label">Email Address *</label>
              <input
                type="email"
                className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                placeholder="jane@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label">Status</label>
              <select
                className="input-field"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}
              >
                {(['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Source *</label>
              <select
                className={`input-field ${errors.source ? 'border-red-400' : ''}`}
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}
              >
                {(['Website', 'Instagram', 'Referral'] as LeadSource[]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.source && <p className="text-xs text-red-500 mt-1">{errors.source}</p>}
            </div>

            <div className="col-span-2">
              <label className="label">Notes</label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="Add any relevant notes..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1 justify-center">
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {isLoading ? 'Saving...' : isEditing ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
