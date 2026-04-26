'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { MailCheck, RotateCcw, Save, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSendTestEmail, useUpdateSettingsGroup } from '@/hooks/mutations/use-setting-mutations'
import { useSettingsGroup } from '@/hooks/queries/use-settings'
import type { Setting, SettingValue, UpdateSettingInput } from '@/types/settings'

const EMAIL_GROUP = 'email'

const SELECT_OPTIONS: Record<string, string[]> = {
  mailer: ['smtp'],
  smtp_encryption: ['tls', 'ssl', 'none'],
}

const REQUIRED_FIELDS = new Set(['mailer', 'smtp_host', 'smtp_port', 'smtp_encryption', 'from_address', 'from_name'])

const FALLBACK_SETTINGS: Setting[] = [
  {
    id: 'mailer',
    settingGroup: EMAIL_GROUP,
    settingKey: 'mailer',
    settingValue: 'smtp',
    type: 'select',
    label: 'Mailer',
    description: 'Email delivery driver used by the API.',
    sortOrder: 10,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'smtp_host',
    settingGroup: EMAIL_GROUP,
    settingKey: 'smtp_host',
    settingValue: '',
    type: 'string',
    label: 'SMTP host',
    description: 'SMTP server hostname.',
    sortOrder: 20,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'smtp_port',
    settingGroup: EMAIL_GROUP,
    settingKey: 'smtp_port',
    settingValue: 587,
    type: 'number',
    label: 'SMTP port',
    description: 'SMTP server port. Common values are 587 for TLS and 465 for SSL.',
    sortOrder: 30,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'smtp_username',
    settingGroup: EMAIL_GROUP,
    settingKey: 'smtp_username',
    settingValue: '',
    type: 'string',
    label: 'SMTP username',
    description: 'SMTP account username.',
    sortOrder: 40,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'smtp_password',
    settingGroup: EMAIL_GROUP,
    settingKey: 'smtp_password',
    settingValue: '',
    type: 'string',
    label: 'SMTP password',
    description: 'SMTP account password or app password.',
    sortOrder: 50,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'smtp_encryption',
    settingGroup: EMAIL_GROUP,
    settingKey: 'smtp_encryption',
    settingValue: 'tls',
    type: 'select',
    label: 'Encryption',
    description: 'Connection security used by the SMTP server.',
    sortOrder: 60,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'from_address',
    settingGroup: EMAIL_GROUP,
    settingKey: 'from_address',
    settingValue: 'admin@thanhnh.id.vn',
    type: 'email',
    label: 'From address',
    description: 'Sender email address displayed to recipients.',
    sortOrder: 70,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'from_name',
    settingGroup: EMAIL_GROUP,
    settingKey: 'from_name',
    settingValue: 'ThanhNh CMS',
    type: 'string',
    label: 'From name',
    description: 'Sender name displayed to recipients.',
    sortOrder: 80,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'reply_to',
    settingGroup: EMAIL_GROUP,
    settingKey: 'reply_to',
    settingValue: '',
    type: 'email',
    label: 'Reply-to address',
    description: 'Optional reply-to email address.',
    sortOrder: 90,
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

function normalizeSettingValue(setting: Setting, value: SettingValue | undefined) {
  if (value === undefined || value === null) {
    if (setting.type === 'select') {
      return SELECT_OPTIONS[setting.settingKey]?.[0] ?? valueToString(setting.settingValue)
    }

    return ''
  }

  if (setting.type === 'number' && value === '') {
    return ''
  }

  return value
}

function isBlank(value: SettingValue | undefined) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
}

function findSetting(settings: Setting[], key: string) {
  return settings.find((setting) => setting.settingKey === key)
}

export default function EmailSettingsPage() {
  const { data, isLoading } = useSettingsGroup(EMAIL_GROUP)
  const updateSettings = useUpdateSettingsGroup(EMAIL_GROUP)
  const sendTestEmail = useSendTestEmail()
  const settings = useMemo(() => (data?.settings?.length ? data.settings : FALLBACK_SETTINGS), [data])
  const baseValues = useMemo(() => {
    return settings.reduce<Record<string, SettingValue>>((carry, setting) => {
      carry[setting.settingKey] = normalizeSettingValue(setting, setting.settingValue)
      return carry
    }, {})
  }, [settings])
  const [draftValues, setDraftValues] = useState<Record<string, SettingValue>>({})
  const [recipient, setRecipient] = useState('')
  const values = useMemo(() => ({ ...baseValues, ...draftValues }), [baseValues, draftValues])

  function updateValue(key: string, value: SettingValue) {
    setDraftValues((current) => ({ ...current, [key]: value }))
  }

  async function saveSettings() {
    const missingSetting = settings.find((setting) => REQUIRED_FIELDS.has(setting.settingKey) && isBlank(values[setting.settingKey]))

    if (missingSetting) {
      toast.error(`Vui lòng nhập ${missingSetting.label}`)
      return
    }

    const payload: UpdateSettingInput[] = settings.map((setting) => ({
      key: setting.settingKey,
      value: normalizeSettingValue(setting, values[setting.settingKey]),
      type: setting.type,
      label: setting.label,
      description: setting.description,
      sortOrder: setting.sortOrder,
    }))

    await updateSettings.mutateAsync({ settings: payload })
    setDraftValues({})
  }

  async function sendTest() {
    await sendTestEmail.mutateAsync({ recipient })
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
          <span className="text-[var(--app-muted-strong)]">Email</span>
        </div>

        <SettingBlock title="SMTP Server" description="Connection settings used by the API to send email">
          {isLoading ? (
            <div className="flex min-h-60 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
                <span className="text-sm text-[var(--app-muted)]">Loading settings...</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              <SettingField setting={findSetting(settings, 'mailer')} value={values.mailer} onChange={updateValue} />
              <SettingField setting={findSetting(settings, 'smtp_encryption')} value={values.smtp_encryption} onChange={updateValue} />
              <SettingField setting={findSetting(settings, 'smtp_host')} value={values.smtp_host} onChange={updateValue} />
              <SettingField setting={findSetting(settings, 'smtp_port')} value={values.smtp_port} onChange={updateValue} />
              <SettingField setting={findSetting(settings, 'smtp_username')} value={values.smtp_username} onChange={updateValue} />
              <SettingField setting={findSetting(settings, 'smtp_password')} value={values.smtp_password} onChange={updateValue} />
            </div>
          )}
        </SettingBlock>

        <SettingBlock title="Sender" description="Default identity shown in outgoing emails">
          <div className="grid gap-5 md:grid-cols-2">
            <SettingField setting={findSetting(settings, 'from_address')} value={values.from_address} onChange={updateValue} />
            <SettingField setting={findSetting(settings, 'from_name')} value={values.from_name} onChange={updateValue} />
            <SettingField setting={findSetting(settings, 'reply_to')} value={values.reply_to} onChange={updateValue} />
          </div>
        </SettingBlock>

        <SettingBlock title="Test Email" description="Send a test message with the saved SMTP settings">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Label htmlFor="test_recipient">Recipient email</Label>
              <Input id="test_recipient" type="email" value={recipient} onChange={(event) => setRecipient(event.target.value)} className="mt-2" />
            </div>
            <Button className="h-10 gap-2 px-4" isLoading={sendTestEmail.isPending} onClick={sendTest} disabled={!recipient.trim()}>
              <Send className="h-4 w-4" />
              Send test
            </Button>
          </div>
        </SettingBlock>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="h-10 gap-2 px-4" isLoading={updateSettings.isPending} onClick={saveSettings}>
              <Save className="h-4 w-4" />
              Save settings
            </Button>
            <Button variant="outline" size="sm" className="h-10 gap-2 px-4" onClick={() => setDraftValues({})}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <div className="flex items-center gap-2 text-sm text-[var(--app-muted)]">
              <MailCheck className="h-4 w-4" />
              Save before sending a test email.
            </div>
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
  if (!setting) {
    return null
  }

  const inputType = setting.settingKey === 'smtp_password' ? 'password' : setting.type === 'number' ? 'number' : setting.type === 'email' ? 'email' : 'text'

  return (
    <div>
      <Label htmlFor={setting.settingKey}>
        {setting.label} {REQUIRED_FIELDS.has(setting.settingKey) && <span className="text-red-500">*</span>}
      </Label>
      <div className="mt-2">
        {setting.type === 'select' ? (
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
            type={inputType}
            value={valueToString(value)}
            onChange={(event) =>
              onChange(setting.settingKey, setting.type === 'number' && event.target.value !== '' ? Number(event.target.value) : event.target.value)
            }
          />
        )}
      </div>
      {setting.description && <p className="mt-2 text-xs leading-5 text-[var(--app-muted)]">{setting.description}</p>}
    </div>
  )
}
