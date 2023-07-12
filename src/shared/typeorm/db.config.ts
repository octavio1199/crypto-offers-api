import { DataSource, DataSourceOptions } from 'typeorm';
import { Account, Coin, CoinBalance, Offer, Wallet } from '../../app/entities';

export const config: DataSourceOptions = {
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
  // factories: [],
  // seeds: [],
};

export default new DataSource(config);
