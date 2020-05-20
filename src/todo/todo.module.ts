import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { TodoController } from './todo.controller';

@Module({
  imports: [AuthModule],
  controllers: [TodoController],
})
export class TodoModule {}
