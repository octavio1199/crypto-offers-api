import { Account } from './account.entity';
import { Coin } from './coin.entity';
import { Wallet } from './wallet.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('offers', { schema: 'public' })
export class Offer {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('numeric', { name: 'quantity', nullable: false })
  quantity: number;

  @Column('numeric', { name: 'unit_price', nullable: false })
  unitPrice: number;

  @Column('numeric', { name: 'total_price', nullable: false })
  totalPrice: number;

  @Column('integer', { name: 'coin_id', nullable: true })
  coinId: number;

  @ManyToOne(() => Coin, (coin) => coin.coinBalances)
  @JoinColumn({ name: 'coin_id', referencedColumnName: 'id' })
  coin: Coin;

  @Column('integer', { name: 'wallet_id', nullable: true })
  walletId: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.offers)
  @JoinColumn({ name: 'wallet_id', referencedColumnName: 'id' })
  wallet: Wallet;

  @Column('integer', { name: 'seller_account_id', nullable: true })
  sellerAccountId: number;

  @ManyToOne(() => Account, (account) => account.offers)
  @JoinColumn({ name: 'seller_account_id', referencedColumnName: 'id' })
  seller: Account;

  @Column('integer', { name: 'buyer_account_id', nullable: true })
  buyerAccountId: number;

  @ManyToOne(() => Account, (account) => account.offers)
  @JoinColumn({ name: 'buyer_account_id', referencedColumnName: 'id' })
  buyer: Account;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'now()' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: 'now()' })
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', default: null })
  deletedAt: Date | null;
}
