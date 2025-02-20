import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

import { BlockchainService } from './blockcahin.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}
