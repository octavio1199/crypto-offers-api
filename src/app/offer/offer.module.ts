import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Coin, CoinBalance, Offer, Wallet } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Coin, CoinBalance, Offer, Wallet]),
  ],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
