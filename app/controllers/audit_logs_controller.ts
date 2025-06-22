import type { HttpContext } from '@adonisjs/core/http'
import AuditLog from '../models/audit_log.js'

export default class AuditLogsController {
  async index({ auth, response }: HttpContext) {
    const user = auth.user!
    if (!['admin', 'god'].includes(user.rol)) {
      return response.forbidden({ message: 'Acceso denegado' })
    }

    const logs = await AuditLog.all()
    return response.json(logs)
  }
}
