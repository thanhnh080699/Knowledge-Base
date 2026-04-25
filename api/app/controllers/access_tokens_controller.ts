import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

export default class AccessTokensController {
  async store({ request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  async destroy({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const currentAccessToken = 'currentAccessToken' in user ? user.currentAccessToken : null

    if (currentAccessToken) {
      await User.accessTokens.delete(user, currentAccessToken.identifier)
    }

    return {
      message: 'Logged out successfully',
    }
  }
}
