import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useHandoffs(assignedTo: string, status?: string) {
  return useQuery({
    queryKey: ['handoffs', assignedTo, status],
    queryFn: () => api.getHandoffs({ assigned_to: assignedTo, status }),
    refetchInterval: 3000, // Poll every 3 seconds
  });
}
