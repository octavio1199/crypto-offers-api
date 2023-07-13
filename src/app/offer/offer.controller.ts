import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from '../entities';

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  create(
    @Body() createOfferDto: CreateOfferDto,
    @Query('walletId') walletId: number,
  ): Promise<Offer> {
    return this.offerService.create(createOfferDto, walletId);
  }

  @Get()
  findAll() {
    return this.offerService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offerService.remove(+id);
  }
}
