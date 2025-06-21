import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
/* import userController from '../app/controllers/users_controller.js' */
const UsersController = () => import('../app/controllers/users_controller.js')
const SalesController = () => import('../app/controllers/sales_controller.js')

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
      router.delete("user/:id", [UsersController, "destroy"]);
      router.put("user/:id", [UsersController, "update"]);
    })

    router.group(() => {
      router.get('sales', [SalesController, 'index']).use(middleware.auth())
      router.post('sales', [SalesController, 'store']).use(middleware.auth())
    })
  })
  .prefix('/api/v1')

