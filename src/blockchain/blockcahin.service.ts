import { ethers } from 'ethers';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GetBlockParamsType } from 'src/types/types';
import * as abi from '../../abi/ERC20.abi.json';
import { Errors } from 'src/enum/errors.enum';

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  public readonly contractAddress: string;
  private contract: ethers.Contract;

  constructor(configService: ConfigService) {
    this.provider = new ethers.JsonRpcProvider(
      configService.get<string>('RPC_URL') as string,
    );
    this.contractAddress = configService.get<string>(
      'CONTRACT_ADDRESS',
    ) as string;
    this.contract = new ethers.Contract(
      this.contractAddress,
      abi,
      this.provider,
    );
  }

  async getCurrentBlockNumber(): Promise<number> {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      throw new Error(Errors.BlockChain);
    }
  }

  async parseLog(log: ethers.Log): Promise<ethers.Result | undefined> {
    try {
      return this.contract.interface.parseLog(log)?.args;
    } catch (error) {
      throw new Error(Errors.BlockChain);
    }
  }

  async getLogs(args: GetBlockParamsType): Promise<ethers.Log[]> {
    try {
      const logs = await this.provider.getLogs({
        address: this.contractAddress,
        fromBlock: parseInt(args.startBlock),
        toBlock: args.endBlock
          ? parseInt(args.endBlock)
          : await this.provider.getBlockNumber(),
        topics: await this.getTopic(args.topicName, [
          args.filter?.from,
          args.filter?.to,
        ]),
      });
      return logs;
    } catch (error) {
      throw new Error(Errors.BlockChain);
    }
  }

  async getBlockMintedTimestamp(blockNumber: number): Promise<number> {
    try {
      const block = await this.provider.getBlock(Number(blockNumber));
      return block?.timestamp as number;
    } catch (error) {
      console.error(error);
      throw new Error(Errors.BlockChain);
    }
  }

  async getTopic(topicName: string, filters: any = []) {
    try {
      const topic = this.contract.interface.getEvent(topicName)?.topicHash;
      if (!topic) {
        throw new Error(`Topic ${topicName} not found`);
      }
      const topicFilter = filters
        .map((filter: any) => {
          if (filter) {
            return ethers.zeroPadValue(filter, 32);
          }
        })
        .filter((filter: any) => filter !== undefined);
      return [topic, ...topicFilter];
    } catch (error) {
      throw new Error(Errors.BlockChain);
    }
  }
}
