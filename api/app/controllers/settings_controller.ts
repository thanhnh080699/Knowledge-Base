import type { HttpContext } from '@adonisjs/core/http'
import Setting, { type SettingValue } from '#models/setting'
import EmailService from '#services/email_service'
import { normalizeMediaPath } from '#helpers/media'
import {
  sendTestEmailValidator,
  showSettingsGroupValidator,
  updateSettingsGroupValidator,
} from '#validators/setting'

function formatGroupPayload(group: string, settings: Setting[]) {
  return {
    group,
    settings,
    values: settings.reduce<Record<string, SettingValue>>((carry, setting) => {
      carry[setting.settingKey] = setting.settingValue
      return carry
    }, {}),
  }
}

export default class SettingsController {
  private emailService = new EmailService()

  private settingValueForStorage(group: string, key: string, value: SettingValue | null) {
    if (
      group === 'admin-appearance' &&
      ['admin_logo', 'admin_favicon'].includes(key) &&
      typeof value === 'string'
    ) {
      return normalizeMediaPath(value) as SettingValue
    }

    return value
  }

  /**
   * @show
   * @tag SETTINGS
   * @description Show settings by key-value group
   * @paramPath group - Settings group key
   * @responseBody 200 - { data: { group: string, settings: <Setting[]>, values: object } }
   */
  async showGroup({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(showSettingsGroupValidator, {
      meta: { params },
    })

    const settings = await Setting.query()
      .where('setting_group', payload.params.group)
      .orderBy('sort_order', 'asc')
      .orderBy('setting_key', 'asc')

    return response.ok({ data: formatGroupPayload(payload.params.group, settings) })
  }

  /**
   * @update
   * @tag SETTINGS
   * @description Update settings in a key-value group
   * @paramPath group - Settings group key
   * @requestBody { settings: [{ key: string, value: any }] }
   * @responseBody 200 - { data: { group: string, settings: <Setting[]>, values: object } }
   */
  async updateGroup({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateSettingsGroupValidator, {
      meta: { params },
    })

    for (const item of payload.settings) {
      const rawSettingValue = item.value === undefined ? null : (item.value as SettingValue)
      const settingValue = this.settingValueForStorage(
        payload.params.group,
        item.key,
        rawSettingValue
      )
      const setting = await Setting.query()
        .where('setting_group', payload.params.group)
        .where('setting_key', item.key)
        .first()

      if (setting) {
        setting.merge({
          settingValue,
          type: item.type ?? setting.type,
          label: item.label ?? setting.label,
          description: item.description === undefined ? setting.description : item.description,
          sortOrder: item.sortOrder ?? setting.sortOrder,
        })
        await setting.save()
        continue
      }

      await Setting.create({
        settingGroup: payload.params.group,
        settingKey: item.key,
        settingValue,
        type: item.type ?? 'string',
        label: item.label ?? item.key,
        description: item.description ?? null,
        sortOrder: item.sortOrder ?? 0,
      })
    }

    const settings = await Setting.query()
      .where('setting_group', payload.params.group)
      .orderBy('sort_order', 'asc')
      .orderBy('setting_key', 'asc')

    return response.ok({ data: formatGroupPayload(payload.params.group, settings) })
  }

  /**
   * @sendTestEmail
   * @tag SETTINGS
   * @description Send a test email using saved email settings
   * @requestBody { recipient: "user@example.com" }
   * @responseBody 200 - { data: { messageId: string, accepted: string[], rejected: string[] } }
   */
  async sendTestEmail({ request, response }: HttpContext) {
    const payload = await request.validateUsing(sendTestEmailValidator)

    try {
      const result = await this.emailService.sendTestEmail(payload.recipient)

      return response.ok({
        data: result,
        message: 'Test email sent successfully',
      })
    } catch (error) {
      return response.badRequest({
        message: error instanceof Error ? error.message : 'Unable to send test email',
      })
    }
  }

  /**
   * @getPublicSettings
   * @tag SETTINGS
   * @description Get public settings for the frontend
   * @responseBody 200 - { data: object }
   */
  async getPublicSettings({ response }: HttpContext) {
    const publicKeys = [
      'site_name',
      'site_description',
      'site_url',
      'google_analytics_enabled',
      'google_analytics_measurement_id',
      'admin_logo',
      'admin_favicon',
      'contact_name',
      'contact_email',
      'contact_phone',
      'contact_address',
      'working_hours',
      'social_facebook',
      'social_twitter',
      'social_linkedin',
      'social_github',
      'social_youtube',
      'social_instagram',
    ]

    const settings = await Setting.query().whereIn('setting_key', publicKeys)

    const values = settings.reduce<Record<string, SettingValue>>((carry, setting) => {
      carry[setting.settingKey] = setting.settingValue
      return carry
    }, {})

    return response.ok({ data: values })
  }
}
