import { Logger, Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  providers: [SubscriptionsService, Logger],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
