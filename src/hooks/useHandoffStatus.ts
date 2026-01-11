import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { HandoffStatus } from '@/types/handoff';

export function useHandoffStatus(id: string, currentStatus?: HandoffStatus) {
  const isTerminal = currentStatus === 'completed' || currentStatus === 'failed';

  return useQuery({
    queryKey: ['handoff-status', id],
    queryFn: () => api.getHandoffStatus(id),
    refetchInterval: isTerminal ? false : 1500, // Poll every 1.5s until terminal
    enabled: !!id,
  });
}
