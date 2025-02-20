import { Repository } from 'typeorm';
import { BlocksService } from './blocks.service';
import { BlocksEntity } from '../database/entity/blocks.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Errors } from '../enum/errors.enum';

describe('BlocksService', () => {
  let service: BlocksService;
  let blocksRepository: Repository<BlocksEntity>;

  const mockGetBlocksParams = [
    {
      blockNumber: 1,
      executedDate: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlocksService,
        ConfigService,
        {
          provide: getRepositoryToken(BlocksEntity),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BlocksService>(BlocksService);
    blocksRepository = module.get<Repository<BlocksEntity>>(
      getRepositoryToken(BlocksEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('transactionsRepository should be defined', () => {
    expect(blocksRepository).toBeDefined();
  });

  describe('addBlocks', () => {
    it('should add blocks', async () => {
      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };

      (blocksRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      await service.addBlocks(mockGetBlocksParams);
      expect(mockQueryBuilder.insert).toHaveBeenCalledTimes(1);
    });

    it('should add blocks without executed date', async () => {
      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };

      (blocksRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      await service.addBlocks([
        {
          blockNumber: mockGetBlocksParams[0].blockNumber,
          executedDate: undefined,
        },
      ]);
      expect(mockQueryBuilder.insert).toHaveBeenCalledTimes(1);
    });

    it('should throw error when add blocks failed', async () => {
      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        execute: jest.fn().mockRejectedValue(new Error()),
      };

      (blocksRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      await expect(service.addBlocks(mockGetBlocksParams)).rejects.toThrow(
        Errors.DataBase,
      );
    });
  });

  describe('setExecutionDate', () => {
    it('should set execution date', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };

      (blocksRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      await service.setExecutionDate(mockGetBlocksParams[0]);
      expect(mockQueryBuilder.update).toHaveBeenCalledTimes(1);
    });

    it('should be possible to set execution date without date', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };

      (blocksRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      await service.setExecutionDate({
        blockNumber: mockGetBlocksParams[0].blockNumber,
        executedDate: undefined,
      });
      expect(mockQueryBuilder.update).toHaveBeenCalledTimes(1);
    });

    it('should throw error when set execution date failed', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockRejectedValue(new Error()),
      };

      (blocksRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      await expect(
        service.setExecutionDate(mockGetBlocksParams[0]),
      ).rejects.toThrow(Errors.DataBase);
    });
  });

  describe('getBlockWithoutDate', () => {
    it('should get block without date', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ blockNumber: 1 }),
      };

      (blocksRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      await service.getBlockWithoutDate();
      expect(mockQueryBuilder.select).toHaveBeenCalledTimes(1);
    });

    it('should throw error when get block without date failed', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockRejectedValue(new Error()),
      };

      (blocksRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      await expect(service.getBlockWithoutDate()).rejects.toThrow(
        Errors.DataBase,
      );
    });
  });
});
