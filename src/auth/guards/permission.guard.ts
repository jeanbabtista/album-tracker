import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler())
    if (!requiredPermissions || !requiredPermissions.length) return true

    const request = context.switchToHttp().getRequest()
    const { user } = request ?? {}
    if (!user) return false

    const permissions = [
      ...this.reflector.get<string[]>('availablePermissions', context.getHandler()),
      ...user.permissions
    ]

    return requiredPermissions.every((permission) => permissions.includes(permission))
  }
}
