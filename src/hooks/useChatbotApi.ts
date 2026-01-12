import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiChatbotSettings, ApiBrainEntry } from '@/lib/api';

// Query keys
export const chatbotKeys = {
  settings: (weddingId: string) => ['chatbot-settings', weddingId] as const,
  brain: (weddingId: string) => ['concierge-brain', weddingId] as const,
};

// Hook for fetching chatbot settings
export function useChatbotSettings(weddingId: string | null) {
  return useQuery({
    queryKey: chatbotKeys.settings(weddingId || ''),
    queryFn: async () => {
      if (!weddingId) return null;
      const response = await apiClient.get<ApiChatbotSettings>(`/api/chatbot-settings/${weddingId}`);
      return response.data || null;
    },
    enabled: !!weddingId,
  });
}

// Hook for updating chatbot settings
export function useUpdateChatbotSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ weddingId, data }: { weddingId: string; data: Partial<ApiChatbotSettings> }) => {
      const response = await apiClient.patch<ApiChatbotSettings>(`/api/chatbot-settings/${weddingId}`, data);
      return response.data!;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(chatbotKeys.settings(variables.weddingId), data);
    },
  });
}

// Hook for fetching brain entries (FAQs, instructions, etc.)
export function useBrainEntries(weddingId: string | null, type?: string) {
  return useQuery({
    queryKey: [...chatbotKeys.brain(weddingId || ''), type],
    queryFn: async () => {
      if (!weddingId) return [];
      const params: Record<string, string | number | undefined> = { wedding_id: weddingId };
      if (type) params.type = type;
      const response = await apiClient.get<ApiBrainEntry[]>('/api/concierge-brain', params);
      return response.data || [];
    },
    enabled: !!weddingId,
  });
}

// Hook for creating a brain entry
export function useCreateBrainEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ApiBrainEntry, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
      const response = await apiClient.post<ApiBrainEntry>('/api/concierge-brain', data);
      return response.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: chatbotKeys.brain(variables.wedding_id) });
    },
  });
}

// Hook for updating a brain entry
export function useUpdateBrainEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ApiBrainEntry> }) => {
      const response = await apiClient.patch<ApiBrainEntry>(`/api/concierge-brain/${id}`, data);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concierge-brain'] });
    },
  });
}

// Hook for deleting a brain entry
export function useDeleteBrainEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<{ deleted_at: string }>(`/api/concierge-brain/${id}`);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concierge-brain'] });
    },
  });
}

// Convert API chatbot settings to local format
export function apiToLocalChatbotSettings(api: ApiChatbotSettings) {
  return {
    name: api.name,
    tone: api.tone,
    replyMode: api.reply_mode,
    active: api.active,
    unknownAnswer: api.unknown_answer,
    notifications: api.notifications,
  };
}
