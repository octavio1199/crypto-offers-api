import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { Account, Coin, CoinBalance, Offer, Wallet } from '../../app/entities';
import {
  AccountFactory,
  CoinBalanceFactory,
  CoinFactory,
  WalletFactory,
} from './seeding/factories';
import { MainSeeder } from './seeding/seeders/main.seeder';

export const config: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  database: process.env.DATABASE_NAME || 'crypto_offers',
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'docker',
  entities: [Account, Coin, CoinBalance, Offer, Wallet],
  logger: 'file',
  synchronize: false,
  migrations: ['dist/shared/typeorm/migrations/*.js'],
  factories: [AccountFactory, CoinFactory, CoinBalanceFactory, WalletFactory],
  seeds: [MainSeeder],
};

export default new DataSource(config);
