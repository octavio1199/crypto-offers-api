import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
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
  ): Promise<Offer> {
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

    return await this.offerRepository.save({
      quantity: createOfferDto.quantity,
      unitPrice: createOfferDto.unitPrice,
      totalPrice: createOfferDto.quantity * createOfferDto.unitPrice,
      coin: coin,
      wallet: wallet,
      seller: wallet.account,
    });
  }

  findAll() {
    return `This action returns all offer`;
  }

  remove(id: number) {
    return `This action removes a #${id} offer`;
  }
}
