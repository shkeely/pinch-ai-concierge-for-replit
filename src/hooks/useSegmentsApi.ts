import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSegment } from '@/lib/api';

// Query keys
export const segmentKeys = {
  all: ['segments'] as const,
  list: (weddingId: string) => ['segments', 'list', weddingId] as const,
  detail: (id: string) => ['segments', id] as const,
};

// Hook for fetching segments
export function useSegments(weddingId: string | null) {
  return useQuery({
    queryKey: segmentKeys.list(weddingId || ''),
    queryFn: async () => {
      if (!weddingId) return [];
      const response = await apiClient.get<ApiSegment[]>('/api/segments', { wedding_id: weddingId });
      return response.data || [];
    },
    enabled: !!weddingId,
  });
}

// Hook for creating a segment
export function useCreateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { wedding_id: string; name: string }) => {
      const response = await apiClient.post<ApiSegment>('/api/segments', data);
      return response.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: segmentKeys.list(variables.wedding_id) });
    },
  });
}

// Hook for updating a segment
export function useUpdateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ApiSegment> }) => {
      const response = await apiClient.patch<ApiSegment>(`/api/segments/${id}`, data);
      return response.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['segments', 'list'] });
    },
  });
}

// Hook for deleting a segment
export function useDeleteSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<{ deleted_at: string }>(`/api/segments/${id}`);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments', 'list'] });
    },
  });
}
