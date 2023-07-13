import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOfferDto {
  @ApiProperty()
  coinId: number;

  @IsNumber()
  @IsPositive()
  @Min(0.001)
  @ApiProperty()
  unitPrice: number;

  @IsNumber()
  @IsPositive()
  @Min(0.001)
  @ApiProperty()
  quantity: number;
}

export class QueryOffersDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty()
  page?: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty()
  pageSize?: number;
}

export class ResponseOfferDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  coinId: number;

  sellerAccountId: number;
}

export class CreateOfferResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: ResponseOfferDto;
}

export class ListOffersResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: ResponseOfferDto[];

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  currentPage: number;
}
