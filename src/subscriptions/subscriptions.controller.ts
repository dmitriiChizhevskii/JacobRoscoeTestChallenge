import { Controller, HttpStatus, Post, HttpCode, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { newSubscription } from './dto';

@Controller('subscribe')
export class SubscriptionsController {
  constructor(private transactionService: SubscriptionsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  subscribe(@Body() params: newSubscription) {
    return this.transactionService.subscribe(params);
  }
}
