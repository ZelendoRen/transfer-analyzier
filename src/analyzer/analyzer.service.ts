import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { FormatedLogType, GetBlockParamsType } from '../types/types';
import { BlockchainService } from '../blockchain/blockcahin.service';
import { Errors } from '../enum/errors.enum';

@Injectable()
export class AnalyzerService {
  private readonly logger = new Logger(AnalyzerService.name);
  constructor(private readonly blockchainService: BlockchainService) {}

  async getLogs(args: GetBlockParamsType): Promise<FormatedLogType[]> {
    try {
      const logs: ethers.Log[] = await this.blockchainService.getLogs(args);

      const response: FormatedLogType[] = await Promise.all(
        logs.map(async (log: ethers.Log) => {
          const args = await this.blockchainService.parseLog(log);
          return {
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber,
            logIndex: log.index,
            from: args?.from,
            to: args?.to,
            value: args?.value.toString(),
          };
        }),
      );

      return response;
    } catch (error) {
      this.logger.error(error);
      throw Errors.RPCErrors;
    }
  }
}
