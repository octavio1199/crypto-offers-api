import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';

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
