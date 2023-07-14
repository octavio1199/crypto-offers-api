import { DataSource } from 'typeorm';
import { Account, Coin, CoinBalance, Wallet } from '../../../../app/entities';
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

    for (let i = 0; i < wallets.length; i++) {
      const wallet = wallets[i];
      wallet.account = accounts[i];

      const addedCoins: Coin[] = [];
      for (const coin of coins) {
        if (!addedCoins.some((addedCoin) => addedCoin.code === coin.code)) {
          const coinBalance = await coinBalanceFactory.save({
            coin: coin,
            wallet: wallet,
          });
          await coinBalanceRepository.save(coinBalance);
          addedCoins.push(coin);
        }
      }
      await walletRepository.save(wallet);
    }
  }
}
