import { ethers } from 'ethers';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { BlockchainService } from '../blockchain/blockcahin.service';
import { TransactionsService } from '../repository/transactions.service';
import { BlocksService } from '../repository/blocks.service';
import { AggregatorService } from './aggregator.service';
import { Errors } from '../enum/errors.enum';

const mockedServices = {
  BlocksServiceMock: {
    provide: BlocksService,
    useValue: {
      getBlockWithoutDate: jest.fn().mockResolvedValue(123),
      setExecutionDate: jest.fn().mockResolvedValue({}),
      addBlocks: jest.fn(),
    },
  },
  TransactionsServiceMock: {
    provide: TransactionsService,
    useValue: {
      getHighestProcessedBlock: jest.fn(),
      setTransactions: jest.fn(),
      getLogs: jest.fn(),
      getTotal: jest.fn(),
      getTopAccounts: jest.fn(),
    },
  },
  BlockchainServiceMock: {
    provide: BlockchainService,
    useValue: {
      getCurrentBlockNumber: jest.fn(),
      getBlockMintedTimestamp: jest.fn(),
      getLogs: jest.fn(),
      parseLog: jest.fn(),
      contractAddress: '0xMockContractAddress',
    },
  },

  ConfigServiceMock: {
    provide: ConfigService,
    useValue: {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'BATCH_SIZE':
            return 1000;
          case 'CONTRACT_ADDRESS':
            return '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
          case 'RPC_URL':
            return 'https://rpc.com';
          default:
            return 'default';
        }
      }),
    },
  },
  LoggerMock: {
    provide: Logger,
    useValue: {
      log: jest.fn(),
      error: jest.fn(),
    },
  },
};
describe('AggregatorService', () => {
  let service: AggregatorService;
  let blocksService: BlocksService;
  let transactionsService: TransactionsService;
  let blockchainService: BlockchainService;
  let configService: ConfigService;
  let logger: Logger;

  const mockEthersLogs = [
    {
      blockNumber: 1,
      transactionIndex: 2,
      transactionHash: '0xabc',
      removed: false,
      data: '0x123',
      logIndex: 0,
      topics: ['0x123', '0x456', '0x789'],
      address: '0x123',
    },
    {
      blockNumber: 2,
      transactionIndex: 3,
      transactionHash: '0xdef',
      removed: false,
      data: '0x456',
      logIndex: 1,
      topics: ['0x123', '0x456', '0x789'],
      address: '0x123',
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AggregatorService, ...Object.values(mockedServices)],
    }).compile();

    service = module.get<AggregatorService>(AggregatorService);
    blocksService = module.get<BlocksService>(BlocksService);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    blockchainService = module.get<BlockchainService>(BlockchainService);
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<Logger>(Logger);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('blocksService should be defined', () => {
    expect(blocksService).toBeDefined();
  });

  it('transactionsService should be defined', () => {
    expect(transactionsService).toBeDefined();
  });

  it('blockchainService should be defined', () => {
    expect(blockchainService).toBeDefined();
  });

  it('configService should be defined', () => {
    expect(configService).toBeDefined();
  });

  it('logger should be defined', () => {
    expect(logger).toBeDefined();
  });

  describe('collectTimestamps', () => {
    it('should return undefiend if isProcessingTimestamps is true', async () => {
      service['isProcessingTimestamps'] = true;
      const collectingResult = await service.collectTimestamps();
      expect(collectingResult).toBeUndefined();
    });

    it('should return undefiend if no block without date', async () => {
      jest
        .spyOn(blocksService, 'getBlockWithoutDate')
        .mockResolvedValue(undefined);
      const collectingResult = await service.collectTimestamps();
      expect(collectingResult).toBeUndefined();
    });

    it('should be possible to run cillectTimestamp', async () => {
      jest.spyOn(blocksService, 'getBlockWithoutDate').mockResolvedValue(123);
      jest
        .spyOn(blockchainService, 'getBlockMintedTimestamp')
        .mockResolvedValue(1633046400);
      expect(service['isProcessingTimestamps']).toBe(false);
      await service.collectTimestamps();

      expect(blocksService.setExecutionDate).toHaveBeenCalledWith({
        blockNumber: 123,
        executedDate: new Date(1633046400000),
      });
      expect(service['isProcessingTimestamps']).toBe(false);
    });

    it('should not throw errors even if it break', async () => {
      expect(service['isProcessingTimestamps']).toBe(false);

      jest
        .spyOn(blockchainService, 'getBlockMintedTimestamp')
        .mockRejectedValue(new Error());
      await service.collectTimestamps();
      expect(service['isProcessingTimestamps']).toBe(false);
    });

    it('should log and return if no block without date', async () => {
      jest
        .spyOn(blocksService, 'getBlockWithoutDate')
        .mockResolvedValue(undefined);
      const logSpy = jest.spyOn(Logger.prototype, 'log');
      await service.collectTimestamps();
      expect(logSpy).toHaveBeenCalledWith(
        'No blocks without timestamp. Waiting for next cron iteration',
      );
    });
  });

  describe('collectData', () => {
    it('should log and return if no logs to process', async () => {
      jest
        .spyOn(transactionsService, 'getHighestProcessedBlock')
        .mockResolvedValue(100);
      jest
        .spyOn(service, 'getLogsData')
        .mockResolvedValue({ logs: [], endBlock: 200 });
      const logSpy = jest.spyOn(Logger.prototype, 'log');
      await service.collectData();
      expect(logSpy).toHaveBeenCalledWith(
        'No logs to process. Exiting function',
      );
    });

    it('should log and process logs', async () => {
      jest
        .spyOn(transactionsService, 'getHighestProcessedBlock')
        .mockResolvedValue(100);
      jest.spyOn(service, 'getLogsData').mockResolvedValue({
        logs: [
          {
            blockNumber: 101,
            logIndex: 0,
            transactionHash: '0xabc',
            from: '0x123',
            to: '0x456',
            value: '1000',
          },
        ],
        endBlock: 200,
      });
      const logSpy = jest.spyOn(Logger.prototype, 'log');
      await service.collectData();
      expect(logSpy).toHaveBeenCalledWith(
        'Starting ptocessing logs from block 100',
      );
      expect(blocksService.addBlocks).toHaveBeenCalledWith([
        { blockNumber: 101, executedDate: undefined },
      ]);
      expect(transactionsService.setTransactions).toHaveBeenCalledWith([
        {
          blockNumber: 101,
          logIndex: 0,
          transactionHash: '0xabc',
          from: '0x123',
          to: '0x456',
          value: '1000',
        },
      ]);
    });
  });

  describe('getLogsData', () => {
    it('should return formatted logs and endBlock', async () => {
      service['highestBlock'] = 100;

      jest
        .spyOn(blockchainService, 'getCurrentBlockNumber')
        .mockResolvedValue(200);
      jest.spyOn(blockchainService, 'getLogs').mockResolvedValue([
        {
          blockNumber: 101,
          index: 0,
          transactionHash: '0xabc',
        } as ethers.Log,
      ]);
      jest.spyOn(service, 'formatLogs').mockResolvedValue([
        {
          blockNumber: 101,
          logIndex: 0,
          transactionHash: '0xabc',
          from: '0x123',
          to: '0x456',
          value: '1000',
        },
      ]);
      const result = await service.getLogsData(100);
      expect(result).toEqual({
        logs: [
          {
            blockNumber: 101,
            logIndex: 0,
            transactionHash: '0xabc',
            from: '0x123',
            to: '0x456',
            value: '1000',
          },
        ],
        endBlock: 200,
      });
    });

    it('should throw error for non-RPC errors', async () => {
      jest
        .spyOn(blockchainService, 'getCurrentBlockNumber')
        .mockResolvedValue(200);
      jest
        .spyOn(blockchainService, 'getLogs')
        .mockRejectedValue(new Error('Test error'));
      await expect(service.getLogsData(100)).rejects.toThrow(Errors.GetLogs);
    });
  });

  describe('formatLogs', () => {
    it('should throw error if parsing log fails', async () => {
      jest
        .spyOn(blockchainService, 'parseLog')
        .mockRejectedValue(new Error('Test error'));
      const logs = [
        {
          blockNumber: 101,
          index: 0,
          transactionHash: '0xabc',
        } as ethers.Log,
      ];
      await expect(service.formatLogs(logs)).rejects.toThrow(
        Errors.FormatinLogError,
      );
    });
  });

  // describe('getTotal', () => {
  //   it('should return total from transactionsService', async () => {
  //     const args = {
  //       startBlock: '100',
  //       endBlock: '200',
  //       topicName: 'Transfer',
  //       address: '0x123',
  //     };
  //     jest
  //       .spyOn(transactionsService, 'getTotal')
  //       .mockResolvedValue({ total: '1000' });
  //     const result = await service.getTotal(args);
  //     expect(result).toEqual({ total: '1000' });
  //   });

  //   it('should throw error if an error occurs', async () => {
  //     const args = {
  //       startBlock: '100',
  //       endBlock: '200',
  //       topicName: 'Transfer',
  //       address: '0x123',
  //     };
  //     jest
  //       .spyOn(transactionsService, 'getTotal')
  //       .mockRejectedValue(new Error('Test error'));
  //     await expect(service.getTotal(args)).rejects.toThrow(Errors.DataBase);
  //   });
  // });

  // describe('getTopAccounts', () => {
  //   it('should return top accounts from transactionsService', async () => {
  //     const args = {
  //       startBlock: '100',
  //       endBlock: '200',
  //       topicName: 'Transfer',
  //       address: '0x123',
  //     };
  //     jest
  //       .spyOn(transactionsService, 'getTopAccounts')
  //       .mockResolvedValue([{ account: '0x123', total: '1000' }]);
  //     const result = await service.getTopAccounts(args);
  //     expect(result).toEqual([{ account: '0x123', total: '1000' }]);
  //   });

  //   it('should throw error if an error occurs', async () => {
  //     const args = {
  //       startBlock: '100',
  //       endBlock: '200',
  //       topicName: 'Transfer',
  //       address: '0x123',
  //     };
  //     jest
  //       .spyOn(transactionsService, 'getTopAccounts')
  //       .mockRejectedValue(new Error('Test error'));
  //     await expect(service.getTopAccounts(args)).rejects.toThrow(
  //       Errors.DataBase,
  //     );
  //   });
  // });
  //   });
});
