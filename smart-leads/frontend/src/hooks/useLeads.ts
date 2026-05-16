import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';
import { LeadFilters, LeadFormData } from '@/types';
import toast from 'react-hot-toast';

export const LEADS_KEY = 'leads';

export function useLeads(filters: LeadFilters) {
  return useQuery({
    queryKey: [LEADS_KEY, filters],
    queryFn: () => leadService.getLeads(filters),
    staleTime: 30_000,
  });
}

export function useLeadStats() {
  return useQuery({
    queryKey: ['lead-stats'],
    queryFn: () => leadService.getStats(),
    staleTime: 60_000,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LeadFormData) => leadService.createLead(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead created successfully!');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to create lead');
    },
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeadFormData> }) =>
      leadService.updateLead(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead updated successfully!');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to update lead');
    },
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead deleted');
    },
    onError: () => {
      toast.error('Failed to delete lead');
    },
  });
}
