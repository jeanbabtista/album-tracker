import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { AuthGuard } from '../../auth/guards/jwt.guard'
import { PermissionGuard } from '../../auth/guards/permission.guard'
import { Permission } from '../enums/permission'

export function Auth(...permissions: Permission[]) {
  return applyDecorators(
    SetMetadata('availablePermissions', []),
    SetMetadata('permissions', permissions),
    UseGuards(AuthGuard, PermissionGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  )
}
