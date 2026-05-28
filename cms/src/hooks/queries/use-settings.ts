"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiItemResponse, ApiListResponse } from "@/types/common";
import type {
  LlmDriver,
  LlmModelsResponse,
  LlmProvider,
  SettingsGroup,
} from "@/types/settings";

export function useSettingsGroup(group: string) {
  return useQuery({
    queryKey: ["settings", group],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<SettingsGroup>>(
        `/admin/settings/${group}`,
      );
      return data.data;
    },
    enabled: !!group,
  });
}

export function useLlmModels(params: {
  driver: LlmDriver;
  apiKey?: string;
  baseUrl?: string;
  enabled?: boolean;
}) {
  const { enabled = true, ...requestParams } = params;

  return useQuery({
    queryKey: [
      "settings",
      "llm-models",
      requestParams.driver,
      requestParams.apiKey,
      requestParams.baseUrl,
    ],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<LlmModelsResponse>>(
        "/admin/settings/llm/models",
        {
          params: requestParams,
        },
      );
      return data.data;
    },
    enabled: enabled && !!requestParams.driver,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLlmProviders() {
  return useQuery({
    queryKey: ["settings", "llm-providers"],
    queryFn: async () => {
      const { data } = await api.get<ApiListResponse<LlmProvider>>(
        "/admin/settings/llm/providers",
      );
      return data.data;
    },
  });
}
