import api from './api';
import { ApiResponse, Lead, LeadFilters, LeadFormData, LeadStats } from '@/types';

export const leadService = {
  async getLeads(filters: LeadFilters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.page) params.set('page', String(filters.page));
    params.set('limit', '10');

    const res = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return res.data;
  },

  async getLead(id: string) {
    const res = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data;
  },

  async createLead(data: LeadFormData) {
    const res = await api.post<ApiResponse<Lead>>('/leads', data);
    return res.data;
  },

  async updateLead(id: string, data: Partial<LeadFormData>) {
    const res = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data;
  },

  async deleteLead(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/leads/${id}`);
    return res.data;
  },

  async getStats() {
    const res = await api.get<ApiResponse<LeadStats>>('/leads/stats');
    return res.data;
  },

  getExportUrl(filters: LeadFilters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    return `/api/leads/export/csv?${params.toString()}`;
  },
};
