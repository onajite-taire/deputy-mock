import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: () => api.getMetrics(),
    refetchInterval: 5000, // Poll every 5 seconds
  });
}
