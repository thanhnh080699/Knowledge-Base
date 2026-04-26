import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, updateProfileValidator, changePasswordValidator } from '#validators/auth'
import Hash from '@adonisjs/core/services/hash'

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

  /**
   * @updateProfile
   * @tag AUTH
   * @description Update current authenticated user profile
   * @requestBody {"fullName":"New Name", "email":"new@example.com"}
   * @responseBody 200 - { message: "Profile updated successfully", data: <User> }
   */
  async updateProfile({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(updateProfileValidator)

    user.merge(payload)
    await user.save()

    return response.ok({
      message: 'Profile updated successfully',
      data: user,
    })
  }

  /**
   * @changePassword
   * @tag AUTH
   * @description Change current authenticated user password
   * @requestBody {"currentPassword":"oldpassword", "newPassword":"newpassword", "newPassword_confirmation":"newpassword"}
   * @responseBody 200 - { message: "Password changed successfully" }
   * @responseBody 400 - { message: "Incorrect current password" }
   */
  async changePassword({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { currentPassword, newPassword } = await request.validateUsing(changePasswordValidator)

    const isPasswordValid = await Hash.verify(user.password, currentPassword)
    if (!isPasswordValid) {
      return response.badRequest({ message: 'Incorrect current password' })
    }

    user.password = newPassword
    await user.save()

    return response.ok({
      message: 'Password changed successfully',
    })
  }
}

