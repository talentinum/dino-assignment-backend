import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { MoreThan } from 'typeorm';
import validator from 'validator';

import { DBConnService } from '../db/db.conn.service';

import { UserSession } from '../db/entity/UserSession';

const TOKEN_EXPIRY = 1000 * 60 * 30;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private conn: DBConnService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let token = context.switchToHttp().getRequest().header('api-token');

    if (
      !token ||
      !(token = token.trim()) ||
      !validator.isLength(token, { min: 256, max: 256 })
    )
      throw new UnauthorizedException();

    return await this.conn.conn.transaction(async (mgr) => {
      const session = await mgr.findOne(UserSession, {
        where: {
          token,
          usedAt: MoreThan(new Date(Date.now() - TOKEN_EXPIRY)),
        },
        relations: ['user'],
      });

      if (!session) throw new UnauthorizedException();

      session.usedAt = new Date();
      await mgr.save(session);

      context.switchToHttp().getRequest().session = session;

      return true;
    });
  }
}
