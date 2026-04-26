import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')

export default function authRoutes() {
  router.group(() => {
    router.post('login', [AuthController, 'login'])
    router.post('logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('me', [AuthController, 'me']).use(middleware.auth())
    router.put('profile', [AuthController, 'updateProfile']).use(middleware.auth())
    router.put('change-password', [AuthController, 'changePassword']).use(middleware.auth())
  }).prefix('auth')
}
