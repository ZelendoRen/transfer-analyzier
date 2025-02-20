import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { BlocksEntity } from './blocks.entity';

@Entity()
export class TransactionsEntity {
  @PrimaryColumn({ type: 'varchar', length: 66 })
  transactionHash: string;

  @PrimaryColumn({ type: 'integer' })
  logIndex: number;

  @Column({ type: 'bigint', nullable: true })
  blockNumber: number;

  @Index()
  @Column({ type: 'varchar', length: 42 })
  from: string;

  @Index()
  @Column({ type: 'varchar', length: 42 })
  to: string;

  @Index()
  @Column({ type: 'numeric' })
  value: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploaded: Date;

  @ManyToOne(() => BlocksEntity, (blocks) => blocks.transactions)
  @JoinColumn({ name: 'blockNumber' })
  blocks: BlocksEntity;
}
