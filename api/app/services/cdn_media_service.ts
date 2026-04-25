import { readFile } from 'node:fs/promises'
import env from '#start/env'

type QueryParams = Record<string, string | number | boolean | undefined | null>
type JsonPayload = Record<string, unknown>

export default class CdnMediaService {
  private baseUrl = (env.get('CDN_URL') || 'http://localhost:8081').replace(/\/$/, '')
  private apiKey = env.get('CDN_API_KEY') || 'thanhnh_cdn_secret_key'

  async get<T>(path: string, params: QueryParams = {}) {
    return this.request<T>(path, { method: 'GET' }, params)
  }

  async post<T>(path: string, payload: JsonPayload) {
    return this.request<T>(path, this.jsonRequest('POST', payload))
  }

  async put<T>(path: string, payload: JsonPayload) {
    return this.request<T>(path, this.jsonRequest('PUT', payload))
  }

  async delete<T>(path: string, payload?: JsonPayload, params: QueryParams = {}) {
    return this.request<T>(
      path,
      payload ? this.jsonRequest('DELETE', payload) : { method: 'DELETE' },
      params
    )
  }

  async upload<T>(payload: {
    tmpPath: string
    clientName: string
    type?: string
    folder?: string
    width?: string
    height?: string
  }) {
    const form = new FormData()
    const buffer = await readFile(payload.tmpPath)
    form.append('file', new Blob([buffer], { type: payload.type || 'application/octet-stream' }), payload.clientName)
    form.append('folder', payload.folder || '')
    form.append('align', 'none')
    if (payload.width) form.append('width', payload.width)
    if (payload.height) form.append('height', payload.height)

    return this.request<T>('/api/upload', {
      method: 'POST',
      headers: this.authHeaders(),
      body: form,
    })
  }

  private jsonRequest(method: string, payload: JsonPayload): RequestInit {
    return {
      method,
      headers: {
        ...this.authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  }

  private async request<T>(path: string, init: RequestInit, params: QueryParams = {}) {
    const url = new URL(`${this.baseUrl}${path}`)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })

    const response = await fetch(url, {
      ...init,
      headers: {
        ...this.authHeaders(),
        ...(init.headers || {}),
      },
    })

    const body: unknown = await response.json().catch(() => ({}))
    if (!response.ok) {
      const errorBody = body as { error?: unknown }
      const message = typeof errorBody.error === 'string' ? errorBody.error : 'CDN request failed'
      throw new Error(message)
    }

    return body as T
  }

  private authHeaders(): Record<string, string> {
    return { 'X-API-KEY': this.apiKey }
  }
}
