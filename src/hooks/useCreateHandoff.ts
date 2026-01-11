import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CreateHandoffRequest } from '@/types/handoff';

export function useCreateHandoff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHandoffRequest) => api.createHandoff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['handoffs'] });
    },
  });
}
