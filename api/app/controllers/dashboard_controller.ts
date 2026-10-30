import type { HttpContext } from '@adonisjs/core/http'
import DashboardService from '#services/dashboard_service'
import {
  dashboardOverviewValidator,
  dashboardSeoIssuesValidator,
  dashboardViewsQueryValidator,
} from '#validators/dashboard'

function cleanQuery(qs: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(qs)) {
    if (value !== '' && value !== null && value !== undefined) {
      cleaned[key] = value
    }
  }
  return cleaned
}

export default class DashboardController {
  private dashboardService = new DashboardService()

  /**
   * @overview
   * @tag DASHBOARD
   * @description Get aggregated CMS dashboard analytics scoped by user permissions
   */
  async overview({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(dashboardOverviewValidator, {
      data: cleanQuery(request.qs()),
    })

    const permissionSlugs = await user.getPermissions()
    const data = await this.dashboardService.getOverview(payload.range ?? '30d', permissionSlugs)

    response.header('Cache-Control', 'private, no-store')
    return response.ok({ data })
  }

  /**
   * @views
   * @tag DASHBOARD
   * @description Get paginated global viewer history across posts (requires posts.manage)
   */
  async views({ request, response }: HttpContext) {
    const payload = await request.validateUsing(dashboardViewsQueryValidator, {
      data: cleanQuery(request.qs()),
    })

    const result = await this.dashboardService.getGlobalViewsLog(payload)
    response.header('Cache-Control', 'private, no-store')
    return response.ok(result)
  }

  /**
   * @seoIssues
   * @tag DASHBOARD
   * @description Get paginated posts with missing SEO metadata or stale drafts
   */
  async seoIssues({ request, response }: HttpContext) {
    const payload = await request.validateUsing(dashboardSeoIssuesValidator, {
      data: cleanQuery(request.qs()),
    })

    const result = await this.dashboardService.getSeoIssuesList(payload)
    response.header('Cache-Control', 'private, no-store')
    return response.ok(result)
  }
}
