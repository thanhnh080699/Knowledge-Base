'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  BarChart3, Settings2, MousePointerClick, Eye, Percent, Hash,
  RefreshCcw, Save, RotateCcw, Loader2, Search, AlertCircle,
  LogIn, LogOut, CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSettingsGroup } from '@/hooks/queries/use-settings'
import { useUpdateSettingsGroup } from '@/hooks/mutations/use-setting-mutations'
import {
  useSearchConsoleDashboard, useSearchConsoleStatus,
  useSearchConsoleAuthUrl, useSearchConsoleDisconnect,
} from '@/hooks/queries/use-search-console'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { toast } from 'sonner'
import type { SettingsGroup, SettingValue, UpdateSettingInput } from '@/types/settings'

const GSC_GROUP = 'google_search_console'

export default function GoogleSearchConsolePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'config'>('dashboard')
  const { data: settingsData, isLoading: settingsLoading } = useSettingsGroup(GSC_GROUP)
  const isEnabled = settingsData?.values?.google_search_console_enabled === true
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('connected') === 'true') {
      toast.success('Google account connected successfully!')
      window.history.replaceState({}, '', window.location.pathname)
    }
    const error = searchParams.get('error')
    if (error) {
      toast.error(`Connection failed: ${error}`)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams])

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
          <Link href="/" className="text-[var(--app-link)] hover:text-[var(--app-link-hover)]">Dashboard</Link>
          <span className="text-[var(--app-muted)]">/</span>
          <Link href="/settings" className="text-[var(--app-link)] hover:text-[var(--app-link-hover)]">Settings</Link>
          <span className="text-[var(--app-muted)]">/</span>
          <span className="text-[var(--app-muted-strong)]">Google Search Console</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--app-link)]">Google Search Console</h2>
            <p className="text-[var(--app-muted)] text-sm">
              Monitor your website&apos;s search performance, top queries, and indexing directly in the CMS.
            </p>
          </div>
          <div className="flex bg-[var(--app-surface-muted)] p-1 rounded-lg border border-[var(--app-border)]">
            {(['dashboard', 'config'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab ? 'bg-[var(--app-surface)] shadow-sm text-[var(--app-link)]' : 'text-[var(--app-muted)] hover:text-[var(--foreground)]'
                }`}>
                {tab === 'dashboard' ? <BarChart3 className="h-4 w-4" /> : <Settings2 className="h-4 w-4" />}
                {tab === 'dashboard' ? 'Dashboard' : 'Configuration'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          isEnabled ? <DashboardTab /> : <NotEnabled onGoToConfig={() => setActiveTab('config')} />
        ) : (
          <ConfigTab settingsData={settingsData} isLoading={settingsLoading} />
        )}
      </div>
    </div>
  )
}

function DashboardTab() {
  const { data, isLoading, error, refetch } = useSearchConsoleDashboard()
  const { data: status } = useSearchConsoleStatus()

  if (!status?.connected) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] p-12 text-center">
        <LogIn className="mx-auto h-10 w-10 text-[var(--app-link)] mb-4" />
        <h3 className="text-lg font-semibold">Not Connected</h3>
        <p className="text-[var(--app-muted)] mt-2">Please go to Configuration tab and connect your Google account first.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--app-link)]" />
        <p className="text-[var(--app-muted)]">Fetching search performance data from Google...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-[var(--app-danger-soft-fg)] mb-4" />
        <h3 className="text-lg font-semibold text-[var(--app-danger-soft-fg)]">Failed to fetch data</h3>
        <p className="text-[var(--app-danger-soft-fg)] mt-2 mb-6 max-w-md mx-auto">
          {error instanceof Error ? error.message : 'Check your configuration and try again.'}
        </p>
        <Button variant="outline" className="border-[var(--app-danger-soft-border)] text-[var(--app-danger-soft-fg)] hover:bg-[var(--app-danger-hover-bg)]" onClick={() => refetch()}>
          <RefreshCcw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    )
  }

  const stats = [
    { label: 'Total Clicks', value: data?.overview.clicks?.toLocaleString() || '0', icon: MousePointerClick, color: 'text-[var(--app-link)]', bg: 'bg-[var(--app-info-soft-bg)]' },
    { label: 'Total Impressions', value: data?.overview.impressions?.toLocaleString() || '0', icon: Eye, color: 'text-[var(--app-accent-soft-fg)]', bg: 'bg-[var(--app-accent-soft-bg)]' },
    { label: 'Avg. CTR', value: data?.overview.ctr || '0.00%', icon: Percent, color: 'text-[var(--app-success-soft-fg)]', bg: 'bg-[var(--app-success-soft-bg)]' },
    { label: 'Avg. Position', value: data?.overview.position || '0.0', icon: Hash, color: 'text-[var(--app-warning-soft-fg)]', bg: 'bg-[var(--app-warning-soft-bg)]' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${s.bg} ${s.color}`}><s.icon className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-medium text-[var(--app-muted)]">{s.label}</p>
                <h4 className="text-2xl font-bold text-[var(--foreground)]">{s.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Search Performance — Last 30 Days</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.chart}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--app-link)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--app-link)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--app-accent-soft-fg)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--app-accent-soft-fg)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--app-border)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--app-muted)' }} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--app-muted)' }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--app-muted)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--app-surface)', color: 'var(--foreground)', borderRadius: '12px', border: '1px solid var(--app-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area yAxisId="left" type="monotone" dataKey="clicks" stroke="var(--app-link)" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" name="Clicks" />
              <Area yAxisId="right" type="monotone" dataKey="impressions" stroke="var(--app-accent-soft-fg)" strokeWidth={2} fillOpacity={1} fill="url(#colorImpressions)" name="Impressions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataTable title="Top Search Queries" columns={['Query', 'Clicks', 'Impr.', 'CTR', 'Pos.']}
          rows={data?.queries.map((q) => [q.query, q.clicks, q.impressions, q.ctr, q.position]) || []}
          highlight={0} />
        <DataTable title="Top Pages" columns={['Page', 'Clicks', 'Impr.', 'CTR', 'Pos.']}
          rows={data?.pages.map((p) => [extractPath(p.page), p.clicks, p.impressions, p.ctr, p.position]) || []}
          highlight={0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataTable title="Top Countries" columns={['Country', 'Clicks', 'Impressions']}
          rows={data?.countries.map((c) => [c.country.toUpperCase(), c.clicks, c.impressions]) || []} />
        <DataTable title="Device Breakdown" columns={['Device', 'Clicks', 'Impressions']}
          rows={data?.devices.map((d) => [capitalize(d.device), d.clicks, d.impressions]) || []} />
      </div>
    </div>
  )
}

