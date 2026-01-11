import type {
  CreateHandoffRequest,
  CreateHandoffResponse,
  HandoffStatusResponse,
  HandoffsResponse,
  MetricsResponse,
  InitiativeScanResponse,
  InitiativeApproveRequest,
  InitiativeApproveResponse,
} from '@/types/handoff';

const API_URL = import.meta.env.VITE_API_URL || 'https://deputy-backend.vercel.app';

export const api = {
  async createHandoff(data: CreateHandoffRequest): Promise<CreateHandoffResponse> {
    const res = await fetch(`${API_URL}/handoff/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Failed to create handoff: ${res.statusText}`);
    }
    return res.json();
  },

  async getHandoffStatus(id: string): Promise<HandoffStatusResponse> {
    const res = await fetch(`${API_URL}/handoff/${id}/status`);
    if (!res.ok) {
      throw new Error(`Failed to get handoff status: ${res.statusText}`);
    }
    return res.json();
  },

  async getHandoffs(params: { assigned_to: string; status?: string }): Promise<HandoffsResponse> {
    const query = new URLSearchParams();
    query.set('assigned_to', params.assigned_to);
    if (params.status) {
      query.set('status', params.status);
    }
    const res = await fetch(`${API_URL}/handoffs?${query}`);
    if (!res.ok) {
      throw new Error(`Failed to get handoffs: ${res.statusText}`);
    }
    return res.json();
  },

  async getMetrics(): Promise<MetricsResponse> {
    const res = await fetch(`${API_URL}/metrics/summary`);
    if (!res.ok) {
      throw new Error(`Failed to get metrics: ${res.statusText}`);
    }
    return res.json();
  },

  async scanInitiative(initiative: string): Promise<InitiativeScanResponse> {
    const res = await fetch(`${API_URL}/initiative/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        initiative,
        created_by: 'sarah',
        assigned_to: 'kenji',
      }),
    });
    if (!res.ok) {
      throw new Error(`Failed to scan initiative: ${res.statusText}`);
    }
    return res.json();
  },

  async approveInitiative(data: InitiativeApproveRequest): Promise<InitiativeApproveResponse> {
    const res = await fetch(`${API_URL}/initiative/${data.initiative_id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approved_types: data.approved_types,
        additional_direction: data.additional_direction,
      }),
    });
    if (!res.ok) {
      throw new Error(`Failed to approve initiative: ${res.statusText}`);
    }
    return res.json();
  },
};
