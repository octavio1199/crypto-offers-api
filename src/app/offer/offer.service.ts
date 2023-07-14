import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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

  /**
   * Cria uma nova oferta para venda de uma moeda
   * @param createOfferDto - Objeto DTO com os dados da nova oferta
   * @param walletId - ID da carteira associada à oferta
   * @returns CreateOfferResponseDto - Objeto com o resultado da criação da oferta
   * @throws NotFoundException se a moeda ou a carteira não forem encontradas
   * @throws BadRequestException se não houver saldo suficiente na carteira
   */
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

  /**
   * Retorna a lista de ofertas do dia atual, com opção de paginação
   * @param page - Número da página (opcional)
   * @param pageSize - Tamanho da página (opcional)
   * @returns ListOffersResponseDto - Objeto com a lista de ofertas e informações de paginação
   */
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

  /**
   * Remove uma oferta existente, permitido apenas para o criador da oferta
   * @param id - ID da oferta a ser removida
   * @param accountId - ID da conta do usuário autenticado
   * @returns Objeto com o resultado da remoção da oferta
   * @throws NotFoundException se a oferta não for encontrada
   * @throws ForbiddenException se o usuário não for o criador da oferta
   * @throws InternalServerErrorException em caso de erro interno do servidor
   */
  public async remove(id: number, accountId: number) {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['seller', 'wallet'],
    });
    if (!offer) throw new NotFoundException('Offer not found');

    if (offer.sellerAccountId !== accountId) {
      throw new UnauthorizedException(
        'You are not allowed to delete this offer',
      );
    }

    await this.restoreCoinBalance(offer);

    try {
      await this.offerRepository.softDelete(id);
      return { success: true, message: 'Offer deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException({ message: error.message });
    }
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

  private async restoreCoinBalance(offer: Offer): Promise<void> {
    const coinBalance = await this.coinBalanceRepository.findOne({
      where: { coinId: offer.coinId, walletId: offer.walletId },
    });
    if (!coinBalance) throw new NotFoundException('Coin not found in wallet');

    coinBalance.balance = Number(coinBalance.balance) + Number(offer.quantity);
    await this.coinBalanceRepository.save(coinBalance);
  }

  /**
   * Rotina para resetar todas as ofertas ativas no final do dia
   * @returns Promise vazia
   */
  async resetOffers() {
    const offers = await this.offerRepository.find({
      where: {
        deletedAt: null,
      },
    });
    for (const offer of offers) {
      await this.restoreCoinBalance(offer);
      await this.offerRepository.softDelete({ id: offer.id });
    }
  }
}
