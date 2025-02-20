import { OrderByEnum, OrderDirectionEnum } from '../enum/database.enum';

export type GetBlockParamsType = {
  startBlock: string;
  endBlock?: string;
  address?: string;
  topicName: string;
  filter?: {
    from?: string;
    to?: string;
  };
};
export type FormatedLogType = {
  transactionHash: string;
  uploaded?: string;
  blockNumber: number;
  logIndex: number;
  from: string;
  to: string;
  value: string;
};
export type ReturnedLogType = {
  transactionhash: string;
  executeddate: string;
  uploaded: string;
  blocknumber: number;
  logindex: number;
  from: string;
  to: string;
  value: string;
};

export type RequestLogType = {
  startBlock?: number;
  endBlock?: number;
  startDate?: string;
  endDate?: string;
  filter?: {
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
    order?: OrderDirectionEnum;
    orderBy?: OrderByEnum;
  };
};

export type BlocksInsertParamsType = {
  blockNumber: number;
  executedDate: Date | undefined;
};

export type TotalParamsResponseType = {
  firsttransactiondate: string;
  lasttransactiondate: string;
  totaltransactions: number;
  totalvalue: number;
  mintransactionvalue: number;
  maxtransactionvalue: number;
  firstblocknumber: number;
  lastblocknumber: number;
};

export type TopAccountsResponseType = {
  address: string;
  totalvalue: string;
  numberoftransactions: number;
};
