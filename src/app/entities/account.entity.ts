import { Wallet } from './wallet.entity';
import { Offer } from './offer.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('accounts', { schema: 'public' })
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'email', nullable: false })
  email: string;

  @Column('text', { name: 'account_number', nullable: false })
  accountNumber: string;

  @OneToMany(() => Wallet, (wallet) => wallet.account)
  wallets: Wallet[];

  @OneToMany(() => Offer, (offer) => offer.seller)
  offers: Offer[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'now()' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: 'now()' })
  updatedAt: Date | null;
}
