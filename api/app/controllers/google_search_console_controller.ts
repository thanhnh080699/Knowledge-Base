import type { HttpContext } from '@adonisjs/core/http'
import GoogleSearchConsoleService from '#services/google_search_console_service'
import env from '#start/env'

export default class GoogleSearchConsoleController {
  private searchConsoleService = new GoogleSearchConsoleService()

  /**
   * @getDashboard
   * @tag GOOGLE_SEARCH_CONSOLE
   * @description Get Google Search Console dashboard data for CMS
   * @responseBody 200 - { data: object }
   */
  async getDashboard({ response }: HttpContext) {
    try {
      const data = await this.searchConsoleService.getDashboardData()
      return response.ok({ data })
    } catch (error: any) {
      return response.badRequest({
        message: error.message || 'Unable to fetch Google Search Console data',
      })
    }
  }

  /**
   * @getAuthUrl
   * @tag GOOGLE_SEARCH_CONSOLE
   * @description Generate Google OAuth2 consent URL
   * @responseBody 200 - { data: { url: string } }
   */
  async getAuthUrl({ response }: HttpContext) {
    try {
      const url = await this.searchConsoleService.getAuthUrl()
      return response.ok({ data: { url } })
    } catch (error: any) {
      return response.badRequest({
        message: error.message || 'Unable to generate Google auth URL',
      })
    }
  }

  /**
   * @handleCallback
   * @tag GOOGLE_SEARCH_CONSOLE
   * @description Handle OAuth2 callback from Google — exchange code for tokens, save, redirect to CMS
   */
  async handleCallback({ request, response }: HttpContext) {
    const code = request.input('code')
    const error = request.input('error')

    // Determine the CMS URL to redirect back to
    const corsOrigin = env.get('CORS_ORIGIN', 'http://localhost:3000')
    const cmsUrl = corsOrigin.split(',')[0].trim()
    const redirectTarget = `${cmsUrl}/settings/others/google-search-console`

    if (error) {
      return response.redirect(`${redirectTarget}?error=${encodeURIComponent(error)}`)
    }

    if (!code) {
      return response.redirect(`${redirectTarget}?error=${encodeURIComponent('No authorization code received')}`)
    }

    try {
      await this.searchConsoleService.handleCallback(code)
      return response.redirect(`${redirectTarget}?connected=true`)
    } catch (err: any) {
      return response.redirect(
        `${redirectTarget}?error=${encodeURIComponent(err.message || 'Failed to connect')}`
      )
    }
  }

  /**
   * @disconnect
   * @tag GOOGLE_SEARCH_CONSOLE
   * @description Disconnect Google account (remove stored tokens)
   * @responseBody 200 - { message: string }
   */
  async disconnect({ response }: HttpContext) {
    try {
      await this.searchConsoleService.disconnect()
      return response.ok({ message: 'Google account disconnected successfully' })
    } catch (error: any) {
      return response.badRequest({
        message: error.message || 'Failed to disconnect',
      })
    }
  }

  /**
   * @getStatus
   * @tag GOOGLE_SEARCH_CONSOLE
   * @description Check if Google account is currently connected
   * @responseBody 200 - { data: { connected: boolean } }
   */
  async getStatus({ response }: HttpContext) {
    try {
      const connected = await this.searchConsoleService.isConnected()
      return response.ok({ data: { connected } })
    } catch (error: any) {
      return response.ok({ data: { connected: false } })
    }
  }
}
