'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  BarChart3, 
  Settings2, 
  Activity, 
  Users, 
  MousePointer2, 
  Timer, 
  RefreshCcw,
  Save,
  RotateCcw,
  Loader2,
  Globe,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSettingsGroup } from '@/hooks/queries/use-settings'
import { useUpdateSettingsGroup } from '@/hooks/mutations/use-setting-mutations'
import { useAnalyticsDashboard, useAnalyticsRealtime } from '@/hooks/queries/use-analytics'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { toast } from 'sonner'
import type { SettingValue, UpdateSettingInput } from '@/types/settings'

const GA_GROUP = 'google_analytics'

export default function GoogleAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'config'>('dashboard')
  const { data: settingsData, isLoading: settingsLoading } = useSettingsGroup(GA_GROUP)
  const isEnabled = settingsData?.values?.google_analytics_enabled === true

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">Dashboard</Link>
          <span className="text-[var(--app-muted)]">/</span>
          <Link href="/dashboard/settings" className="text-blue-600 hover:text-blue-700">Settings</Link>
          <span className="text-[var(--app-muted)]">/</span>
          <span className="text-[var(--app-muted-strong)]">Google Analytics</span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] text-blue-600">Google Analytics</h2>
            <p className="text-[var(--app-muted)] text-sm">Connect and track your website performance directly in the CMS.</p>
          </div>
          <div className="flex bg-[var(--app-surface-muted)] p-1 rounded-lg border border-[var(--app-border)]">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-[var(--app-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'config' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-[var(--app-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Settings2 className="h-4 w-4" />
              Configuration
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          isEnabled ? <AnalyticsDashboard /> : <AnalyticsNotEnabled onGoToConfig={() => setActiveTab('config')} />
        ) : (
          <AnalyticsConfig settingsData={settingsData} isLoading={settingsLoading} />
        )}
      </div>
    </div>
  )
}

