export type LlmDriver = 'openai' | 'gemini' | 'nvidia' | 'openrouter' | 'custom'

export type LlmConnectionPayload = {
  driver: LlmDriver
  apiKey?: string
  baseUrl?: string
  modelName?: string
}

export type LlmModel = {
  id: string
  name: string
}

type ProviderConfig = {
  baseUrl: string
  modelsPath: string
  auth: 'bearer' | 'gemini-key' | 'optional-bearer'
  fallbackModels: string[]
}

type OpenAiModelResponse = {
  data?: Array<{ id?: unknown; name?: unknown }>
}

type GeminiModelResponse = {
  models?: Array<{ name?: unknown; displayName?: unknown; supportedGenerationMethods?: unknown }>
}

const PROVIDERS: Record<Exclude<LlmDriver, 'custom'>, ProviderConfig> = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    modelsPath: '/models',
    auth: 'bearer',
    fallbackModels: [
      'gpt-5.2',
      'gpt-5.2-pro',
      'gpt-5.1',
      'gpt-5',
      'gpt-4.1',
      'gpt-4.1-mini',
      'gpt-4o',
      'gpt-4o-mini',
    ],
  },
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    modelsPath: '/models',
    auth: 'gemini-key',
    fallbackModels: [
      'gemini-3-pro',
      'gemini-3-flash',
      'gemini-2.5-pro',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
    ],
  },
  nvidia: {
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    modelsPath: '/models',
    auth: 'bearer',
    fallbackModels: [
      'nvidia/llama-3.3-nemotron-super-49b-v1',
      'meta/llama-3.1-405b-instruct',
      'mistralai/mixtral-8x22b-instruct-v0.1',
    ],
  },
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    modelsPath: '/models',
    auth: 'optional-bearer',
    fallbackModels: [
      'openai/gpt-5.2',
      'openai/gpt-5.1',
      'anthropic/claude-sonnet-4.5',
      'google/gemini-3-pro-preview',
    ],
  },
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.trim().replace(/\/+$/, '')
}

function compactModel(id: string, name?: string): LlmModel {
  return {
    id,
    name: name && name.trim() ? name.trim() : id,
  }
}

function uniqueModels(models: LlmModel[]) {
  const seen = new Set<string>()
  return models.filter((model) => {
    if (!model.id || seen.has(model.id)) {
      return false
    }

    seen.add(model.id)
    return true
  })
}

export default class LlmProviderService {
  getDefaultConfig(driver: LlmDriver) {
    if (driver === 'custom') {
      return {
        driver,
        baseUrl: '',
        models: [],
      }
    }

    const config = PROVIDERS[driver]
    return {
      driver,
      baseUrl: config.baseUrl,
      models: config.fallbackModels.map((model) => compactModel(model)),
    }
  }

  async listModels(payload: LlmConnectionPayload) {
    const config = this.resolveConfig(payload)
    if (!config.baseUrl) {
      return []
    }

    if (!payload.apiKey && payload.driver !== 'openrouter') {
      return config.fallbackModels.map((model) => compactModel(model))
    }

    const url = new URL(`${config.baseUrl}${config.modelsPath}`)
    const headers = this.authHeaders(config.auth, payload.apiKey)

    if (config.auth === 'gemini-key' && payload.apiKey) {
      url.searchParams.set('key', payload.apiKey)
    }

    const response = await fetch(url, { headers })
    const body = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(this.errorMessage(body, 'Unable to list LLM models'))
    }

    return this.extractModels(payload.driver, body)
  }

  async testConnection(payload: LlmConnectionPayload) {
    if (!payload.apiKey) {
      throw new Error('API key is required')
    }

    const models = await this.listModels(payload)
    const selectedModel = payload.modelName?.trim()

    return {
      connected: true,
      modelFound: selectedModel ? models.some((model) => model.id === selectedModel) : null,
      modelsCount: models.length,
    }
  }

  private resolveConfig(payload: LlmConnectionPayload): ProviderConfig {
    if (payload.driver === 'custom') {
      return {
        baseUrl: payload.baseUrl ? normalizeBaseUrl(payload.baseUrl) : '',
        modelsPath: '/models',
        auth: 'optional-bearer',
        fallbackModels: [],
      }
    }

    const provider = PROVIDERS[payload.driver]
    return {
      ...provider,
      baseUrl: normalizeBaseUrl(payload.baseUrl || provider.baseUrl),
    }
  }

  private authHeaders(auth: ProviderConfig['auth'], apiKey?: string): Record<string, string> {
    if (!apiKey || auth === 'gemini-key') {
      return {}
    }

    return {
      Authorization: `Bearer ${apiKey}`,
    }
  }

  private extractModels(driver: LlmDriver, body: unknown) {
    if (driver === 'gemini') {
      const data = body as GeminiModelResponse
      return uniqueModels(
        (data.models || [])
          .filter((model) => {
            const methods = Array.isArray(model.supportedGenerationMethods)
              ? model.supportedGenerationMethods
              : []
            return methods.length === 0 || methods.includes('generateContent')
          })
          .map((model) => {
            const rawName = typeof model.name === 'string' ? model.name : ''
            const id = rawName.replace(/^models\//, '')
            return compactModel(id, typeof model.displayName === 'string' ? model.displayName : id)
          })
      )
    }

    const data = body as OpenAiModelResponse
    return uniqueModels(
      (data.data || [])
        .map((model) => {
          const id = typeof model.id === 'string' ? model.id : ''
          return compactModel(id, typeof model.name === 'string' ? model.name : id)
        })
        .sort((a, b) => a.id.localeCompare(b.id))
    )
  }

  private errorMessage(body: unknown, fallback: string) {
    const payload = body as {
      error?: { message?: unknown } | string
      message?: unknown
    }

    if (typeof payload.error === 'string') {
      return payload.error
    }

    if (
      payload.error &&
      typeof payload.error === 'object' &&
      typeof payload.error.message === 'string'
    ) {
      return payload.error.message
    }

    if (typeof payload.message === 'string') {
      return payload.message
    }

    return fallback
  }
}
