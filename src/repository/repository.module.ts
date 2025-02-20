import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionsEntity } from '../database/entity/transactions.entity';
import { BlocksEntity } from '../database/entity/blocks.entity';
import { DatabaseModule } from '../database/database.module';
import { TransactionsService } from './transactions.service';
import { BlocksService } from './blocks.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    TypeOrmModule.forFeature([BlocksEntity, TransactionsEntity]),
  ],
  controllers: [],
  providers: [TransactionsService, BlocksService],
  exports: [TransactionsService, BlocksService],
})
export class RepositoryModule {}
