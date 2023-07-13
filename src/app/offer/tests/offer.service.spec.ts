import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { OfferService } from '../offer.service';
import { Coin, CoinBalance, Offer, Wallet } from '../../entities';

const mockOffer: Partial<Offer> = {
  id: 1,
  coinId: 1,
  quantity: 10,
  unitPrice: 100,
  totalPrice: 1000,
  sellerAccountId: 1,
};

const mockCoin: Partial<Coin> = {
  id: 1,
};

const mockWallet: Partial<Wallet> = {
  id: 1,
};

const mockCoinBalance: Partial<CoinBalance> = {
  coinId: 1,
  balance: 100,
};

describe('OfferService', () => {
  let offerService: OfferService;
  let coinRepository: Repository<Coin>;
  let walletRepository: Repository<Wallet>;
  let coinBalanceRepository: Repository<CoinBalance>;
  let offerRepository: Repository<Offer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfferService,
        {
          provide: getRepositoryToken(Coin),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockCoin),
          },
        },
        {
          provide: getRepositoryToken(Wallet),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Offer),
          useValue: {
            save: jest.fn().mockResolvedValue(mockOffer),
            find: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn().mockResolvedValue(0),
          },
        },
        {
          provide: getRepositoryToken(CoinBalance),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    offerService = module.get<OfferService>(OfferService);
    coinRepository = module.get<Repository<Coin>>(getRepositoryToken(Coin));
    walletRepository = module.get<Repository<Wallet>>(
      getRepositoryToken(Wallet),
    );
    coinBalanceRepository = module.get<Repository<CoinBalance>>(
      getRepositoryToken(CoinBalance),
    );
    offerRepository = module.get<Repository<Offer>>(getRepositoryToken(Offer));
  });

  describe('create', () => {
    const createOfferDto = {
      coinId: 1,
      quantity: 10,
      unitPrice: 100,
    };
    const walletId = 1;

    it('should create an offer and update coin balance', async () => {
      const coinBalance = new CoinBalance();
      coinBalance.coinId = 1;
      coinBalance.balance = 100;

      const wallet = new Wallet();
      wallet.id = walletId;
      wallet.coinBalances = [coinBalance];

      jest.spyOn(walletRepository, 'findOne').mockResolvedValue(wallet);
      jest.spyOn(coinBalanceRepository, 'save').mockResolvedValue(coinBalance);

      const res = await offerService.create(createOfferDto, walletId);

      expect(coinRepository.findOne).toHaveBeenCalled();
      expect(walletRepository.findOne).toHaveBeenCalled();
      expect(coinBalanceRepository.save).toHaveBeenCalled();
      expect(offerRepository.save).toHaveBeenCalled();
      expect(res.quantity).toBe(createOfferDto.quantity);
      expect(res.unitPrice).toBe(createOfferDto.unitPrice);
      expect(res.coinId).toBe(mockCoin.id);
      expect(res.sellerAccountId).toBe(wallet.id);
    });

    it('should throw an error if coin is not found', async () => {
      jest.spyOn(coinRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        offerService.create(createOfferDto, walletId),
      ).rejects.toThrowError('Coin not found');
    });

    it('should throw an error if wallet is not found', async () => {
      jest.spyOn(coinRepository, 'findOne').mockResolvedValue(new Coin());
      jest.spyOn(walletRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        offerService.create(createOfferDto, walletId),
      ).rejects.toThrowError('Wallet not found');
    });

    it('should throw an error if coin balance is insufficient', async () => {
      const coinBalance = new CoinBalance();
      coinBalance.coinId = mockCoin.id;
      coinBalance.balance = 5;

      const wallet = new Wallet();
      wallet.id = walletId;
      wallet.coinBalances = [coinBalance];

      jest.spyOn(walletRepository, 'findOne').mockResolvedValue(wallet);
      jest.spyOn(coinBalanceRepository, 'save').mockResolvedValue(coinBalance);

      await expect(
        offerService.create(createOfferDto, walletId),
      ).rejects.toThrowError('Insufficient funds');
    });

    it('should throw an error if maximum number of offers per day is reached', async () => {
      const coinBalance = new CoinBalance();
      coinBalance.coinId = mockCoin.id;
      coinBalance.balance = 100;

      const wallet = new Wallet();
      wallet.id = walletId;
      wallet.accountId = 1;
      wallet.coinBalances = [coinBalance];

      const existingOffersCount = 5;
      jest.spyOn(walletRepository, 'findOne').mockResolvedValue(wallet);
      jest.spyOn(coinBalanceRepository, 'save').mockResolvedValue(coinBalance);
      jest
        .spyOn(offerRepository, 'count')
        .mockResolvedValue(existingOffersCount);

      await expect(
        offerService.create(createOfferDto, walletId),
      ).rejects.toThrowError('Maximum number of offers per day reached');

      expect(offerRepository.count).toHaveBeenCalled();
    });
  });
});
