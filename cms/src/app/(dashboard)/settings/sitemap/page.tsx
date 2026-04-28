'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useUpdateSettingsGroup } from '@/hooks/mutations/use-setting-mutations'
import { useSettingsGroup } from '@/hooks/queries/use-settings'
import type { Setting, SettingValue, UpdateSettingInput } from '@/types/settings'
import { RotateCcw, Save, Loader2, Share2, FileCode, Clock, LayoutList } from 'lucide-react'

const SITEMAP_GROUP = 'sitemap'

function valueToNumber(value: SettingValue): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return parseInt(value, 10) || 0
  return 0
}

export default function SitemapSettingsPage() {
  const { data, isLoading } = useSettingsGroup(SITEMAP_GROUP)
  const updateSettings = useUpdateSettingsGroup(SITEMAP_GROUP)
  
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
          <span className="text-[var(--app-muted-strong)]">Sitemap</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Sitemap Settings</h2>
            <p className="text-[var(--app-muted)]">Configure how your XML sitemap is generated and cached.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/sitemap.xml`} target="_blank" rel="noopener noreferrer" className="gap-2">
                <Share2 className="h-4 w-4" />
                View Sitemap
              </a>
            </Button>
          </div>
        </div>

        <SettingBlock 
          title="General Configuration" 
          description="Basic settings for sitemap generation."
        >
          {isLoading ? (
             <div className="flex min-h-60 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
             </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                <Checkbox
                  id="enable_sitemap"
                  checked={values['enable_sitemap'] === true}
                  onCheckedChange={(checked) => updateValue('enable_sitemap', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="enable_sitemap" className="font-semibold cursor-pointer">
                    Enable sitemap
                  </Label>
                  <p className="text-sm text-[var(--app-muted)]">
                    Whether to generate and serve the XML sitemap for search engines.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <LayoutList className="h-4 w-4 text-[var(--app-muted)]" />
                  <Label htmlFor="sitemap_items_per_page" className="font-semibold">Sitemap items per page</Label>
                </div>
                <Input
                  id="sitemap_items_per_page"
                  type="number"
                  value={valueToNumber(values['sitemap_items_per_page'])}
                  onChange={(event) => updateValue('sitemap_items_per_page', parseInt(event.target.value, 10))}
                  placeholder="500"
                />
                <p className="text-xs text-[var(--app-muted)]">Maximum number of URLs allowed in a single sitemap file.</p>
              </div>
            </div>
          )}
        </SettingBlock>

        <SettingBlock 
          title="Cache Settings" 
          description="Optimize sitemap performance with caching."
        >
          {isLoading ? (
             <div className="flex min-h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
             </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                <Checkbox
                  id="enable_sitemap_cache"
                  checked={values['enable_sitemap_cache'] === true}
                  onCheckedChange={(checked) => updateValue('enable_sitemap_cache', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="enable_sitemap_cache" className="font-semibold cursor-pointer">
                    Enable sitemap cache
                  </Label>
                  <p className="text-sm text-[var(--app-muted)]">
                    Highly recommended for sites with a lot of content.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--app-muted)]" />
                  <Label htmlFor="sitemap_cache_duration" className="font-semibold">Cache duration (minutes)</Label>
                </div>
                <Input
                  id="sitemap_cache_duration"
                  type="number"
                  value={valueToNumber(values['sitemap_cache_duration'])}
                  onChange={(event) => updateValue('sitemap_cache_duration', parseInt(event.target.value, 10))}
                  placeholder="60"
                />
                <p className="text-xs text-[var(--app-muted)]">Length of time to cache the sitemap data.</p>
              </div>
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
