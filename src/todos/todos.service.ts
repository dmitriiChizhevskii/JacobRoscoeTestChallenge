import { NotFoundException, BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { newTodo, updateTodo } from './dto';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { NotifyEvent } from '../common/notifyEvent'; 

@Injectable()
export class TodosService {
  constructor(
    private subscriptionsService: SubscriptionsService,
    private prisma: PrismaService,
    config: ConfigService
  ) {}

  async add({ task }: newTodo) {
    const todo = await this.prisma.task.create({
      data: {
        body: task
      }
    });

    this.subscriptionsService.notify(NotifyEvent.todo_added, todo.body);

    return { success: true };
  }

  async update(id: number, { completed }: updateTodo) {
    const t = await this.prisma.task.findUnique({ where: { id }});
    if (t === null)  throw new NotFoundException(`The todo with id ${id} does not exist`);
    if (t.completed === completed)  throw new BadRequestException(`The todo is already in the correct status`); 

    const todo = await this.prisma.task.update({
      where: {
        id
      },
      data: {
        completed
      }
    });

    if (completed === true) this.subscriptionsService.notify(NotifyEvent.todo_completed, todo.body);

    return { success: true };
  }
}