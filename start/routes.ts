import router from '@adonisjs/core/services/router'
import userController from '../app/controllers/users_controller.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post("user", [userController, "store"]);
