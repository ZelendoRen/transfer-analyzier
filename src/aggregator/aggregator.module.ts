import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RepositoryModule } from '../repository/repository.module';
import { BlockchainModule } from 'src/blockchain/blockcahin.module';
import { AggregatorContorller } from './aggregator.controller';
import { AggregatorService } from './aggregator.service';

@Module({
  imports: [ConfigModule, RepositoryModule, BlockchainModule],
  controllers: [AggregatorContorller],
  providers: [AggregatorService],
  exports: [AggregatorService],
})
export class AggregatorModule {}
