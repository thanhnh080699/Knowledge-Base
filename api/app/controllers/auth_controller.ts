import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth'

export default class AuthController {
  /**
   * @login
   * @tag AUTH
   * @description Authenticate user and return access token
   * @requestBody {"email":"user@example.com", "password":"password123"}
   * @responseBody 200 - { data: { token: { type: "bearer", token: "..."}, user: <User> } }
   * @responseBody 400 - { message: "Invalid credentials" }
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    if (!user) {
      return response.badRequest({ message: 'Invalid credentials' })
    }

    const token = await User.accessTokens.create(user)

    return response.ok({
      data: {
        token: token,
        user: user,
      },
    })
  }

  /**
   * @logout
   * @tag AUTH
   * @description Logout user by revoking the current token
   * @responseBody 200 - { message: "Logged out successfully" }
   */
  async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    const currentAccessToken = 'currentAccessToken' in user ? user.currentAccessToken : null

    if (currentAccessToken) {
      await User.accessTokens.delete(user, currentAccessToken.identifier)
    }

    return response.ok({ message: 'Logged out successfully' })
  }

  /**
   * @me
   * @tag AUTH
   * @description Get current authenticated user profile
   * @responseBody 200 - { data: <User> }
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.user!
    const freshUser = await User.query()
      .where('id', user.id)
      .preload('roles', (rolesQuery) => {
        rolesQuery.preload('permissions')
      })
      .firstOrFail()

    return response.ok({
      data: freshUser,
    })
  }
}
