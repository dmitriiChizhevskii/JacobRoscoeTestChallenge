import { Logger, HttpException, BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { newSubscription } from './dto';
import { NotifyEvent } from '../common/notifyEvent'; 

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly logger: Logger,
    private readonly httpService: HttpService,
    private prisma: PrismaService,
    config: ConfigService
  ) {}

  async subscribe({ url }: newSubscription) {
    try {
      const sub = await this.prisma.subscription.create({ data: { url } });
      return sub;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException(
            'There is a unique constraint violation, a new subscription cannot be created with this url'
          );
        }
      }
    }
  }

  async notify(event: NotifyEvent, body: string) {
    const subs = await this.prisma.subscription.findMany();
    const data = { event, data: body };
    
    subs.forEach(s => {
      const res = this.httpService.post(s.url, data)
      .pipe(
        catchError(e => {
          this.logger.log(`${new Date().toString()} ${s.url}: ${e.code}`);
          return EMPTY;
        }),
      )
      .subscribe(value => {
        this.logger.log(`${new Date().toString()} ${s.url}: successful notification`);
      })
    });
  }
}
