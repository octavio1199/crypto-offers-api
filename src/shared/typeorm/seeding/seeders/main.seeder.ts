import { DataSource } from 'typeorm';
import { Account, Coin, CoinBalance, Wallet } from '../../../../app/entities';
import { faker } from '@faker-js/faker';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // Your seeders here
    const accountRepository = dataSource.getRepository(Account);
    const coinRepository = dataSource.getRepository(Coin);
    const coinBalanceRepository = dataSource.getRepository(CoinBalance);
    const walletRepository = dataSource.getRepository(Wallet);

    const accountFactory = factoryManager.get(Account);
    const coinFactory = factoryManager.get(Coin);
    const coinBalanceFactory = factoryManager.get(CoinBalance);
    const walletFactory = factoryManager.get(Wallet);

    const accounts = await accountFactory.saveMany(3);
    await accountRepository.save(accounts);
    const coins = await coinFactory.saveMany(3);
    await coinRepository.save(coins);
    const wallets = await walletFactory.saveMany(3);

    const wallet = wallets[0];
    wallet.account = accounts[0];
    const coinBalance = await coinBalanceFactory.save({
      coin: coins[0],
      wallet: wallet,
    });
    await walletRepository.save(wallet);
    await coinBalanceRepository.save(coinBalance);
  }
}
