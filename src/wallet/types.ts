export type SmallToken = SmallTokenInfo | Token | TokenWithBalance;

export type SmallTokenInfo = {
  address: string;
  decimals: number;
  symbol: string;
};

export type Token = {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  priceUSD: string;
  logo: string;
  isFavorite: boolean;
  isVerified: boolean;

  // @deprecated use getAssetColor() store function instead
  color?: string;
};

export type TokenWithBalance = Token & {
  balance: string;
};

export enum TransactionTypes {
  swapERC20 = 'swapERC20',
  transferERC20 = 'transferERC20',
  approvalERC20 = 'approvalERC20',
  execution = 'execution',
  unknown = 'unknown'
}

export type TransactionStatus = 'confirmed' | 'failed';

export type SmallTokenInfoWithIcon = SmallTokenInfo & {
  iconURL: string;
};

export type Erc20Change = SmallTokenInfoWithIcon & {
  change: string;
  price: string;
  direction: 'out' | 'in' | 'self';
};

export type FeeData = {
  feeInWEI: string;
  ethPrice: string;
};

export type TransactionCommonData = {
  blockNumber: string;
  hash: string;
  uniqHash: string;
  timestamp: number;
  nonce: string;
  fee: FeeData;
  status: TransactionStatus;
  type: TransactionTypes;
};

export type TransactionSwapERC20 = TransactionCommonData & {
  type: TransactionTypes.swapERC20;
  asset: Erc20Change;
};

export type TransactionTransferERC20 = TransactionCommonData & {
  type: TransactionTypes.transferERC20;
  from: string;
  to: string;
  asset: Erc20Change;
};

export type TransactionApprovalERC20 = TransactionCommonData & {
  type: TransactionTypes.approvalERC20;
  asset: SmallTokenInfoWithIcon;
};

export type TransactionContractExecution = TransactionCommonData & {
  type: TransactionTypes.execution;
  from: string;
  to: string;
};

export type TransactionUnknown = TransactionCommonData & {
  type: TransactionTypes.unknown;
  asset?: Erc20Change;
};

export type Transaction =
  | TransactionSwapERC20
  | TransactionTransferERC20
  | TransactionApprovalERC20
  | TransactionContractExecution
  | TransactionUnknown;

export type GasData = {
  LastBlock: string;
  SafeGas: {
    price: string;
    estTime: number;
  };
  ProposeGas: {
    price: string;
    estTime: number;
  };
  FastGas: {
    price: string;
    estTime: number;
  };
};

export type TransactionsParams = {
  from: string;
  gas?: number;
  gasPrice?: string;
  value?: string;
};
