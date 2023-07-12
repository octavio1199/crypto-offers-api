import { Account } from './account.entity';
import { CoinBalance } from './coinBalance.entity';
import { Offer } from './offer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wallets', { schema: 'public' })
export class Wallet {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'account_id', nullable: false })
  accountId: number;

  @ManyToOne(() => Account, (account) => account.wallets)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account;

  @OneToMany(() => Offer, (offer) => offer.wallet)
  offers: Offer[];

  @OneToMany(() => CoinBalance, (coinBalance) => coinBalance.wallet)
  coinBalances: CoinBalance[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'now()' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: 'now()' })
  updatedAt: Date | null;
}
