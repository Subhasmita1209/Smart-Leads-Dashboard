import { Loader2, Trash2, X } from 'lucide-react';
import { useDeleteLead } from '@/hooks/useLeads';

interface Props {
  leadId: string;
  leadName: string;
  onClose: () => void;
}

export default function DeleteModal({ leadId, leadName, onClose }: Props) {
  const { mutate: deleteLead, isPending } = useDeleteLead();

  const handleDelete = () => {
    deleteLead(leadId, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card w-full max-w-sm animate-slide-up p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Trash2 size={18} className="text-red-600 dark:text-red-400" />
          </div>
          <button onClick={onClose} className="p-1 rounded" style={{ color: 'var(--text-secondary)' }}>
            <X size={16} />
          </button>
        </div>
        <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Delete Lead
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to delete <strong>{leadName}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={handleDelete} disabled={isPending} className="btn-danger flex-1 justify-center">
            {isPending && <Loader2 size={15} className="animate-spin" />}
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
