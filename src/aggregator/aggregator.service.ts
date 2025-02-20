import { ethers } from 'ethers';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

import { TransactionsService } from '../repository/transactions.service';
import { BlockchainService } from '../blockchain/blockcahin.service';
import { BlocksService } from '../repository/blocks.service';
import { TopicNames } from '../enum/blockchain.enum';
import { Errors } from '../enum/errors.enum';
import {
  BlocksInsertParamsType,
  FormatedLogType,
  GetBlockParamsType,
  RequestLogType,
  ReturnedLogType,
  TopAccountsResponseType,
  TotalParamsResponseType,
} from '../types/types';

const cronPatterns = {
  collectTimestamps: '*/1 * * * * *',
  collectData: '*/5 * * * * *',
};

@Injectable()
export class AggregatorService {
  private highestBlock: number;
  private batchSize: number;
  private isProcessingTransactions: boolean = false;
  private isProcessingTimestamps: boolean = false;
  private readonly logger = new Logger(AggregatorService.name);

  constructor(
    private readonly blocksService: BlocksService,
    private readonly transactionsService: TransactionsService,
    private readonly blockchainService: BlockchainService,
    private readonly configService: ConfigService,
  ) {
    this.batchSize =
      Number(this.configService.get<number>('BATCH_SIZE')) || 2000;
  }

  @Cron(cronPatterns.collectTimestamps)
  async collectTimestamps(): Promise<void> {
    if (this.isProcessingTimestamps) {
      return;
    }
    this.isProcessingTimestamps = true;
    try {
      const blockNumber: number | undefined =
        await this.blocksService.getBlockWithoutDate();
      if (!blockNumber) {
        this.logger.log(
          'No blocks without timestamp. Waiting for next cron iteration',
        );
        return;
      }
      this.logger.log(`Getting execution date for block ${blockNumber}`);
      const mintedTime: number =
        await this.blockchainService.getBlockMintedTimestamp(blockNumber);
      const executedDate: Date = new Date(mintedTime * 1000);
      const dateForLogs: string = `${executedDate.getDay()} ${executedDate.getMonth()} ${executedDate.getFullYear()}`;
      this.logger.log(
        `Execution date for block ${blockNumber} is ${dateForLogs}`,
      );
      const blockData: BlocksInsertParamsType = {
        blockNumber: blockNumber,
        executedDate: executedDate,
      };
      await this.blocksService.setExecutionDate(blockData);
      this.logger.log(
        `Inserted execution date for block ${blockNumber} is successful`,
      );
    } catch (error) {
      this.logger.error(error);
    } finally {
      this.logger.log(
        'Finished processing timestamps. Wating for next cron iteration',
      );
      this.isProcessingTimestamps = false;
    }
  }

  @Cron(cronPatterns.collectData)
  async collectData(): Promise<void> {
    if (this.isProcessingTransactions) {
      return;
    }
    this.isProcessingTransactions = true;

    if (!this.highestBlock) {
      this.highestBlock =
        await this.transactionsService.getHighestProcessedBlock();
    }
    this.logger.log(`Starting ptocessing logs from block ${this.highestBlock}`);
    try {
      const formatLogs: { logs: FormatedLogType[]; endBlock: number } =
        await this.getLogsData(this.batchSize);
      if (formatLogs.logs.length === 0) {
        this.logger.log('No logs to process. Exiting function');
        this.highestBlock = formatLogs.endBlock;
        return;
      }
      const blocksData: BlocksInsertParamsType[] = formatLogs.logs.map(
        (log) => ({
          blockNumber: log.blockNumber,
          executedDate: undefined,
        }),
      );
      await this.blocksService.addBlocks(blocksData);
      await this.transactionsService.setTransactions(formatLogs.logs);
      this.highestBlock = formatLogs.endBlock;
    } catch (error) {
      this.logger.error(error);
    } finally {
      this.logger.log('Finished processing. Wating for next cron iteration');
      this.isProcessingTransactions = false;
    }
  }

  async getLogsData(
    iterationBatchSize: number,
  ): Promise<{ logs: FormatedLogType[]; endBlock: number }> {
    const lastBlock: number =
      await this.blockchainService.getCurrentBlockNumber();
    const batchSize: number = iterationBatchSize || this.batchSize;
    const endBlock: number =
      this.highestBlock + batchSize > lastBlock
        ? lastBlock
        : this.highestBlock + batchSize;
    try {
      this.logger.log(`Getting logs from ${this.highestBlock} to ${endBlock}`);
      const args: GetBlockParamsType = {
        startBlock: this.highestBlock.toString(),
        endBlock: endBlock.toString(),
        topicName: TopicNames.Transfer,
        address: this.blockchainService.contractAddress,
      };
      const logs: ethers.Log[] = await this.blockchainService.getLogs(args);
      if (logs.length === 0) {
        return {
          logs: [],
          endBlock,
        };
      }
      this.logger.log(
        `Got ${logs.length} logs. Starting formatting and inserting`,
      );
      const formattedLogs: FormatedLogType[] = await this.formatLogs(logs);
      return {
        logs: formattedLogs,
        endBlock,
      };
    } catch (error) {
      this.logger.error(error);
      const errorCode = error.error?.code;
      switch (errorCode) {
        case -32000:
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return await this.getLogsData(batchSize / 2);
        default:
          this.logger.error(error);
          throw new Error(Errors.GetLogs);
      }
    }
  }

  async formatLogs(logs: ethers.Log[]): Promise<FormatedLogType[]> {
    try {
      const logsWithTimestamps: FormatedLogType[] = [];
      for (const log of logs) {
        try {
          const args: ethers.Result | undefined =
            await this.blockchainService.parseLog(log);
          logsWithTimestamps.push({
            blockNumber: log.blockNumber,
            logIndex: log.index,
            transactionHash: log.transactionHash,
            from: args?.from.toString(),
            to: args?.to.toString(),
            value: args?.value.toString(),
          });
        } catch (error) {
          throw new Error(Errors.FormatinLogError);
        }
      }
      return logsWithTimestamps;
    } catch (error) {
      this.logger.error(error);
      throw new Error(Errors.FormatinLogError);
    }
  }
  async getLogs(args: RequestLogType): Promise<ReturnedLogType[]> {
    this.logger.log(args);
    return await this.transactionsService.getLogs(args);
  }

  async getTotal(
    args: RequestLogType,
  ): Promise<TotalParamsResponseType | undefined> {
    try {
      return await this.transactionsService.getTotal(args);
    } catch (error) {
      this.logger.error(error);
      throw new Error(Errors.DataBase);
    }
  }

  async getTopAccounts(
    args: RequestLogType,
  ): Promise<TopAccountsResponseType[] | undefined> {
    try {
      return await this.transactionsService.getTopAccounts(args);
    } catch (error) {
      this.logger.log(error);
      throw new Error(Errors.DataBase);
    }
  }
}
