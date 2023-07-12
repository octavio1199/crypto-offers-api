import { CoinBalance } from '../../../../app/entities';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';

export const CoinBalanceFactory = setSeederFactory(CoinBalance, () => {
  const coinBalance = new CoinBalance();
  coinBalance.balance = faker.number.float({
    min: 0.001,
    max: 1000,
    precision: 0.0001,
  });
  return coinBalance;
});
