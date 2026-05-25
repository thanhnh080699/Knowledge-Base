export type SettingValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | unknown[]
  | null;

export type SettingType =
  | "string"
  | "text"
  | "email"
  | "url"
  | "boolean"
  | "number"
  | "select"
  | "json";

export interface Setting {
  id: number;
  settingGroup: string;
  settingKey: string;
  settingValue: SettingValue;
  type: SettingType;
  label: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsGroup {
  group: string;
  settings: Setting[];
  values: Record<string, SettingValue>;
}

export interface UpdateSettingInput {
  key: string;
  value: SettingValue;
  type?: SettingType;
  label?: string;
  description?: string | null;
  sortOrder?: number;
}

export interface UpdateSettingsGroupPayload {
  settings: UpdateSettingInput[];
}

export interface SendTestEmailPayload {
  recipient: string;
}

export interface SendTestEmailResult {
  messageId: string;
  accepted: string[];
  rejected: string[];
}

export type LlmDriver =
  | "openai"
  | "gemini"
  | "nvidia"
  | "openrouter"
  | "custom";

export interface LlmModel {
  id: string;
  name: string;
}

export interface LlmModelsResponse {
  driver: LlmDriver;
  baseUrl: string;
  models: LlmModel[];
}

export interface TestLlmConnectionPayload {
  driver: LlmDriver;
  apiKey: string;
  baseUrl?: string;
  modelName?: string;
}

export interface TestLlmConnectionResult {
  connected: boolean;
  modelFound: boolean | null;
  modelsCount: number;
}

export interface LlmProvider {
  id: number;
  name: string;
  driver: LlmDriver;
  modelName: string;
  baseUrl: string | null;
  tasks: string[];
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface LlmProviderPayload {
  name: string;
  driver: LlmDriver;
  modelName: string;
  apiKey?: string | null;
  baseUrl?: string | null;
  tasks: string[];
  isActive?: boolean;
  sortOrder?: number;
}
