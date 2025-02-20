import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsEntity } from '../database/entity/transactions.entity';
import { ConfigService } from '@nestjs/config';
import { InsertResult, Repository } from 'typeorm';

import { ethers } from 'ethers';
import { FormatedLogType } from '../types/types';
import { Errors } from '../enum/errors.enum';
import { OrderDirectionEnum } from '../enum/database.enum';

const logs: FormatedLogType[] = [
  {
    transactionHash:
      '0x000012f7cfaa13c8b46dabce2759b4a4f55624cabb4cecb1cdc002df7c38c11f',
    logIndex: 1,
    blockNumber: 8627093,
    from: '0xBF14DB80D9275FB721383a77C00Ae180fc40ae98',
    to: ethers.ZeroAddress,
    value: '1020000',
  },
  {
    transactionHash:
      '0x000019f04bf374d98fadb514316caaa3ba1fba362a72d4f3cb4e94defc172ffa',
    logIndex: 110,
    blockNumber: 10619260,
    from: '0x3aaaF12f911aB6A6f43808504C95C6635F1387C7',
    to: '0xAEf735B1E7EcfAf8209ea46610585817Dc0a2E16',
    value: '8888000000',
  },
];

const topAccountsMock = [
  {
    address: '0x3aaaF12f911aB6A6f43808504C95C6635F1387C7',
    totalvalue: '8888000000',
    numberoftransactions: 1,
  },
  {
    address: '0xBF14DB80D9275FB721383a77C00Ae180fc40ae98',
    totalvalue: '1020000',
    numberoftransactions: 1,
  },
];
const mockDataForLogs = {
  startBlock: 100000,
  endBlock: 100010,
  startDate: 1620000000,
  endDate: 1620000010,
  from: '0x3aaaF12f911aB6A6f43808504C95C6635F1387C7',
  to: '0xAEf735B1E7EcfAf8209ea46610585817Dc0a2E16',
  limit: 10,
  offset: 0,
  order: OrderDirectionEnum.ASC,
};

const mockTotalResult = {
  totalvalue: 1020000,
  totaltransactions: 1,
  mintransactionvalue: 1020000,
  maxtransactionvalue: 1020000,
  firstblocknumber: 8627093,
  lastblocknumber: 8627093,
  firsttransactiondate: '2021-05-03T00:00:00.000Z',
  lasttransactiondate: '2021-05-03T00:00:00.000Z',
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionsRepository: Repository<TransactionsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        ConfigService,
        {
          provide: getRepositoryToken(TransactionsEntity),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get<Repository<TransactionsEntity>>(
      getRepositoryToken(TransactionsEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('transactionsRepository should be defined', () => {
    expect(transactionsRepository).toBeDefined();
  });

  describe('setTransactions', () => {
    it('should return false if no logs are provided', async () => {
      const result = await service.setTransactions([]);
      expect(result).toBe(false);
    });

    it('should insert logs', async () => {
      const mockInsertResult: InsertResult = {
        identifiers: [{ id: 1 }, { id: 2 }],
        generatedMaps: [],
        raw: [],
      };

      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(mockInsertResult),
      };

      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      const result = await service.setTransactions(logs);
      expect(result).toBe(true);
    });

    it('should throw an error if an error occurs', async () => {
      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        execute: jest.fn().mockRejectedValue(new Error()),
      };
      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      await expect(service.setTransactions(logs)).rejects.toThrow(
        Errors.DataBase,
      );
    });
  });

  describe('getHighestProcessedBlock', () => {
    it('should return the highest block number', async () => {
      const mockResult = { maxBlockNumber: 1000 };
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockResult),
      };

      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getHighestProcessedBlock();
      expect(result).toBe(mockResult.maxBlockNumber);
    });

    it('should return the start block if no block is found', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(undefined),
      };

      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getHighestProcessedBlock();
      expect(result).toBe(0);
    });

    it('should throw an error if an error occurs', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockRejectedValue(new Error()),
      };
      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      await expect(service.getHighestProcessedBlock()).rejects.toThrow(
        Errors.DataBase,
      );
    });
  });

  describe('getLogs', () => {
    it('should return logs by date', async () => {
      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(logs),
        orderBy: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
      };
      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getLogs({
        startDate: new Date(mockDataForLogs.startDate).toISOString(),
      });
      expect(result).toEqual(logs);
    });

    it('should return logs by block', async () => {
      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(logs),
        orderBy: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
      };
      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      const result = await service.getLogs({
        startDate: new Date(mockDataForLogs.startDate).toISOString(),
      });
      expect(result).toEqual(logs);
    });

    it('should throw an error if an error occurs', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockRejectedValue(new Error()),
      };
      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      await expect(
        service.getLogs({
          filter: {
            from: '0x3aaaF12f911aB6A6f43808504C95C6635F1387C7',
            to: '0xAEf735B1E7EcfAf8209ea46610585817Dc0a2E16',
          },
        }),
      ).rejects.toThrow(Errors.DataBase);
    });
  });

  describe('getTotal', () => {
    it('should return total params without params', async () => {
      const mockResult = {
        firsttransactiondate: '2021-05-03T00:00:00.000Z',
        lasttransactiondate: '2021-05-03T00:00:00.000Z',
        totaltransactions: 1,
        totalvalue: 1020000,
        mintransactionvalue: 1020000,
        maxtransactionvalue: 1020000,
        firstblocknumber: 8627093,
        lastblocknumber: 8627093,
      };
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockTotalResult),
      };

      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getTotal({});
      expect(result).toEqual(mockTotalResult);
    });

    it('should return total params with date range', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockTotalResult),
      };

      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getTotal({
        startDate: new Date(mockDataForLogs.startDate).toISOString(),
        endDate: new Date(mockDataForLogs.endDate).toISOString(),
      });
      expect(result).toEqual(mockTotalResult);
    });

    it('should return total params with block range', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockTotalResult),
      };

      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getTotal({
        startBlock: mockDataForLogs.startBlock,
        endBlock: mockDataForLogs.endBlock,
      });
      expect(result).toEqual(mockTotalResult);
    });

    it('should throw an error if an error occurs', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockRejectedValue(new Error()),
      };
      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      await expect(service.getTotal({})).rejects.toThrow(Errors.DataBase);
    });
  });

  describe('getTopAccounts', () => {
    it('should return top accounts without params', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(topAccountsMock),
      };

      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getTopAccounts({});
      expect(result).toEqual(topAccountsMock);
    });

    it('should return top accounts with date range', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(topAccountsMock),
      };

      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getTopAccounts({
        startDate: new Date(mockDataForLogs.startDate).toISOString(),
        endDate: new Date(mockDataForLogs.endDate).toISOString(),
      });
      expect(result).toEqual(topAccountsMock);
    });

    it('should return top accounts with block range', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(topAccountsMock),
      };

      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getTopAccounts({
        startBlock: mockDataForLogs.startBlock,
        endBlock: mockDataForLogs.endBlock,
      });
      expect(result).toEqual(topAccountsMock);
    });

    it('should throw an error if an error occurs', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockRejectedValue(new Error()),
      };

      (transactionsRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      await expect(service.getTopAccounts({})).rejects.toThrow(Errors.DataBase);
    });
  });
});
