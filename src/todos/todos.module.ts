import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';


@Module({
  imports: [SubscriptionsModule],
  providers: [TodosService],
  controllers: [TodosController]
})
export class TodosModule {}
