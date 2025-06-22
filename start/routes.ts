import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
/* import userController from '../app/controllers/users_controller.js' */
const UsersController = () => import('../app/controllers/users_controller.js')
const AuthController = () => import('../app/controllers/auth_controller.js')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.post('login', [AuthController, 'login'])
    router.post('user', [UsersController, 'store'])

    router
      .group(() => {
        router.get('user', [UsersController, 'index'])
        router.get('user/:id', [UsersController, 'show'])
        router.delete('user/:id', [UsersController, 'destroy'])
        router.put('user/:id', [UsersController, 'update'])
      })
      .middleware([middleware.jwt(), middleware.role({ roles: ['admin', 'god'] })])
  })
  .prefix('/api/v1')

