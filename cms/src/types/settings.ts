export type SettingValue = string | number | boolean | Record<string, unknown> | unknown[] | null

export type SettingType = 'string' | 'text' | 'email' | 'url' | 'boolean' | 'number' | 'select' | 'json'

export interface Setting {
  id: number
  settingGroup: string
  settingKey: string
  settingValue: SettingValue
  type: SettingType
  label: string
  description: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface SettingsGroup {
  group: string
  settings: Setting[]
  values: Record<string, SettingValue>
}

export interface UpdateSettingInput {
  key: string
  value: SettingValue
  type?: SettingType
  label?: string
  description?: string | null
  sortOrder?: number
}

export interface UpdateSettingsGroupPayload {
  settings: UpdateSettingInput[]
}

export interface SendTestEmailPayload {
  recipient: string
}

export interface SendTestEmailResult {
  messageId: string
  accepted: string[]
  rejected: string[]
}
