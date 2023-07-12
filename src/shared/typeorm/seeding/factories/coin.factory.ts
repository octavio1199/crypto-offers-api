import { Coin } from '../../../../app/entities';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';

export const CoinFactory = setSeederFactory(Coin, () => {
  const coin = new Coin();
  coin.name = faker.finance.currencyName();
  coin.code = faker.finance.currencyCode();
  return coin;
});
