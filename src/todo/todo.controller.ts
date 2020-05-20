import { Controller, UseGuards } from '@nestjs/common';
import { Get, Post, Delete, Patch } from '@nestjs/common';
import { Body, Param, Session } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import validator from 'validator';

import { AuthGuard } from '../auth/auth.guard';

import { DBConnService } from '../db/db.conn.service';

import { Todo } from '../db/entity/Todo';
import { UserSession } from '../db/entity/UserSession';

@Controller()
@UseGuards(AuthGuard)
export class TodoController {
  constructor(private conn: DBConnService) {}

  @Get('todos')
  async listTodos(@Session() session: UserSession): Promise<Todo[]> {
    return await this.conn.conn.manager.find(Todo, {
      where: { user: session.user },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  @Post('todos')
  async newTodo(
    @Session() session: UserSession,
    @Body('title') title: string,
    @Body('desc') desc: string
  ): Promise<void> {
    if (!title || !(title = title.trim()))
      throw new BadRequestException('title required');

    if (!validator.isLength(title, { max: 64 }))
      throw new BadRequestException('title too long');

    if (!desc || !(desc = desc.trim())) desc = '';

    if (!validator.isLength(desc, { max: 256 }))
      throw new BadRequestException('desc too long');

    //
    //  TODO: 함수의 나머지 부분을 구현해주세요.
    //
  }

  @Delete('todos/:id')
  async deleteTodo(
    @Session() session: UserSession,
    @Param('id') id: string
  ): Promise<void> {
    if (!id || !(id = id.trim())) throw new BadRequestException('id required');

    if (!validator.isNumeric(id)) throw new BadRequestException('bad id');

    //
    //  TODO: 함수의 나머지 부분을 구현해주세요.
    //
    //  NOTE: 존재하지 않는 id라면 NotFoundException을 throw합니다.
    //
  }

  @Patch('todos/:id')
  async updateTodo(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body('new-title') newTitle?: string,
    @Body('new-desc') newDesc?: string
  ): Promise<void> {
    if (!id || !(id = id.trim())) throw new BadRequestException('id required');

    if (!validator.isNumeric(id)) throw new BadRequestException('bad id');

    if (newTitle !== undefined) {
      if (!newTitle || !(newTitle = newTitle.trim()))
        throw new BadRequestException('bad new title');

      if (!validator.isLength(newTitle, { max: 64 }))
        throw new BadRequestException('new title too long');
    }

    if (newDesc !== undefined) {
      if (!newDesc || !(newDesc = newDesc.trim())) newDesc = '';

      if (!validator.isLength(newDesc, { max: 256 }))
        throw new BadRequestException('new desc too long');
    }

    if (newTitle === undefined && newDesc === undefined)
      throw new BadRequestException('no change occurred');

    //
    //  TODO: 함수의 나머지 부분을 구현해주세요.
    //
    //  NOTE: 존재하지 않는 id라면 NotFoundException을 throw합니다.
    //
  }

  @Patch('todos/:id/accomplishment')
  async updateTodoAccomplishment(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body('accomplishment') accomplishment: string
  ): Promise<void> {
    if (!id || !(id = id.trim())) throw new BadRequestException('id required');

    if (!validator.isNumeric(id)) throw new BadRequestException('bad id');

    if (accomplishment !== 'true' && accomplishment !== 'false')
      throw new BadRequestException('bad accomplishment');

    //
    //  TODO: 함수의 나머지 부분을 구현해주세요.
    //
    //  NOTE: 존재하지 않는 id라면 NotFoundException을 throw합니다.
    //
  }
}
