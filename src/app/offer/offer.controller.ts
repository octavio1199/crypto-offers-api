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
import { CreateOfferDto, QueryOffersDto } from './dto/offer.dto';

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  create(
    @Body() createOfferDto: CreateOfferDto,
    @Query('walletId') walletId: number,
  ) {
    return this.offerService.create(createOfferDto, walletId);
  }

  @Get()
  findAll(@Query() query?: QueryOffersDto) {
    return this.offerService.findAll(query.page, query.pageSize);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('accountId') accountId: string) {
    return this.offerService.remove(+id, +accountId);
  }
}
