import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
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

    return todo;
  }

  async update(id: number, { completed }: updateTodo) {
    const todo = await this.prisma.task.update({
      where: {
        id
      },
      data: {
        completed
      }
    });

    if (completed === true) this.subscriptionsService.notify(NotifyEvent.todo_completed, todo.body);

    return todo;
  }
}