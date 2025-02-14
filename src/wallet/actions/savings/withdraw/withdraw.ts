import { getPureEthAddress } from '@/utils/address';
import { toWei } from '@/utils/bigmath';
import { AbiItem } from 'web3-utils';
import { Network } from '@/utils/networkTypes';
import { SmallToken, TransactionsParams } from '@/wallet/types';
import Web3 from 'web3';
import {
  HOLY_HAND_ABI,
  HOLY_HAND_ADDRESS,
  HOLY_SAVINGS_POOL_ADDRESS
} from '@/wallet/references/data';
import { withdrawSubsidized } from './withdrawSubsidized';

export const withdrawCompound = async (
  outputAsset: SmallToken,
  outputAmount: string,
  network: Network,
  web3: Web3,
  accountAddress: string,
  actionGasLimit: string,
  gasPriceInGwei: string,
  useSubsidized: boolean,
  changeStepToProcess: () => Promise<void>
): Promise<void> => {
  const contractAddress = HOLY_HAND_ADDRESS(network);

  try {
    if (useSubsidized) {
      await withdrawSubsidized(
        outputAsset,
        outputAmount,
        network,
        web3,
        accountAddress,
        changeStepToProcess
      );
    } else {
      await withdraw(
        outputAsset,
        outputAmount,
        network,
        web3,
        accountAddress,
        actionGasLimit,
        gasPriceInGwei,
        changeStepToProcess
      );
    }
  } catch (err) {
    console.error(`Can't savings withdraw: ${err}`);
    throw err;
  }
};

export const withdraw = async (
  outputAsset: SmallToken,
  outputAmount: string,
  network: Network,
  web3: Web3,
  accountAddress: string,
  gasLimit: string,
  gasPriceInGwei: string,
  changeStepToProcess: () => Promise<void>
): Promise<void> => {
  console.log('Executing savings withdraw...');

  const contractAddress = HOLY_HAND_ADDRESS(network);
  const contractABI = HOLY_HAND_ABI;

  const poolAddress = HOLY_SAVINGS_POOL_ADDRESS(network);

  try {
    const holyHand = new web3.eth.Contract(
      contractABI as AbiItem[],
      contractAddress
    );

    const transactionParams = {
      from: accountAddress,
      gas: web3.utils.toBN(gasLimit).toNumber(),
      gasPrice: web3.utils
        .toWei(web3.utils.toBN(gasPriceInGwei), 'gwei')
        .toString()
    } as TransactionsParams;

    const outputAmountInWEI = toWei(outputAmount, outputAsset.decimals);

    console.log('[savings withdraw] output amount in WEI:', outputAmountInWEI);

    console.log('[savings deposit] transactionParams:', transactionParams);

    let outputCurrencyAddress = outputAsset.address;
    if (outputAsset.address === 'eth') {
      outputCurrencyAddress = getPureEthAddress();
    }

    console.log(
      '[savings withdraw] outputCurrencyAddress:',
      outputCurrencyAddress
    );

    await new Promise<void>((resolve, reject) => {
      holyHand.methods
        .withdrawFromPool(poolAddress, outputAmountInWEI)
        .send(transactionParams)
        .once('transactionHash', (hash: string) => {
          console.log(`Savings withdraw txn hash: ${hash}`);
          changeStepToProcess();
        })
        .once('receipt', (receipt: any) => {
          console.log(`Savings withdraw txn receipt: ${receipt}`);
          resolve();
        })
        .once('error', (error: Error) => {
          console.log(`Savings withdraw txn error: ${error}`);
          reject(error);
        });
    });
  } catch (error) {
    console.error(`can't execute savings withdraw due to: ${error}`);
    throw error;
  }
};
