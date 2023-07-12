import { setSeederFactory } from 'typeorm-extension';
import { Wallet } from '../../../../app/entities';

export const WalletFactory = setSeederFactory(Wallet, () => {
  return new Wallet();
});
