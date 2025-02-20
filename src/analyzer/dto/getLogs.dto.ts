import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TopicNames } from '../../enum/blockchain.enum';

import { Transform } from 'class-transformer';

export class GetLogsRequestDTO {
  @ApiProperty({
    description: 'Block number from which the logs are starting',
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  startBlock: number;

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
  @IsString()
  @IsEthereumAddress()
  from: string;

  @ApiProperty({
    description: 'End date of the logs. Used timestamp in milliseconds',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEthereumAddress()
  to: string;

  @ApiProperty({
    description: 'Topic name of the logs',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  topicName: TopicNames = TopicNames.Transfer;
}

export class GetLogsQueryResponseDTO {
  @ApiProperty({
    description: 'Transaction hash',
    type: 'string',
  })
  @IsString()
  transactionHash: string;

  @ApiProperty({
    description: 'Uploaded timestamp',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  uploaded: string | undefined;

  @ApiProperty({
    description: 'Block number',
    type: 'number',
  })
  @IsNumber()
  blockNumber: number;

  @ApiProperty({
    description: 'Log index',
    type: 'number',
  })
  @IsNumber()
  logIndex: number;

  @ApiProperty({
    description: 'From address',
    type: 'string',
  })
  @IsString()
  @IsEthereumAddress()
  from: string;
  @ApiProperty({
    description: 'To address',
    type: 'string',
  })
  @IsString()
  @IsEthereumAddress()
  to: string;

  @ApiProperty({
    description: 'Value of the transaction',
    type: 'string',
  })
  @IsString()
  value: string;
}
