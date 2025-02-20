import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TotalRequestDTO {
  @ApiProperty({
    description: 'Block number from which the logs are starting',
    type: 'number',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  startBlock: number | undefined;

  @ApiProperty({
    description: 'Block number from which the logs are ending',
    type: 'number',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  endBlock: number | undefined;

  @ApiProperty({
    description: 'Start date of the logs. Used timestamp in milliseconds',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    !isNaN(value) ? new Date(Number(value)).toISOString() : undefined,
  )
  @IsDateString()
  startDate: string | undefined;

  @ApiProperty({
    description: 'End date of the logs. Used timestamp in milliseconds',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(Number(value)).toISOString() || undefined)
  @IsDateString()
  endDate: string | undefined;
}

export class TotalResponseDTO {
  @ApiProperty({
    description: 'First transaction hash',
    type: 'string',
  })
  @IsString()
  firstTransaction: string;

  @ApiProperty({
    description: 'Last transaction hash',
    type: 'string',
  })
  @IsString()
  lastTransaction: string;

  @ApiProperty({
    description: 'First block number',
    type: 'number',
  })
  @IsNumber()
  firstBlock: number;

  @ApiProperty({
    description: 'Last block number',
    type: 'number',
  })
  @IsNumber()
  lastBlock: number;

  @ApiProperty({
    description: 'Total number of transactions',
    type: 'number',
  })
  @IsNumber()
  totalTransactionsCount: number;

  @ApiProperty({
    description: 'Total value of transactions',
    type: 'number',
  })
  @IsNumber()
  totalValue: number;

  @ApiProperty({
    description: 'Minimum transaction value',
    type: 'number',
  })
  @IsNumber()
  minTransactionValue: number;

  @ApiProperty({
    description: 'Maximum transaction value',
    type: 'number',
  })
  @IsNumber()
  maxTransactionValue: number;
}
