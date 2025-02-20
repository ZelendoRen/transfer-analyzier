import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { OrderByEnum, OrderDirectionEnum } from '../../enum/database.enum';

export class TopAccountsRequestDTO {
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

  @ApiProperty({
    description: 'Limit of the results',
    type: 'number',
    required: false,
    maximum: 10000,
    minimum: 0,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value || '10'))
  @IsNumber()
  @Max(10000, { message: 'Max value is 10000' })
  @Min(0, { message: 'Min value is 0' })
  limit: number = 10;

  @ApiProperty({
    description: 'Offset of the results',
    type: 'number',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value || '0'))
  @IsNumber()
  @Min(0, { message: 'Min value is 0' })
  offset: number = 0;

  @ApiProperty({
    description: 'Order direction of the results',
    type: 'string',
    enum: OrderDirectionEnum,
    default: OrderDirectionEnum.DESC,
    required: false,
  })
  @IsOptional()
  @IsString()
  order: OrderDirectionEnum = OrderDirectionEnum.DESC;

  @ApiProperty({
    description: 'Order by which the results are ordered',
    type: 'string',
    enum: OrderByEnum,
    default: OrderByEnum.value,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  orderBy: OrderByEnum = OrderByEnum.value;
}

export class TopAccountsResponseDTO {
  @ApiProperty({
    description: 'Address of the account',
    type: 'string',
  })
  @IsEthereumAddress()
  address: string;

  @ApiProperty({
    description: 'Total value of the account',
    type: 'string',
  })
  @IsString()
  totalValue: string;

  @ApiProperty({
    description: 'Total number of transactions',
    type: 'number',
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  totalTransactions: number;
}
