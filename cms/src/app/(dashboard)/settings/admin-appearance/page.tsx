'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateSettingsGroup } from '@/hooks/mutations/use-setting-mutations'
import { useSettingsGroup } from '@/hooks/queries/use-settings'
import { useUploadMedia } from '@/hooks/mutations/use-media-mutations'
import type { Setting, SettingValue, UpdateSettingInput } from '@/types/settings'
import { RotateCcw, Save, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import { absoluteCdnUrl, normalizeCdnPath } from '@/lib/utils'

const APPEARANCE_GROUP = 'admin-appearance'

const SELECT_OPTIONS: Record<string, string[]> = {
  admin_layout: ['vertical', 'horizontal'],
  admin_sidebar_style: ['dark', 'light'],
  admin_theme: ['light', 'dark', 'system'],
}

const FALLBACK_SETTINGS: Setting[] = [
  {
    id: 0,
    settingGroup: APPEARANCE_GROUP,
    settingKey: 'admin_logo',
    settingValue: '/logo.png',
    type: 'url',
    label: 'Admin Logo',
    description: 'The logo displayed in the admin sidebar header.',
    sortOrder: 10,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 0,
    settingGroup: APPEARANCE_GROUP,
    settingKey: 'admin_favicon',
    settingValue: '/favicon.ico',
    type: 'url',
    label: 'Admin Favicon',
    description: 'The favicon displayed in the browser tab for admin pages.',
    sortOrder: 20,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 0,
    settingGroup: APPEARANCE_GROUP,
    settingKey: 'admin_title',
    settingValue: 'Antigravity CMS',
    type: 'string',
    label: 'Admin Title',
    description: 'The title displayed in the browser tab.',
    sortOrder: 30,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 0,
    settingGroup: APPEARANCE_GROUP,
    settingKey: 'admin_layout',
    settingValue: 'vertical',
    type: 'select',
    label: 'Admin Layout',
    description: 'Choose the overall layout structure for the admin panel.',
    sortOrder: 40,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 0,
    settingGroup: APPEARANCE_GROUP,
    settingKey: 'admin_sidebar_style',
    settingValue: 'dark',
    type: 'select',
    label: 'Sidebar Style',
    description: 'Choose the color style for the sidebar.',
    sortOrder: 50,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 0,
    settingGroup: APPEARANCE_GROUP,
    settingKey: 'admin_theme',
    settingValue: 'system',
    type: 'select',
    label: 'Color Theme',
    description: 'Default color theme for the administration area.',
    sortOrder: 60,
    createdAt: '',
    updatedAt: '',
  },
]

function valueToString(value: SettingValue) {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

function findSetting(settings: Setting[], key: string) {
  return settings.find((setting) => setting.settingKey === key)
}

export default function AdminAppearanceSettingsPage() {
  const { data, isLoading } = useSettingsGroup(APPEARANCE_GROUP)
  const updateSettings = useUpdateSettingsGroup(APPEARANCE_GROUP)
  const uploadMedia = useUploadMedia()
  
  const settings = useMemo(() => (data?.settings?.length ? data.settings : FALLBACK_SETTINGS), [data])
  
  const baseValues = useMemo(() => {
    return settings.reduce<Record<string, SettingValue>>((carry, setting) => {
      carry[setting.settingKey] = setting.settingValue
      return carry
    }, {})
  }, [settings])

  const [draftValues, setDraftValues] = useState<Record<string, SettingValue>>({})
  const values = useMemo(() => ({ ...baseValues, ...draftValues }), [baseValues, draftValues])

  function updateValue(key: string, value: SettingValue) {
    setDraftValues((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function resetValues() {
    setDraftValues({})
  }

  async function saveSettings() {
    const payload: UpdateSettingInput[] = settings.map((setting) => ({
      key: setting.settingKey,
      value: values[setting.settingKey] ?? null,
      type: setting.type,
      label: setting.label,
      description: setting.description,
      sortOrder: setting.sortOrder,
    }))

    await updateSettings.mutateAsync({ settings: payload })
    setDraftValues({})
  }

  const handleUpload = async (key: string, file: File) => {
    try {
      const result = await uploadMedia.mutateAsync({
        file,
        folder: 'settings',
      })
      updateValue(key, normalizeCdnPath(result.path || result.url))
    } catch {
      // Error is handled by the hook toast
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Dashboard
          </Link>
          <span className="text-[var(--app-muted)]">/</span>
          <Link href="/settings" className="text-blue-600 hover:text-blue-700">
            Settings
          </Link>
          <span className="text-[var(--app-muted)]">/</span>
          <span className="text-[var(--app-muted-strong)]">Admin appearance</span>
        </div>

        <SettingBlock 
          title="Branding" 
          description="Update your admin panel logo, favicon and titles to match your brand identity."
        >
          {isLoading ? (
             <div className="flex min-h-60 items-center justify-center">
                <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
             </div>
          ) : (
            <div className="space-y-6">
              <ImageField 
                setting={findSetting(settings, 'admin_logo')} 
                value={values.admin_logo} 
                onChange={updateValue} 
                onUpload={(file) => handleUpload('admin_logo', file)}
                isUploading={uploadMedia.isPending}
              />
              <ImageField 
                setting={findSetting(settings, 'admin_favicon')} 
                value={values.admin_favicon} 
                onChange={updateValue} 
                onUpload={(file) => handleUpload('admin_favicon', file)}
                isUploading={uploadMedia.isPending}
              />
              <SettingField 
                setting={findSetting(settings, 'admin_title')} 
                value={values.admin_title} 
                onChange={updateValue} 
              />
            </div>
          )}
        </SettingBlock>

        <SettingBlock 
          title="Layout & Style" 
          description="Customize the administration interface layout, sidebar style and color themes."
        >
          <div className="space-y-6">
            <SettingField 
              setting={findSetting(settings, 'admin_layout')} 
              value={values.admin_layout} 
              onChange={updateValue} 
            />
            <SettingField 
              setting={findSetting(settings, 'admin_sidebar_style')} 
              value={values.admin_sidebar_style} 
              onChange={updateValue} 
            />
            <SettingField 
              setting={findSetting(settings, 'admin_theme')} 
              value={values.admin_theme} 
              onChange={updateValue} 
            />
          </div>
        </SettingBlock>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="h-10 gap-2 px-4" isLoading={updateSettings.isPending} onClick={saveSettings}>
              <Save className="h-4 w-4" />
              Save settings
            </Button>
            <Button variant="outline" size="sm" className="h-10 gap-2 px-4" onClick={resetValues}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingBlock({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[280px_1fr] lg:gap-12">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h3>
        <p className="mt-2 text-sm text-[var(--app-muted)]">{description}</p>
      </div>
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">{children}</div>
    </section>
  )
}

function SettingField({
  setting,
  value,
  onChange,
}: {
  setting?: Setting
  value: SettingValue
  onChange: (key: string, value: SettingValue) => void
}) {
  if (!setting) return null

  return (
    <div>
      <Label htmlFor={setting.settingKey}>{setting.label}</Label>
      <div className="mt-2">
        {setting.type === 'select' ? (
          <select
            id={setting.settingKey}
            value={valueToString(value)}
            onChange={(event) => onChange(setting.settingKey, event.target.value)}
            className="h-10 w-full rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--app-border-strong)]"
          >
            {(SELECT_OPTIONS[setting.settingKey] ?? []).map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          <Input
            id={setting.settingKey}
            type="text"
            value={valueToString(value)}
            onChange={(event) => onChange(setting.settingKey, event.target.value)}
          />
        )}
      </div>
      {setting.description && <p className="mt-2 text-xs leading-5 text-[var(--app-muted)]">{setting.description}</p>}
    </div>
  )
}

function ImageField({
  setting,
  value,
  onChange,
  onUpload,
  isUploading,
}: {
  setting?: Setting
  value: SettingValue
  onChange: (key: string, value: SettingValue) => void
  onUpload: (file: File) => void
  isUploading: boolean
}) {
  if (!setting) return null

  const imageUrl = valueToString(value)

  return (
    <div>
      <Label htmlFor={setting.settingKey} className="text-sm font-semibold">{setting.label}</Label>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-muted)] overflow-hidden shadow-inner group">
          {imageUrl ? (
            <img 
              src={absoluteCdnUrl(imageUrl)} 
              alt={setting.label} 
              className="h-full w-full object-contain p-2 transition-transform group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/100x100?text=Error'
              }}
            />
          ) : (
            <ImageIcon className="h-8 w-8 text-slate-300" />
          )}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id={setting.settingKey}
                type="text"
                placeholder="https://example.com/logo.png"
                value={imageUrl}
                onChange={(event) => onChange(setting.settingKey, event.target.value)}
                className="pr-10"
              />
              <ImageIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <input
                type="file"
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onUpload(file)
                }}
                disabled={isUploading}
              />
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 border-dashed hover:border-blue-500 hover:text-blue-500 transition-colors" title="Upload from computer" disabled={isUploading}>
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-[var(--app-muted)]">{setting.description}</p>
        </div>
      </div>
    </div>
  )
}
