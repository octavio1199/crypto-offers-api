import { Wallet } from './wallet.entity';
import { Coin } from './coin.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('coin_balances', { schema: 'public' })
export class CoinBalance extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('numeric', { name: 'balance', nullable: false })
  balance: number;

  @Column('integer', { name: 'coin_id', nullable: true })
  coinId: number;

  @ManyToOne(() => Coin, (coin) => coin.coinBalances)
  @JoinColumn({ name: 'coin_id', referencedColumnName: 'id' })
  coin: Coin;

  @Column('integer', { name: 'wallet_id', nullable: true })
  walletId: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.coinBalances)
  @JoinColumn({ name: 'wallet_id', referencedColumnName: 'id' })
  wallet: Wallet;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'now()' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: 'now()' })
  updatedAt: Date | null;
}
