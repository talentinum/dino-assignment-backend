import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { DBModule } from './db/db.module';
import { TodoModule } from './todo/todo.module';

@Module({ imports: [AuthModule, DBModule, TodoModule] })
export class AppModule {}
