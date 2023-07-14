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
import {
  CreateOfferDto,
  CreateOfferResponseDto,
  ListOffersResponseDto,
  QueryOffersDto,
  RemoveOfferResponseDto,
} from './dto/offer.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @ApiBody({ type: CreateOfferDto })
  @ApiOkResponse({ status: 201, type: CreateOfferResponseDto })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiBadRequestResponse({ description: 'Insufficient funds' })
  create(
    @Body() createOfferDto: CreateOfferDto,
    @Query('walletId') walletId: number,
  ): Promise<CreateOfferResponseDto> {
    return this.offerService.create(createOfferDto, walletId);
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiOkResponse({ type: ListOffersResponseDto })
  findAll(@Query() query?: QueryOffersDto): Promise<ListOffersResponseDto> {
    return this.offerService.findAll(query.page, query.pageSize);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'accountId', type: Number })
  @ApiOkResponse({ status: 200, type: RemoveOfferResponseDto })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  remove(
    @Param('id') id: string,
    @Query('accountId') accountId: string,
  ): Promise<RemoveOfferResponseDto> {
    return this.offerService.remove(+id, +accountId);
  }
}
