export type TokenExpirationOption = '1_week' | '1_month' | '1_year' | 'no_expire'

export interface ApiAccessToken {
  id: number
  name: string
  permissions: string[]
  expiresAt: string | null
  lastUsedAt: string | null
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
}

export interface CreateApiAccessTokenPayload {
  name: string
  expiresIn: TokenExpirationOption
  permissions: string[]
}

export interface UpdateApiAccessTokenPayload {
  name?: string
  expiresIn?: TokenExpirationOption
  permissions?: string[]
}

export interface CreatedApiAccessToken {
  token: string
  item: ApiAccessToken
}