function DataTable({ title, columns, rows, highlight }: {
  title: string; columns: string[]; rows: (string | number)[][]; highlight?: number
}) {
  return (
    <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-[var(--app-border)]"><h3 className="font-semibold">{title}</h3></div>
      <div className="overflow-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-[var(--app-surface-strong)] border-b">
            <TableRow>{columns.map((c, i) => (
              <TableHead key={c} className={`${i === 0 ? 'text-left px-6' : 'text-right px-4'} py-3 font-medium text-[var(--app-muted-strong)]`}>{c}</TableHead>
            ))}</TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[var(--app-border)]">
            {rows.length > 0 ? rows.map((row, ri) => (
              <TableRow key={ri} className="hover:bg-[var(--app-surface-hover)] transition-colors">
                {row.map((cell, ci) => (
                  <TableCell key={ci} className={`${ci === 0 ? 'px-6 max-w-[200px] truncate' : 'px-4 text-right'} py-3 ${
                    ci === 0 && highlight === 0 ? 'font-medium text-[var(--app-link)]' : ci === 1 ? 'font-semibold' : 'text-[var(--app-muted)]'
                  }`}>{cell}</TableCell>
                ))}
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={columns.length} className="px-6 py-8 text-center text-[var(--app-muted)]">No data available</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function NotEnabled({ onGoToConfig }: { onGoToConfig: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] p-12 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-[var(--app-info-soft-bg)] flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-[var(--app-link)]" />
      </div>
      <h3 className="text-lg font-semibold">Search Console Not Enabled</h3>
      <p className="text-[var(--app-muted)] mt-2 mb-6 max-w-md mx-auto">
        Enable Google Search Console and connect your Google account in the Configuration tab.
      </p>
      <Button onClick={onGoToConfig}>Go to Configuration</Button>
    </div>
  )
}

function ConfigTab({ settingsData, isLoading }: { settingsData: SettingsGroup | undefined; isLoading: boolean }) {
  const updateSettings = useUpdateSettingsGroup(GSC_GROUP)
  const { data: status, isLoading: statusLoading } = useSearchConsoleStatus()
  const getAuthUrl = useSearchConsoleAuthUrl()
  const disconnect = useSearchConsoleDisconnect()
  const [draftValues, setDraftValues] = useState<Record<string, SettingValue>>({})

  const baseValues = useMemo(() => settingsData?.values || {}, [settingsData])
  const values = useMemo(() => ({ ...baseValues, ...draftValues }), [baseValues, draftValues])

  function updateValue(key: string, value: SettingValue) {
    setDraftValues((c) => ({ ...c, [key]: value }))
  }

  async function handleSave() {
    const settings = settingsData?.settings || []
    const payload: UpdateSettingInput[] = settings.map((s) => ({
      key: s.settingKey, value: values[s.settingKey] ?? null,
      type: s.type, label: s.label, description: s.description, sortOrder: s.sortOrder,
    }))
    try {
      await updateSettings.mutateAsync({ settings: payload })
      setDraftValues({})
      toast.success('Settings saved successfully')
    } catch { toast.error('Failed to save settings') }
  }

  async function handleConnect() {
    try {
      const url = await getAuthUrl.mutateAsync()
      window.location.href = url
    } catch { toast.error('Failed to get auth URL. Make sure Client ID and Secret are saved first.') }
  }

  async function handleDisconnect() {
    try {
      await disconnect.mutateAsync()
      toast.success('Google account disconnected')
    } catch { toast.error('Failed to disconnect') }
  }

  if (isLoading) return (
    <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-[var(--app-link)]" /></div>
  )

  return (
    <div className="space-y-6">
      {/* Basic Configuration */}
      <section className="grid gap-4 lg:grid-cols-[280px_1fr] lg:gap-12">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">Basic Configuration</h3>
          <p className="mt-2 text-sm text-[var(--app-muted)]">Enable the integration and provide your site URL.</p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--app-info-soft-bg)] border border-[var(--app-info-soft-border)]">
            <div>
              <Label htmlFor="gsc_enabled" className="font-semibold text-[var(--app-info-soft-fg)]">Enable Google Search Console</Label>
              <p className="text-xs text-[var(--app-info-soft-fg)]">Activate the integration to view search data in the CMS.</p>
            </div>
            <Checkbox id="gsc_enabled"  checked={values.google_search_console_enabled === true}
              onChange={(e) => updateValue('google_search_console_enabled', e.target.checked)}
              className="h-4 w-4 rounded border-[var(--app-input-border)] text-[var(--app-link)] focus:ring-[var(--app-ring)]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gsc_site_url" className="font-semibold">Site URL</Label>
            <Input id="gsc_site_url" value={String(values.google_search_console_site_url || '')}
              onChange={(e) => updateValue('google_search_console_site_url', e.target.value)}
              placeholder="https://thanhnh.id.vn or sc-domain:thanhnh.id.vn" />
            <p className="text-xs text-[var(--app-muted)]">
              Use <code className="text-xs bg-[var(--app-surface-strong)] px-1 rounded">sc-domain:example.com</code> for domain properties or the full URL for URL-prefix properties.
            </p>
          </div>
        </div>
      </section>

      {/* OAuth2 Credentials */}
      <section className="grid gap-4 lg:grid-cols-[280px_1fr] lg:gap-12">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-[var(--app-success-soft-fg)]">OAuth2 Credentials</h3>
          <p className="mt-2 text-sm text-[var(--app-muted)]">Create an OAuth2 Client ID in Google Cloud Console.</p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gsc_client_id" className="font-semibold">Client ID</Label>
            <Input id="gsc_client_id" value={String(values.google_search_console_client_id || '')}
              onChange={(e) => updateValue('google_search_console_client_id', e.target.value)}
              placeholder="xxx.apps.googleusercontent.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gsc_client_secret" className="font-semibold">Client Secret</Label>
            <Input id="gsc_client_secret" type="password" value={String(values.google_search_console_client_secret || '')}
              onChange={(e) => updateValue('google_search_console_client_secret', e.target.value)}
              placeholder="GOCSPX-..." />
          </div>
        </div>
      </section>

      {/* Google Account Connection */}
      <section className="grid gap-4 lg:grid-cols-[280px_1fr] lg:gap-12">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-[var(--app-accent-soft-fg)]">Google Account</h3>
          <p className="mt-2 text-sm text-[var(--app-muted)]">Connect your Google account to access Search Console data.</p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm">
          {statusLoading ? (
            <div className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin" /><span>Checking connection...</span></div>
          ) : status?.connected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--app-success-soft-bg)] border border-[var(--app-success-soft-border)]">
                <CheckCircle2 className="h-6 w-6 text-[var(--app-success-soft-fg)]" />
                <div>
                  <p className="font-semibold text-[var(--app-success-soft-fg)]">Connected</p>
                  <p className="text-xs text-[var(--app-success-soft-fg)]">Your Google account is connected and ready to fetch data.</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-[var(--app-danger-soft-fg)] border-[var(--app-danger-soft-border)] hover:bg-[var(--app-danger-hover-bg)]"
                onClick={handleDisconnect} isLoading={disconnect.isPending}>
                <LogOut className="h-4 w-4 mr-2" /> Disconnect
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--app-warning-soft-bg)] border border-[var(--app-warning-soft-border)]">
                <AlertCircle className="h-6 w-6 text-[var(--app-warning-soft-fg)]" />
                <div>
                  <p className="font-semibold text-[var(--app-warning-soft-fg)]">Not Connected</p>
                  <p className="text-xs text-[var(--app-warning-soft-fg)]">Save your Client ID and Secret first, then click Connect.</p>
                </div>
              </div>
              <Button onClick={handleConnect} isLoading={getAuthUrl.isPending}>
                <LogIn className="h-4 w-4 mr-2" /> Connect with Google
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Actions */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div />
        <div className="flex flex-wrap gap-2 pb-10">
          <Button size="sm" className="h-10 gap-2 px-6" isLoading={updateSettings.isPending} onClick={handleSave}>
            <Save className="h-4 w-4" /> Save settings
          </Button>
          <Button variant="outline" size="sm" className="h-10 gap-2 px-6" onClick={() => setDraftValues({})}>
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </div>
    </div>
  )
}

function extractPath(url: string) { try { return new URL(url).pathname } catch { return url } }
function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }
