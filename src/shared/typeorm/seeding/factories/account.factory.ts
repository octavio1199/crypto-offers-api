import { setSeederFactory } from 'typeorm-extension';
import { Account } from '../../../../app/entities';
import { faker } from '@faker-js/faker';

export const AccountFactory = setSeederFactory(Account, () => {
  const account = new Account();
  account.email = faker.internet.email();
  account.accountNumber = faker.finance.accountNumber();
  return account;
});