function AnalyticsDashboard() {
  const { data, isLoading, error, refetch } = useAnalyticsDashboard()
  const { data: realtime } = useAnalyticsRealtime()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-[var(--app-muted)]">Fetching analytics data from Google...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-red-900">Failed to fetch data</h3>
        <p className="text-red-700 mt-2 mb-6 max-w-md mx-auto">
          {error instanceof Error ? error.message : 'Please check your Service Account JSON and Property ID in the Configuration tab.'}
        </p>
        <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100" onClick={() => refetch()}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  const stats = [
    { label: 'Active Users', value: realtime?.activeUsers || '0', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Users', value: data?.overview.users || '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Page Views', value: data?.overview.pageViews || '0', icon: MousePointer2, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Avg. Duration', value: data?.overview.avgSessionDuration || '0s', icon: Timer, color: 'text-amber-500', bg: 'bg-amber-50' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--app-muted)]">{stat.label}</p>
                <h4 className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Traffic Over Last 30 Days</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.chart}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--app-border)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'var(--app-muted)' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'var(--app-muted)' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid var(--app-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#2563eb" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUsers)" 
                name="Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[var(--app-border)]">
            <h3 className="font-semibold">Top Performing Pages</h3>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-[var(--app-muted)]">Page Path</th>
                  <th className="text-right px-6 py-3 font-medium text-[var(--app-muted)]">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {data?.pages.map((page) => (
                  <tr key={page.path} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 max-w-[300px] truncate">
                      <span className="font-medium text-blue-600">{page.path}</span>
                      <span className="block text-xs text-[var(--app-muted)] truncate">{page.title}</span>
                    </td>
                    <td className="px-6 py-3 text-right font-semibold">{page.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Sources */}
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[var(--app-border)]">
            <h3 className="font-semibold">Top Traffic Sources</h3>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-[var(--app-muted)]">Source / Medium</th>
                  <th className="text-right px-6 py-3 font-medium text-[var(--app-muted)]">Users</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {data?.sources.map((source) => (
                  <tr key={source.source} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 font-medium">{source.source}</td>
                    <td className="px-6 py-3 text-right font-semibold">{source.users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsNotEnabled({ onGoToConfig }: { onGoToConfig: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] p-12 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <Globe className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold">Analytics Not Enabled</h3>
      <p className="text-[var(--app-muted)] mt-2 mb-6 max-w-md mx-auto">
        Enable Google Analytics and provide your credentials in the Configuration tab to start tracking website performance.
      </p>
      <Button onClick={onGoToConfig}>
        Go to Configuration
      </Button>
    </div>
  )
}

function AnalyticsConfig({ settingsData, isLoading }: { settingsData: any; isLoading: boolean }) {
  const updateSettings = useUpdateSettingsGroup(GA_GROUP)
  const [draftValues, setDraftValues] = useState<Record<string, SettingValue>>({})
  
  const baseValues = useMemo(() => settingsData?.values || {}, [settingsData])
  const values = useMemo(() => ({ ...baseValues, ...draftValues }), [baseValues, draftValues])

  function updateValue(key: string, value: SettingValue) {
    setDraftValues((current) => ({ ...current, [key]: value }))
  }

  async function handleSave() {
    const settings = settingsData?.settings || []
    const payload: UpdateSettingInput[] = settings.map((s: any) => ({
      key: s.settingKey,
      value: values[s.settingKey] ?? null,
      type: s.type,
      label: s.label,
      description: s.description,
      sortOrder: s.sortOrder,
    }))

    try {
      await updateSettings.mutateAsync({ settings: payload })
      setDraftValues({})
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    }
  }

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[280px_1fr] lg:gap-12">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">Basic Configuration</h3>
          <p className="mt-2 text-sm text-[var(--app-muted)]">Enable tracking and provide your Measurement ID.</p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50/50 border border-blue-100">
            <div>
              <Label htmlFor="google_analytics_enabled" className="font-semibold text-blue-900">Enable Google Analytics</Label>
              <p className="text-xs text-blue-700">Activate gtag.js on the public website.</p>
            </div>
            <div className="flex items-center h-6">
              <input 
                id="google_analytics_enabled"
                type="checkbox" 
                checked={values.google_analytics_enabled === true}
                onChange={(e) => updateValue('google_analytics_enabled', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="google_analytics_measurement_id" className="font-semibold">Measurement ID</Label>
            <Input 
              id="google_analytics_measurement_id"
              value={String(values.google_analytics_measurement_id || '')}
              onChange={(e) => updateValue('google_analytics_measurement_id', e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
            <p className="text-xs text-[var(--app-muted)]">The GA4 Measurement ID for the public website tracking code.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[280px_1fr] lg:gap-12">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-emerald-600">Reporting API</h3>
          <p className="mt-2 text-sm text-[var(--app-muted)]">Provide credentials to fetch data directly into this CMS.</p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <Label htmlFor="google_analytics_property_id" className="font-semibold">Property ID</Label>
            <Input 
              id="google_analytics_property_id"
              value={String(values.google_analytics_property_id || '')}
              onChange={(e) => updateValue('google_analytics_property_id', e.target.value)}
              placeholder="123456789"
            />
            <p className="text-xs text-[var(--app-muted)]">Found in GA4 Admin > Property Settings > Property ID.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="google_analytics_service_account" className="font-semibold">Service Account JSON</Label>
            <Textarea 
              id="google_analytics_service_account"
              value={typeof values.google_analytics_service_account === 'object' ? JSON.stringify(values.google_analytics_service_account, null, 2) : String(values.google_analytics_service_account || '')}
              onChange={(e) => {
                try {
                  const json = JSON.parse(e.target.value)
                  updateValue('google_analytics_service_account', json)
                } catch {
                  updateValue('google_analytics_service_account', e.target.value)
                }
              }}
              placeholder="{ ... }"
              rows={8}
              className="font-mono text-xs"
            />
            <p className="text-xs text-[var(--app-muted)]">Paste the entire content of your Google Service Account JSON key file.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div />
        <div className="flex flex-wrap gap-2 pb-10">
          <Button size="sm" className="h-10 gap-2 px-6" isLoading={updateSettings.isPending} onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save settings
          </Button>
          <Button variant="outline" size="sm" className="h-10 gap-2 px-6" onClick={() => setDraftValues({})}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
