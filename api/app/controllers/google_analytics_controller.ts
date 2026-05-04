import type { HttpContext } from '@adonisjs/core/http'
import GoogleAnalyticsService from '#services/google_analytics_service'

export default class GoogleAnalyticsController {
  private analyticsService = new GoogleAnalyticsService()

  /**
   * @getDashboard
   * @tag GOOGLE_ANALYTICS
   * @description Get GA4 dashboard data for CMS
   * @responseBody 200 - { data: object }
   */
  async getDashboard({ response }: HttpContext) {
    try {
      const data = await this.analyticsService.getDashboardData()
      return response.ok({ data })
    } catch (error: any) {
      return response.badRequest({
        message: error.message || 'Unable to fetch Google Analytics data',
      })
    }
  }

  /**
   * @getRealtime
   * @tag GOOGLE_ANALYTICS
   * @description Get real-time active users
   * @responseBody 200 - { data: { activeUsers: string } }
   */
  async getRealtime({ response }: HttpContext) {
    try {
      const data = await this.analyticsService.getRealtimeUsers()
      return response.ok({ data })
    } catch (error: any) {
      return response.badRequest({
        message: error.message || 'Unable to fetch real-time data',
      })
    }
  }
}
