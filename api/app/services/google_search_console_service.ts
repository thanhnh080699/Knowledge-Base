import Setting from '#models/setting'
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import env from '#start/env'

const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
]

const GSC_GROUP = 'google_search_console'

export default class GoogleSearchConsoleService {
  /**
   * Read a single GSC setting from database
   */
  private async getSetting(key: string) {
    const setting = await Setting.query()
      .where('setting_group', GSC_GROUP)
      .where('setting_key', key)
      .first()
    return setting?.settingValue ?? null
  }

  /**
   * Write a single GSC setting to database
   */
  private async setSetting(key: string, value: string) {
    await Setting.query()
      .where('setting_group', GSC_GROUP)
      .where('setting_key', key)
      .update({ settingValue: JSON.stringify(value) })
  }

  /**
   * Build the OAuth2 redirect URI based on current environment
   */
  private getRedirectUri() {
    const appUrl = env.get('APP_URL', 'http://localhost:3333')
    return `${appUrl}/admin/google-search-console/callback`
  }

  /**
   * Create an OAuth2Client from stored client_id + client_secret
   */
  private async createOAuth2Client() {
    const clientId = await this.getSetting('google_search_console_client_id')
    const clientSecret = await this.getSetting('google_search_console_client_secret')

    if (!clientId || !clientSecret) {
      throw new Error('OAuth2 Client ID and Client Secret are required. Configure them in Settings.')
    }

    return new OAuth2Client(
      String(clientId),
      String(clientSecret),
      this.getRedirectUri()
    )
  }

  /**
   * Create an authenticated Search Console client using stored refresh token
   */
  private async getAuthenticatedClient() {
    const oauth2Client = await this.createOAuth2Client()
    const refreshToken = await this.getSetting('google_search_console_refresh_token')

    if (!refreshToken) {
      throw new Error('Not connected to Google. Please click "Connect with Google" in Settings.')
    }

    oauth2Client.setCredentials({
      refresh_token: String(refreshToken),
    })

    return google.searchconsole({ version: 'v1', auth: oauth2Client })
  }

  /**
   * Generate the Google OAuth2 consent URL
   */
  async getAuthUrl() {
    const oauth2Client = await this.createOAuth2Client()

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: SCOPES,
    })
  }

  /**
   * Exchange authorization code for tokens and save refresh_token to DB
   */
  async handleCallback(code: string) {
    const oauth2Client = await this.createOAuth2Client()
    const { tokens } = await oauth2Client.getToken(code)

    if (!tokens.refresh_token) {
      throw new Error('No refresh token received from Google. Please try connecting again.')
    }

    await this.setSetting('google_search_console_refresh_token', tokens.refresh_token)
  }

  /**
   * Remove stored tokens (disconnect)
   */
  async disconnect() {
    await this.setSetting('google_search_console_refresh_token', '')
  }

  /**
   * Check if the user is currently connected (has refresh token)
   */
  async isConnected() {
    const refreshToken = await this.getSetting('google_search_console_refresh_token')
    return !!refreshToken && String(refreshToken).length > 0
  }

  /**
   * Read site URL from settings
   */
  private async getSiteUrl() {
    const siteUrl = await this.getSetting('google_search_console_site_url')
    if (!siteUrl) {
      throw new Error('Google Search Console Site URL is not configured.')
    }
    return String(siteUrl)
  }

  /**
   * Fetch all dashboard data in one call
   */
  async getDashboardData() {
    const client = await this.getAuthenticatedClient()
    const siteUrl = await this.getSiteUrl()

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const startDateStr = this.toDateString(startDate)
    const endDateStr = this.toDateString(endDate)

    // 1. Overview (totals)
    const overviewRes = await client.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: startDateStr,
        endDate: endDateStr,
      },
    })

    // 2. Chart data (by date)
    const chartRes = await client.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: startDateStr,
        endDate: endDateStr,
        dimensions: ['date'],
      },
    })

    // 3. Top Queries
    const queriesRes = await client.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: startDateStr,
        endDate: endDateStr,
        dimensions: ['query'],
        rowLimit: 10,
      },
    })

    // 4. Top Pages
    const pagesRes = await client.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: startDateStr,
        endDate: endDateStr,
        dimensions: ['page'],
        rowLimit: 10,
      },
    })

    // 5. Top Countries
    const countriesRes = await client.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: startDateStr,
        endDate: endDateStr,
        dimensions: ['country'],
        rowLimit: 10,
      },
    })

    // 6. Device breakdown
    const devicesRes = await client.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: startDateStr,
        endDate: endDateStr,
        dimensions: ['device'],
      },
    })

    return {
      overview: this.formatOverview(overviewRes.data),
      chart: this.formatChart(chartRes.data),
      queries: this.formatQueries(queriesRes.data),
      pages: this.formatPages(pagesRes.data),
      countries: this.formatCountries(countriesRes.data),
      devices: this.formatDevices(devicesRes.data),
    }
  }

  private formatOverview(data: any) {
    const row = data.rows?.[0]
    if (!row) {
      return { clicks: 0, impressions: 0, ctr: '0.00%', position: '0.0' }
    }

    return {
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: ((row.ctr || 0) * 100).toFixed(2) + '%',
      position: (row.position || 0).toFixed(1),
    }
  }

  private formatChart(data: any) {
    return (
      data.rows?.map((row: any) => ({
        date: this.formatDate(row.keys[0]),
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
      })) || []
    )
  }

  private formatQueries(data: any) {
    return (
      data.rows?.map((row: any) => ({
        query: row.keys[0],
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: ((row.ctr || 0) * 100).toFixed(2) + '%',
        position: (row.position || 0).toFixed(1),
      })) || []
    )
  }

  private formatPages(data: any) {
    return (
      data.rows?.map((row: any) => ({
        page: row.keys[0],
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: ((row.ctr || 0) * 100).toFixed(2) + '%',
        position: (row.position || 0).toFixed(1),
      })) || []
    )
  }

  private formatCountries(data: any) {
    return (
      data.rows?.map((row: any) => ({
        country: row.keys[0],
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
      })) || []
    )
  }

  private formatDevices(data: any) {
    return (
      data.rows?.map((row: any) => ({
        device: row.keys[0],
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
      })) || []
    )
  }

  private toDateString(date: Date) {
    return date.toISOString().split('T')[0]
  }

  private formatDate(dateStr: string) {
    const parts = dateStr.split('-')
    return `${parts[2]}/${parts[1]}`
  }
}
