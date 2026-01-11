// Handoff Types
export type HandoffType = 'deploy' | 'review' | 'answer';
export type HandoffStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';

// Step within a handoff
export interface HandoffStep {
  name: string;
  status: StepStatus;
  started_at?: string;
  completed_at?: string;
  output?: Record<string, unknown>;
  error?: string;
}

// Result of a completed handoff
export interface HandoffResult {
  summary: string;
  details: Record<string, unknown>;
  learning_applied: string[];
  confidence: number;
}

// Handoff item from list endpoint
export interface Handoff {
  handoff_id: string;
  type: HandoffType;
  instruction: string;
  status: HandoffStatus;
  progress: number;
  current_step: string;
  created_by: string;
  created_at: string;
  completed_at?: string;
  result?: HandoffResult;
}

// POST /handoff/create
export interface CreateHandoffRequest {
  type: HandoffType;
  instruction: string;
  created_by: string;
  assigned_to: string;
}

export interface CreateHandoffResponse {
  handoff_id: string;
  status: 'pending';
  agent_assigned: string;
}

// GET /handoff/{id}/status
export interface HandoffStatusResponse {
  handoff_id: string;
  status: HandoffStatus;
  progress: number;
  current_step: string;
  current_step_index?: number;
  started_at?: string;
  completed_at?: string;
  result?: HandoffResult;
  steps?: HandoffStep[];
  latency_eliminated_hours?: number;
}

// GET /handoffs
export interface HandoffsQuery {
  assigned_to: string;
  status?: HandoffStatus;
}

export interface HandoffsResponse {
  handoffs: Handoff[];
  total_count: number;
  completed_count: number;
  total_latency_eliminated_hours: number;
}

// GET /metrics/summary
export interface MetricsResponse {
  total_handoffs: number;
  completion_rate: number;
  total_latency_eliminated_hours: number;
}

// Initiative Types

// Proposed handoff from initiative scan
export interface ProposedHandoff {
  type: HandoffType;
  instruction: string;
  confidence: number;
  patterns_found: number;
  based_on: string[];
}

// POST /initiative/scan response
export interface InitiativeScanResponse {
  initiative_id: string;
  status: string;
  proposed_handoffs: ProposedHandoff[];
  total_patterns_scanned: number;
}

// POST /initiative/{id}/approve request
export interface InitiativeApproveRequest {
  initiative_id: string;
  approved_types: HandoffType[];
  additional_direction?: string;
}

// Created handoff info in approve response
export interface CreatedHandoffInfo {
  handoff_id: string;
  type: HandoffType;
  instruction: string;
  status: string;
}

// POST /initiative/{id}/approve response
export interface InitiativeApproveResponse {
  initiative_id: string;
  status: 'approved';
  handoffs_created: CreatedHandoffInfo[];
  approved_at: string;
}
