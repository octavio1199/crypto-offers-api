import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateOfferDto,
  CreateOfferResponseDto,
  ListOffersResponseDto,
  ResponseOfferDto,
} from './dto/offer.dto';
import { Coin, CoinBalance, Offer, Wallet } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
    @InjectRepository(CoinBalance)
    private readonly coinBalanceRepository: Repository<CoinBalance>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  public async create(
    createOfferDto: CreateOfferDto,
    walletId: number,
  ): Promise<CreateOfferResponseDto> {
    const coin = await this.coinRepository.findOne({
      where: { id: createOfferDto.coinId },
    });
    if (!coin) throw new NotFoundException('Coin not found');

    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
      relations: ['coinBalances', 'account'],
    });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);

    const coinBalance = wallet.coinBalances.find(
      (coinBalance) => coinBalance.coinId === coin.id,
    );
    if (!coinBalance) throw new NotFoundException('Coin not found in wallet');

    // Validate if the user has already created 5 offers today
    const existingOffersCount = await this.offerRepository.count({
      where: {
        createdAt: Between(startDate, endDate),
        sellerAccountId: wallet.accountId,
      },
    });
    if (existingOffersCount >= 5) {
      throw new BadRequestException('Maximum number of offers per day reached');
    }

    if (coinBalance.balance < createOfferDto.quantity)
      throw new BadRequestException('Insufficient funds');

    coinBalance.balance -= createOfferDto.quantity;
    await this.coinBalanceRepository.save(coinBalance);

    const offer = await this.offerRepository.save({
      quantity: createOfferDto.quantity,
      unitPrice: createOfferDto.unitPrice,
      totalPrice: createOfferDto.quantity * createOfferDto.unitPrice,
      coin: coin,
      wallet: wallet,
      seller: wallet.account,
    });

    return { success: true, data: this.mapToResponseDto(offer) };
  }

  public async findAll(
    page?: number,
    pageSize?: number,
  ): Promise<ListOffersResponseDto> {
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);

    const query = await this.offerRepository
      .createQueryBuilder('offer')
      .where({
        createdAt: Between(startDate, endDate),
      })
      .orderBy('offer.createdAt', 'DESC');

    const totalItems = await query.getCount();
    let totalPages = 1;
    let currentPage = 1;

    if (page && pageSize) {
      if (page < 1)
        throw new BadRequestException('Page must be greater than 0');
      if (pageSize < 1)
        throw new BadRequestException('Page size must be greater than 0');

      const skip = (page - 1) * pageSize;
      query.skip(skip).take(pageSize);

      totalPages = Math.ceil(totalItems / pageSize);
      currentPage = page;
    }

    const offers = await query.getMany();

    return {
      success: true,
      data: offers.map(this.mapToResponseDto),
      totalItems,
      totalPages,
      currentPage,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} offer`;
  }

  private mapToResponseDto(offer: Offer): ResponseOfferDto {
    return {
      id: offer.id,
      quantity: offer.quantity,
      unitPrice: offer.unitPrice,
      totalPrice: offer.totalPrice,
      coinId: offer.coinId,
      sellerAccountId: offer.sellerAccountId,
    };
  }
}
