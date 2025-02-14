import { sameAddress } from '@/utils/address';
import { needApprove } from '@/wallet/actions/approve/needApprove';
import { toWei, floorDivide } from '@/utils/bigmath';
import { SmallToken, TransactionsParams } from '@/wallet/types';
import { Network } from '@/utils/networkTypes';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { multiply } from '@/utils/bigmath';
import {
  getMoveAssetData,
  HOLY_HAND_ABI,
  HOLY_HAND_ADDRESS
} from '@/wallet/references/data';
import ethDefaults from '@/wallet/references/defaults';
import { estimateApprove } from '@/wallet/actions/approve/approveEstimate';

export type CompoudEstimateResponse = {
  error: boolean;
  approveGasLimit: string;
  actionGasLimit: string;
};

type EstimateResponse = {
  error: boolean;
  gasLimit: string;
};

export const estimateClaimAndBurnCompound = async (
  inputAsset: SmallToken,
  inputAmount: string,
  network: Network,
  web3: Web3,
  accountAddress: string
): Promise<CompoudEstimateResponse> => {
  const contractAddress = HOLY_HAND_ADDRESS(network);

  let isApproveNeeded = true;
  try {
    isApproveNeeded = await needApprove(
      accountAddress,
      inputAsset,
      inputAmount,
      contractAddress,
      web3
    );
  } catch (err) {
    console.error(`Can't estimate approve: ${err}`);
    return {
      error: true,
      approveGasLimit: '0',
      actionGasLimit: '0'
    };
  }

  if (isApproveNeeded) {
    console.log("Needs approve, can't do a proper estimation");
    try {
      const approveGasLimit = await estimateApprove(
        accountAddress,
        inputAsset.address,
        contractAddress,
        web3
      );
      return {
        error: false,
        actionGasLimit: ethDefaults.basic_holy_treasury_burn,
        approveGasLimit: approveGasLimit
      };
    } catch (err) {
      console.error(`Can't estimate approve: ${err}`);
      return {
        error: true,
        actionGasLimit: '0',
        approveGasLimit: '0'
      };
    }
  } else {
    const claimAndBurnEstimate = await estimateClaimAndBurn(
      inputAsset,
      inputAmount,
      network,
      web3,
      accountAddress
    );
    return {
      error: claimAndBurnEstimate.error,
      approveGasLimit: '0',
      actionGasLimit: claimAndBurnEstimate.gasLimit
    };
  }
};

export const estimateClaimAndBurn = async (
  inputAsset: SmallToken,
  inputAmount: string,
  network: Network,
  web3: Web3,
  accountAddress: string
): Promise<EstimateResponse> => {
  console.log('Estimating treasury claim and burn...');

  if (!sameAddress(inputAsset.address, getMoveAssetData(network).address)) {
    throw 'Only MOVE can be burned';
  }

  const contractAddress = HOLY_HAND_ADDRESS(network);
  const contractABI = HOLY_HAND_ABI;

  try {
    const holyHand = new web3.eth.Contract(
      contractABI as AbiItem[],
      contractAddress
    );

    const transactionParams = {
      from: accountAddress
    } as TransactionsParams;

    const inputAmountInWEI = toWei(inputAmount, inputAsset.decimals);

    console.log(
      '[treasury claim and burn estimation] input amount in WEI:',
      inputAmountInWEI
    );
    console.log(
      '[treasury claim and burn estimation] transactionParams:',
      transactionParams
    );

    const gasLimitObj = await holyHand.methods
      .claimAndBurn(inputAmountInWEI)
      .estimateGas(transactionParams);

    if (gasLimitObj) {
      const gasLimit = gasLimitObj.toString();
      console.log(
        '[treasury claim and burn estimation] gas estimation by web3: ' +
          gasLimit
      );
      const gasLimitWithBuffer = floorDivide(multiply(gasLimit, '120'), '100');
      console.log(
        '[treasury claim and burn estimation] gas estimation by web3 (with additional 20% as buffer): ' +
          gasLimitWithBuffer
      );
      return { error: false, gasLimit: gasLimitWithBuffer };
    } else {
      throw new Error('empty gas limit');
    }
  } catch (error) {
    console.error(`can't estimate treasury claim and burn due to: ${error}`);
    return {
      error: true,
      gasLimit: '0'
    };
  }
};
