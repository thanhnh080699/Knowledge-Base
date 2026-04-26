import type { HttpContext } from '@adonisjs/core/http'
import Setting, { type SettingValue } from '#models/setting'
import { showSettingsGroupValidator, updateSettingsGroupValidator } from '#validators/setting'

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
      const setting = await Setting.query()
        .where('setting_group', payload.params.group)
        .where('setting_key', item.key)
        .first()

      if (setting) {
        setting.merge({
          settingValue: item.value as SettingValue,
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
        settingValue: item.value as SettingValue,
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
}
