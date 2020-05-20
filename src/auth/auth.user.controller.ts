import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import validator from 'validator';

import { AuthTokenService } from './auth.token.service';
import { DBConnService } from '../db/db.conn.service';

import { User } from '../db/entity/User';

@Controller()
export class AuthUserController {
  constructor(private conn: DBConnService, private token: AuthTokenService) {}

  @Post('auth/users')
  async signup(
    @Body('email') email: string,
    @Body('username') username: string,
    @Body('pw') pw: string
  ): Promise<void> {
    if (!email || !(email = email.trim()))
      throw new BadRequestException('email required');

    if (!validator.isEmail(email)) throw new BadRequestException('bad email');

    if (!validator.isLength(email, { max: 256 }))
      throw new BadRequestException('email too long');

    if (!username || !(username = username.trim()))
      throw new BadRequestException('username required');

    if (!validator.isLength(username, { max: 64 }))
      throw new BadRequestException('username too long');

    if (!pw) throw new BadRequestException('pw required');

    await this.conn.conn.transaction(async (mgr) => {
      const user = new User();
      user.email = email;
      user.username = username;
      user.pw = await this.token.hashPW(pw);

      try {
        await mgr.save(user);
      } catch (err) {
        if (err instanceof QueryFailedError)
          throw new ConflictException('email or username already taken');

        throw err;
      }
    });
  }
}
