import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from './role.decorator';
import { LoginedUser } from 'auth.middleware';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get(Permissions, context.getHandler());
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = JSON.parse(request.headers.data) as LoginedUser;
    return user.authorities.includes('R_ROLE_system-full-access') || permissions.every((per) => user.authorities.includes(per));
  }
}
