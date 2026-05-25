import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Permission from '#models/permission'
import Setting from '#models/setting'
import LlmProvider from '#models/llm_provider'

test.group('Settings', () => {
  async function createSettingsAdmin() {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const admin = await User.firstOrCreate(
      { email: `admin-settings-${suffix}@example.com` },
      {
        fullName: 'Settings Admin',
        password: 'password123',
      }
    )

    const adminRole = await Role.firstOrCreate(
      { slug: `settings-admin-${suffix}` },
      {
        name: `Settings Administrator ${suffix}`,
        description: 'Can manage settings',
      }
    )

    const permission = await Permission.firstOrCreate(
      { slug: 'settings.manage' },
      {
        name: 'Manage Settings',
        module: 'Settings',
      }
    )

    await adminRole.related('permissions').sync([permission.id])
    await admin.related('roles').sync([adminRole.id])

    return admin
  }

  test('return seeded overview settings as a key-value group', async ({ client, assert }) => {
    const admin = await createSettingsAdmin()
    await Setting.updateOrCreate(
      {
        settingGroup: 'overview',
        settingKey: 'site_name',
      },
      {
        settingGroup: 'overview',
        settingKey: 'site_name',
        settingValue: 'thanhnh.id.vn',
        type: 'string',
        label: 'Site name',
        description: 'Main website name displayed across public pages and metadata.',
        sortOrder: 10,
      }
    )

    const response = await client.get('/api/admin/settings/overview').loginAs(admin)
    response.assertStatus(200)

    const body = response.body().data as {
      group: string
      settings: Array<{ settingKey: string }>
      values: Record<string, unknown>
    }

    assert.equal(body.group, 'overview')
    assert.isTrue(body.settings.some((setting) => setting.settingKey === 'site_name'))
    assert.equal(body.values.site_name, 'thanhnh.id.vn')
  })

  test('update overview settings and persist typed values', async ({ client, assert }) => {
    const admin = await createSettingsAdmin()

    const response = await client
      .put('/api/admin/settings/overview')
      .loginAs(admin)
      .json({
        settings: [
          { key: 'site_name', value: 'Thanh Nguyen Knowledge Base' },
          { key: 'maintenance_mode', value: true, type: 'boolean' },
        ],
      })

    response.assertStatus(200)
    assert.equal(response.body().data.values.site_name, 'Thanh Nguyen Knowledge Base')
    assert.equal(response.body().data.values.maintenance_mode, true)

    const siteName = await Setting.query()
      .where('setting_group', 'overview')
      .where('setting_key', 'site_name')
      .firstOrFail()

    assert.equal(siteName.settingValue, 'Thanh Nguyen Knowledge Base')
  })

  test('return default LLM models and base URL for provider without API key', async ({
    client,
    assert,
  }) => {
    const admin = await createSettingsAdmin()

    const response = await client
      .get('/api/admin/settings/llm/models')
      .qs({ driver: 'openai' })
      .loginAs(admin)

    response.assertStatus(200)

    const body = response.body().data as {
      driver: string
      baseUrl: string
      models: Array<{ id: string }>
    }

    assert.equal(body.driver, 'openai')
    assert.equal(body.baseUrl, 'https://api.openai.com/v1')
    assert.isTrue(body.models.some((model) => model.id === 'gpt-5.2'))
  })

  test('verify LLM connection by listing provider models', async ({ client, assert, cleanup }) => {
    const admin = await createSettingsAdmin()
    const originalFetch = globalThis.fetch

    cleanup(() => {
      globalThis.fetch = originalFetch
    })

    globalThis.fetch = async (input, init) => {
      assert.equal(String(input), 'https://api.openai.com/v1/models')
      assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer test-key')

      return new Response(
        JSON.stringify({
          data: [{ id: 'gpt-5.2' }, { id: 'gpt-4.1-mini' }],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const response = await client.post('/api/admin/settings/llm/test').loginAs(admin).json({
      driver: 'openai',
      apiKey: 'test-key',
      modelName: 'gpt-5.2',
    })

    response.assertStatus(200)
    assert.deepInclude(response.body().data, {
      connected: true,
      modelFound: true,
      modelsCount: 2,
    })
  })

  test('create multiple active LLM providers with independent inactive providers', async ({
    client,
    assert,
  }) => {
    const admin = await createSettingsAdmin()

    const primary = await client
      .post('/api/admin/settings/llm/providers')
      .loginAs(admin)
      .json({
        name: 'Primary OpenAI',
        driver: 'openai',
        modelName: 'gpt-5.2',
        apiKey: 'primary-key',
        baseUrl: 'https://api.openai.com/v1',
        tasks: ['general', 'content_generation'],
        isActive: true,
      })
    const fallback = await client
      .post('/api/admin/settings/llm/providers')
      .loginAs(admin)
      .json({
        name: 'Fallback OpenRouter',
        driver: 'openrouter',
        modelName: 'openai/gpt-5.1',
        apiKey: 'fallback-key',
        baseUrl: 'https://openrouter.ai/api/v1',
        tasks: ['general', 'fallback'],
        isActive: true,
      })
    const inactive = await client
      .post('/api/admin/settings/llm/providers')
      .loginAs(admin)
      .json({
        name: 'Draft Gemini',
        driver: 'gemini',
        modelName: 'gemini-3-pro',
        apiKey: 'gemini-key',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        tasks: ['translation'],
        isActive: false,
      })

    primary.assertStatus(201)
    fallback.assertStatus(201)
    inactive.assertStatus(201)

    const response = await client.get('/api/admin/settings/llm/providers').loginAs(admin)
    response.assertStatus(200)

    const providers = response.body().data as Array<{
      name: string
      isActive: boolean
      inputTokens: number
      outputTokens: number
      totalTokens: number
      apiKey?: string
    }>

    const createdProviders = providers.filter((provider) =>
      ['Primary OpenAI', 'Fallback OpenRouter', 'Draft Gemini'].includes(provider.name)
    )

    assert.lengthOf(
      createdProviders.filter((provider) => provider.isActive),
      2
    )
    assert.isTrue(
      providers.some((provider) => provider.name === 'Primary OpenAI' && provider.isActive)
    )
    assert.isTrue(
      providers.some((provider) => provider.name === 'Fallback OpenRouter' && provider.isActive)
    )
    assert.isTrue(
      providers.some((provider) => provider.name === 'Draft Gemini' && !provider.isActive)
    )
    assert.deepInclude(
      providers.find((provider) => provider.name === 'Primary OpenAI'),
      {
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      }
    )
    assert.isUndefined(providers.find((provider) => provider.name === 'Primary OpenAI')?.apiKey)
  })

  test('test saved LLM provider connection without exposing API key', async ({
    client,
    assert,
    cleanup,
  }) => {
    const admin = await createSettingsAdmin()
    const provider = await LlmProvider.create({
      name: 'Saved OpenAI',
      driver: 'openai',
      modelName: 'gpt-5.2',
      apiKey: 'saved-key',
      baseUrl: 'https://api.openai.com/v1',
      tasks: ['general'],
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      isActive: true,
      sortOrder: 0,
    })
    const originalFetch = globalThis.fetch

    cleanup(() => {
      globalThis.fetch = originalFetch
    })

    globalThis.fetch = async (input, init) => {
      assert.equal(String(input), 'https://api.openai.com/v1/models')
      assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer saved-key')

      return new Response(JSON.stringify({ data: [{ id: 'gpt-5.2' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const response = await client
      .post(`/api/admin/settings/llm/providers/${provider.id}/test`)
      .loginAs(admin)

    response.assertStatus(200)
    assert.deepInclude(response.body().data, {
      connected: true,
      modelFound: true,
      modelsCount: 1,
    })
  })
})
