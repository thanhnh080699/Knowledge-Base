'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateSettingsGroup } from '@/hooks/mutations/use-setting-mutations'
import { useSettingsGroup } from '@/hooks/queries/use-settings'
import type { Setting, SettingValue, UpdateSettingInput } from '@/types/settings'
import { AlertCircle, RotateCcw, Save, X } from 'lucide-react'

const OVERVIEW_GROUP = 'overview'

const SELECT_OPTIONS: Record<string, string[]> = {
  timezone: ['Asia/Ho_Chi_Minh', 'UTC', 'Asia/Singapore', 'Asia/Tokyo'],
  date_format: ['dd/MM/yyyy', 'yyyy-MM-dd', 'MM/dd/yyyy', 'dd MMM yyyy'],
}

const FALLBACK_SETTINGS: Setting[] = [
  {
    id: 'site_name',
    settingGroup: OVERVIEW_GROUP,
    settingKey: 'site_name',
    settingValue: 'thanhnh.id.vn',
    type: 'string',
    label: 'Site name',
    description: 'Main website name displayed across public pages and metadata.',
    sortOrder: 10,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'site_description',
    settingGroup: OVERVIEW_GROUP,
    settingKey: 'site_description',
    settingValue: 'Knowledge base, portfolio and software services by Thanh Nguyen.',
    type: 'text',
    label: 'Site description',
    description: 'Short description used for SEO and interface summaries.',
    sortOrder: 20,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'site_url',
    settingGroup: OVERVIEW_GROUP,
    settingKey: 'site_url',
    settingValue: 'https://thanhnh.id.vn',
    type: 'url',
    label: 'Site URL',
    description: 'Canonical public URL for the website.',
    sortOrder: 30,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'admin_email',
    settingGroup: OVERVIEW_GROUP,
    settingKey: 'admin_email',
    settingValue: 'admin@thanhnh.id.vn',
    type: 'email',
    label: 'Admin email',
    description: 'Primary address for system notifications and contact routing.',
    sortOrder: 40,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'date_format',
    settingGroup: OVERVIEW_GROUP,
    settingKey: 'date_format',
    settingValue: 'dd/MM/yyyy',
    type: 'select',
    label: 'Date format',
    description: 'Default display format for dates in the CMS and frontend.',
    sortOrder: 60,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'maintenance_mode',
    settingGroup: OVERVIEW_GROUP,
    settingKey: 'maintenance_mode',
    settingValue: false,
    type: 'boolean',
    label: 'Maintenance mode',
    description: 'Temporarily mark the public website as under maintenance.',
    sortOrder: 70,
    createdAt: '',
    updatedAt: '',
  },
]

function valueToString(value: SettingValue) {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return ''
}

function findSetting(settings: Setting[], key: string) {
  return settings.find((setting) => setting.settingKey === key)
}

export default function OverviewSettingsPage() {
  const { data, isLoading } = useSettingsGroup(OVERVIEW_GROUP)
  const updateSettings = useUpdateSettingsGroup(OVERVIEW_GROUP)
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

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            Dashboard
          </Link>
          <span className="text-[var(--app-muted)]">/</span>
          <Link href="/dashboard/settings" className="text-blue-600 hover:text-blue-700">
            Settings
          </Link>
          <span className="text-[var(--app-muted)]">/</span>
          <span className="text-[var(--app-muted-strong)]">General</span>
        </div>

        <SettingBlock title="General Information" description="View and update site information">
          {isLoading ? (
            <div className="flex min-h-60 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
                <span className="text-sm text-[var(--app-muted)]">Loading settings...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <SettingField setting={findSetting(settings, 'admin_email')} value={values.admin_email} onChange={updateValue} />
              <SettingField setting={findSetting(settings, 'date_format')} value={values.date_format} onChange={updateValue} label="Date format" />
              <SettingField setting={findSetting(settings, 'maintenance_mode')} value={values.maintenance_mode} onChange={updateValue} />
              <label className="flex items-start gap-3 text-sm text-[var(--app-muted-strong)]">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-[var(--app-border)]" />
                Redirect all Not Found requests to homepage
              </label>
              <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                <div className="flex gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>To use scheduled cleanup features, configure a cron job for the CMS worker.</span>
                </div>
              </div>
            </div>
          )}
        </SettingBlock>

        <SettingBlock title="Website Identity" description="Public title, summary and canonical URL">
          <div className="space-y-5">
            <SettingField setting={findSetting(settings, 'site_name')} value={values.site_name} onChange={updateValue} />
            <SettingField setting={findSetting(settings, 'site_description')} value={values.site_description} onChange={updateValue} />
            <SettingField setting={findSetting(settings, 'site_url')} value={values.site_url} onChange={updateValue} />
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
  label,
  onChange,
}: {
  setting?: Setting
  value: SettingValue
  label?: string
  onChange: (key: string, value: SettingValue) => void
}) {
  if (!setting) {
    return null
  }

  const fieldLabel = label ?? setting.label

  return (
    <div>
      <Label htmlFor={setting.settingKey}>{fieldLabel}</Label>
      <div className="mt-2">
        {setting.type === 'text' ? (
          <textarea
            id={setting.settingKey}
            value={valueToString(value)}
            onChange={(event) => onChange(setting.settingKey, event.target.value)}
            className="min-h-24 w-full rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-offset-[var(--app-bg)] placeholder:text-[var(--app-input-placeholder)] focus-visible:ring-2 focus-visible:ring-[var(--app-ring)] focus-visible:ring-offset-2"
          />
        ) : setting.type === 'boolean' ? (
          <label className="inline-flex items-center gap-3 text-sm text-[var(--app-muted-strong)]">
            <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-[var(--app-surface-strong)]">
              <input
                type="checkbox"
                checked={value === true}
                onChange={(event) => onChange(setting.settingKey, event.target.checked)}
                className="peer sr-only"
              />
              <span className="ml-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4 peer-checked:bg-blue-600" />
            </span>
            Enabled
          </label>
        ) : setting.type === 'select' ? (
          <select
            id={setting.settingKey}
            value={valueToString(value)}
            onChange={(event) => onChange(setting.settingKey, event.target.value)}
            className="h-10 w-full rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--app-border-strong)]"
          >
            {(SELECT_OPTIONS[setting.settingKey] ?? [valueToString(setting.settingValue)]).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <Input
            id={setting.settingKey}
            type={setting.type === 'number' ? 'number' : setting.type === 'email' ? 'email' : setting.type === 'url' ? 'url' : 'text'}
            value={valueToString(value)}
            onChange={(event) => onChange(setting.settingKey, setting.type === 'number' ? Number(event.target.value) : event.target.value)}
          />
        )}
      </div>
      {setting.description && <p className="mt-2 text-xs leading-5 text-[var(--app-muted)]">{setting.description}</p>}
    </div>
  )
}
