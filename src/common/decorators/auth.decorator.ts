import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { AuthGuard } from '../../auth/guards/jwt.guard'

export function Auth() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  )
}
