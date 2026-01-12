import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiGuest, ApiResponse } from '@/lib/api';

// Query keys
export const guestKeys = {
  all: ['guests'] as const,
  list: (weddingId: string, page?: number, segment?: string) =>
    ['guests', 'list', weddingId, { page, segment }] as const,
  detail: (id: string) => ['guests', id] as const,
};

interface GuestListParams {
  weddingId: string;
  page?: number;
  pageSize?: number;
  segment?: string;
}

interface GuestListResponse {
  guests: ApiGuest[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Hook for fetching guests with pagination
export function useGuests({ weddingId, page = 1, pageSize = 50, segment }: GuestListParams) {
  return useQuery({
    queryKey: guestKeys.list(weddingId, page, segment),
    queryFn: async (): Promise<GuestListResponse> => {
      const params: Record<string, string | number | undefined> = {
        wedding_id: weddingId,
        page,
        page_size: pageSize,
      };
      if (segment && segment !== 'All') {
        params.segment = segment;
      }

      const response = await apiClient.get<ApiGuest[]>('/api/guests', params);
      return {
        guests: response.data || [],
        pagination: response.pagination || { page: 1, pageSize, total: 0, totalPages: 0 },
      };
    },
    enabled: !!weddingId,
  });
}

// Hook for creating a guest
export function useCreateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ApiGuest, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
      const response = await apiClient.post<ApiGuest>('/api/guests', data);
      return response.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['guests', 'list', variables.wedding_id] });
    },
  });
}

// Hook for updating a guest
export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ApiGuest> }) => {
      const response = await apiClient.patch<ApiGuest>(`/api/guests/${id}`, data);
      return response.data!;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(guestKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: ['guests', 'list'] });
    },
  });
}

// Hook for deleting a guest (soft delete)
export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<{ deleted_at: string }>(`/api/guests/${id}`);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', 'list'] });
    },
  });
}

// Convert API guest to local format
export function apiToLocalGuest(api: ApiGuest) {
  return {
    id: api.id,
    name: api.name,
    phone: api.phone || '',
    segments: api.segments || [],
    status: api.status,
    email: api.email,
    notes: api.notes,
  };
}

// Convert local guest to API format
export function localToApiGuest(local: {
  name: string;
  phone?: string;
  segments?: string[];
  status?: string;
  email?: string;
  notes?: string;
}, weddingId: string): Omit<ApiGuest, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {
  return {
    wedding_id: weddingId,
    name: local.name,
    phone: local.phone || null,
    email: local.email || null,
    segments: local.segments || [],
    status: local.status || 'Active',
    notes: local.notes || null,
  };
}
