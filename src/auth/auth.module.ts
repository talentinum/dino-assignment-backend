import { Module } from '@nestjs/common';

import { AuthTokenService } from './auth.token.service';

import { AuthSessionController } from './auth.session.controller';
import { AuthUserController } from './auth.user.controller';

@Module({
  providers: [AuthTokenService],
  controllers: [AuthSessionController, AuthUserController],
  exports: [AuthTokenService],
})
export class AuthModule {}
