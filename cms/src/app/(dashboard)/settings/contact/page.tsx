'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateSettingsGroup } from '@/hooks/mutations/use-setting-mutations'
import { useSettingsGroup } from '@/hooks/queries/use-settings'
import type { Setting, SettingValue, UpdateSettingInput } from '@/types/settings'
import { Phone, RotateCcw, Save, Loader2, Mail, MapPin, Clock, Share2, Video, Camera, Globe, Code, GitBranch, Link, type LucideIcon } from 'lucide-react'

const CONTACT_GROUP = 'contact'

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  social_facebook: Globe,
  social_twitter: Share2,
  social_linkedin: Link,
  social_github: Code,
  social_gitlab: GitBranch,
  social_youtube: Video,
  social_instagram: Camera,
}

function valueToString(value: SettingValue) {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

export default function ContactSettingsPage() {
  const { data, isLoading } = useSettingsGroup(CONTACT_GROUP)
  const updateSettings = useUpdateSettingsGroup(CONTACT_GROUP)
  
  const settings = useMemo(() => data?.settings || [], [data])
  
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

  const generalSettings = settings.filter(s => !s.settingKey.startsWith('social_'))
  const socialSettings = settings.filter(s => s.settingKey.startsWith('social_'))

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
          <span className="text-[var(--app-muted-strong)]">Contact</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Contact Settings</h2>
            <p className="text-[var(--app-muted)]">Manage your contact information and social media links.</p>
          </div>
        </div>

        <SettingBlock 
          title="General Information" 
          description="Basic contact details for your website."
        >
          {isLoading ? (
             <div className="flex min-h-60 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
             </div>
          ) : (
            <div className="space-y-6">
              {generalSettings.map(setting => (
                <SettingField 
                  key={setting.id}
                  setting={setting} 
                  value={values[setting.settingKey]} 
                  onChange={updateValue} 
                />
              ))}
            </div>
          )}
        </SettingBlock>

        <SettingBlock 
          title="Social Links" 
          description="Connect your social media profiles."
        >
          {isLoading ? (
             <div className="flex min-h-60 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
             </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {socialSettings.map(setting => (
                <SettingField 
                  key={setting.id}
                  setting={setting} 
                  value={values[setting.settingKey]} 
                  onChange={updateValue} 
                />
              ))}
            </div>
          )}
        </SettingBlock>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div />
          <div className="flex flex-wrap gap-2 pb-10">
            <Button size="sm" className="h-10 gap-2 px-6" isLoading={updateSettings.isPending} onClick={saveSettings}>
              <Save className="h-4 w-4" />
              Save settings
            </Button>
            <Button variant="outline" size="sm" className="h-10 gap-2 px-6" onClick={resetValues}>
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
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm">{children}</div>
    </section>
  )
}

function SettingField({
  setting,
  value,
  onChange,
}: {
  setting: Setting
  value: SettingValue
  onChange: (key: string, value: SettingValue) => void
}) {
  const Icon = SOCIAL_ICONS[setting.settingKey] || (
    setting.settingKey.includes('email') ? Mail :
    setting.settingKey.includes('phone') ? Phone :
    setting.settingKey.includes('address') ? MapPin :
    setting.settingKey.includes('hours') ? Clock : null
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-[var(--app-muted)]" />}
        <Label htmlFor={setting.settingKey} className="font-semibold">{setting.label}</Label>
      </div>
      
      {setting.type === 'text' ? (
        <Textarea
          id={setting.settingKey}
          value={valueToString(value)}
          onChange={(event) => onChange(setting.settingKey, event.target.value)}
          placeholder={setting.label}
          rows={3}
          className="resize-none"
        />
      ) : (
        <Input
          id={setting.settingKey}
          type={setting.type === 'email' ? 'email' : setting.type === 'url' ? 'url' : 'text'}
          value={valueToString(value)}
          onChange={(event) => onChange(setting.settingKey, event.target.value)}
          placeholder={setting.label}
        />
      )}
      
      {setting.description && <p className="text-xs text-[var(--app-muted)]">{setting.description}</p>}
    </div>
  )
}
