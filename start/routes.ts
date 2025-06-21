import router from '@adonisjs/core/services/router'
/* import userController from '../app/controllers/users_controller.js' */
const UsersController = () => import('../app/controllers/users_controller.js')
const ProductsController = () => import('../app/controllers/products_controller.js')

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
      router
        .delete("user/:id", [UsersController, "destroy"])
        .use(['auth', 'role:admin,god']);
      router
        .put("user/:id", [UsersController, "update"])
        .use(['auth', 'role:employee,admin,god']);

      router.get('products', [ProductsController, 'index']);
      router.get('products/:id', [ProductsController, 'show']);
      router
        .post('products', [ProductsController, 'store'])
        .use(['auth', 'role:admin,god']);
      router
        .put('products/:id', [ProductsController, 'update'])
        .use(['auth', 'role:admin,god']);
      router
        .delete('products/:id', [ProductsController, 'destroy'])
        .use(['auth', 'role:admin,god']);
    })
  })
  .prefix('/api/v1')

