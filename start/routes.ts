import router from '@adonisjs/core/services/router'
/* import userController from '../app/controllers/users_controller.js' */
const UsersController = () => import('../app/controllers/users_controller.js')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.group(() => {
      router.get("user", [UsersController, "index"]);
      router.get("user/:id", [UsersController, "show"]);
      router.post("user", [UsersController, "store"]);
    })
  })
  .prefix('/api/v1')

