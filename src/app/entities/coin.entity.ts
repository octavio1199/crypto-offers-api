import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CoinBalance } from './coinBalance.entity';

@Entity('coins', { schema: 'public' })
export class Coin extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'name', nullable: false })
  name: string;

  @Column('text', { name: 'code', nullable: false })
  code: string;

  @OneToMany(() => CoinBalance, (coinBalance) => coinBalance.coin)
  coinBalances: CoinBalance[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: 'now()' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: 'now()' })
  updatedAt: Date | null;
}
