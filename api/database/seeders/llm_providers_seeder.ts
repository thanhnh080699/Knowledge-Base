import { BaseSeeder } from '@adonisjs/lucid/seeders'
import LlmProvider from '#models/llm_provider'
import type { LlmDriver } from '#services/llm_provider_service'

type DefaultLlmProvider = {
  name: string
  driver: LlmDriver
  modelName: string
  apiKey: string | null
  baseUrl: string
  tasks: string[]
  inputTokens: number
  outputTokens: number
  totalTokens: number
  isActive: boolean
  sortOrder: number
}

const llmProviders: DefaultLlmProvider[] = [
  {
    name: 'Primary OpenAI',
    driver: 'openai',
    modelName: 'gpt-5.2',
    apiKey: null,
    baseUrl: 'https://api.openai.com/v1',
    tasks: ['general', 'content_generation', 'summarization'],
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    isActive: true,
    sortOrder: 10,
  },
  {
    name: 'OpenRouter fallback',
    driver: 'openrouter',
    modelName: 'openai/gpt-5.1',
    apiKey: null,
    baseUrl: 'https://openrouter.ai/api/v1',
    tasks: ['general', 'fallback'],
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    isActive: false,
    sortOrder: 20,
  },
]

export default class LlmProvidersSeeder extends BaseSeeder {
  async run() {
    for (const provider of llmProviders) {
      await LlmProvider.updateOrCreate(
        {
          name: provider.name,
        },
        provider
      )
    }

    console.log(`[LLM Providers] Synced ${llmProviders.length} providers`)
  }
}
