import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';

import { TransactionsEntity } from './transactions.entity';

@Entity()
export class BlocksEntity {
  @PrimaryColumn({ type: 'bigint' })
  blockNumber: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploaded: Date;

  @Column({ type: 'timestamp', nullable: true })
  executedDate: Date;

  @OneToMany(() => TransactionsEntity, (transactions) => transactions.blocks)
  transactions: TransactionsEntity[];
}
