import { Controller } from '@nestjs/common';
import { Delete, Post } from '@nestjs/common';
import { Body, Param } from '@nestjs/common';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import validator from 'validator';

import { AuthTokenService } from './auth.token.service';
import { DBConnService } from '../db/db.conn.service';

import { User } from '../db/entity/User';
import { UserSession } from '../db/entity/UserSession';

@Controller()
export class AuthSessionController {
  constructor(private conn: DBConnService, private token: AuthTokenService) {}

  @Post('auth/sessions')
  async authenticate(
    @Body('username') username: string,
    @Body('pw') pw: string
  ): Promise<string> {
    if (!username || !(username = username.trim()))
      throw new BadRequestException('username required');

    if (!validator.isLength(username, { max: 64 }))
      throw new BadRequestException('username too long');

    if (!pw) throw new BadRequestException('pw required');

    return await this.conn.conn.transaction(async (mgr) => {
      const user = await mgr.findOne(User, {
        where: { username },
        select: ['id', 'pw'],
      });

      if (!user || !(await this.token.comparePW(pw, user.pw)))
        throw new UnauthorizedException('bad username or pw');

      let session = await mgr.findOne(UserSession, {
        where: { user },
        select: ['id'],
      });

      if (session) await mgr.remove(session);

      session = new UserSession();
      session.token = await this.token.generate();
      session.user = user;
      session.usedAt = new Date();
      await mgr.save(session);

      return session.token;
    });
  }

  @Delete('auth/sessions/:token')
  async deauthenticate(@Param('token') token: string): Promise<void> {
    if (
      !token ||
      !(token = token.trim()) ||
      !validator.isLength(token, { min: 256, max: 256 })
    )
      throw new BadRequestException('bad token');

    await this.conn.conn.transaction(async (mgr) => {
      const session = await mgr.findOne(UserSession, {
        where: { token },
        select: ['id'],
      });

      if (session) await mgr.remove(session);
    });
  }
}
