import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OfferService } from '../offer.service';

@Injectable()
export class OfferCron {
  constructor(private readonly offerService: OfferService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handler() {
    await this.offerService.resetOffers();
  }
}
