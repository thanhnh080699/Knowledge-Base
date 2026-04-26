import Setting from '#models/setting'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

export default class GoogleAnalyticsService {
  private client: BetaAnalyticsDataClient | null = null

  private async getClient() {
    if (this.client) return this.client

    const enabled = await Setting.query()
      .where('setting_group', 'google_analytics')
      .where('setting_key', 'google_analytics_enabled')
      .first()

    if (!enabled || !enabled.settingValue) {
      throw new Error('Google Analytics is not enabled')
    }

    const serviceAccount = await Setting.query()
      .where('setting_group', 'google_analytics')
      .where('setting_key', 'google_analytics_service_account')
      .first()

    if (!serviceAccount || !serviceAccount.settingValue || typeof serviceAccount.settingValue !== 'object' || Object.keys(serviceAccount.settingValue).length === 0) {
      throw new Error('Google Analytics Service Account JSON is missing or invalid')
    }

    try {
      this.client = new BetaAnalyticsDataClient({
        credentials: serviceAccount.settingValue as any,
      })
      return this.client
    } catch (error) {
      throw new Error(`Failed to initialize Google Analytics client: ${error.message}`)
    }
  }

  private async getPropertyId() {
    const propertyIdSetting = await Setting.query()
      .where('setting_group', 'google_analytics')
      .where('setting_key', 'google_analytics_property_id')
      .first()

    if (!propertyIdSetting || !propertyIdSetting.settingValue) {
      throw new Error('Google Analytics Property ID is missing')
    }

    return String(propertyIdSetting.settingValue)
  }

  async getDashboardData() {
    const client = await this.getClient()
    const propertyId = await this.getPropertyId()

    // 1. General Stats (Overview)
    const [overviewResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    })

    // 2. Chart Data (Last 30 days)
    const [chartResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    })

    // 3. Top Pages
    const [pagesResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [{ name: 'screenPageViews' }],
      limit: 10,
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    })

    // 4. Top Sources
    const [sourcesResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionSourceMedium' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 10,
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    })

    return {
      overview: this.formatOverview(overviewResponse),
      chart: this.formatChart(chartResponse),
      pages: this.formatPages(pagesResponse),
      sources: this.formatSources(sourcesResponse),
    }
  }

  async getRealtimeUsers() {
    const client = await this.getClient()
    const propertyId = await this.getPropertyId()

    const [response] = await client.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: 'activeUsers' }],
    })

    return {
      activeUsers: response.rows?.[0]?.metricValues?.[0]?.value || '0',
    }
  }

  private formatOverview(response: any) {
    const row = response.rows?.[0]
    if (!row) return {}
    
    return {
      users: row.metricValues[0].value,
      sessions: row.metricValues[1].value,
      pageViews: row.metricValues[2].value,
      bounceRate: (parseFloat(row.metricValues[3].value) * 100).toFixed(2) + '%',
      avgSessionDuration: this.formatDuration(row.metricValues[4].value),
    }
  }

  private formatChart(response: any) {
    return response.rows?.map((row: any) => ({
      date: this.formatDate(row.dimensionValues[0].value),
      users: parseInt(row.metricValues[0].value),
      views: parseInt(row.metricValues[1].value),
    })) || []
  }

  private formatPages(response: any) {
    return response.rows?.map((row: any) => ({
      path: row.dimensionValues[0].value,
      title: row.dimensionValues[1].value,
      views: row.metricValues[0].value,
    })) || []
  }

  private formatSources(response: any) {
    return response.rows?.map((row: any) => ({
      source: row.dimensionValues[0].value,
      users: row.metricValues[0].value,
    })) || []
  }

  private formatDuration(seconds: string) {
    const s = parseFloat(seconds)
    const mins = Math.floor(s / 60)
    const secs = Math.round(s % 60)
    return `${mins}m ${secs}s`
  }

  private formatDate(dateStr: string) {
    // YYYYMMDD -> DD/MM
    return `${dateStr.substring(6, 8)}/${dateStr.substring(4, 6)}`
  }
}
