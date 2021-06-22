import {
  convertStringToHexWithPrefix,
  getPureEthAddress
} from '@/utils/address';
import { BigNumber } from 'bignumber.js';
import { multiply, toWei } from './../../../utils/bigmath';
import { AbiItem } from 'web3-utils';
import { executeTransactionWithApprove } from './../actionWithApprove';
import { Network } from '@/utils/networkTypes';
import { SmallToken, TransactionsParams } from '@/wallet/types';
import { TransferData } from '@/services/0x/api';
import Web3 from 'web3';
import { HOLY_HAND_ABI, HOLY_HAND_ADDRESS } from '@/wallet/references/data';

export const swapCompound = async (
  inputAsset: SmallToken,
  outputAsset: SmallToken,
  inputAmount: string,
  transferData: TransferData,
  network: Network,
  web3: Web3,
  accountAddress: string,
  gasLimit: string,
  gasPriceInGwei: string
): Promise<void> => {
  const contractAddress = HOLY_HAND_ADDRESS(network);

  try {
    executeTransactionWithApprove(
      inputAsset,
      contractAddress,
      inputAmount,
      accountAddress,
      web3,
      gasLimit,
      gasPriceInGwei,
      async () => {
        await swap(
          inputAsset,
          outputAsset,
          inputAmount,
          transferData,
          network,
          web3,
          accountAddress,
          gasLimit,
          gasPriceInGwei
        );
      }
    );
  } catch (err) {
    console.error(`Can't swap: ${err}`);
    return;
  }
};

export const swap = async (
  inputAsset: SmallToken,
  outputAsset: SmallToken,
  inputAmount: string,
  transferData: TransferData,
  network: Network,
  web3: Web3,
  accountAddress: string,
  gasLimit: string,
  gasPriceInGwei: string
): Promise<void> => {
  console.log('Executing swap...');

  const contractAddress = HOLY_HAND_ADDRESS(network);
  const contractABI = HOLY_HAND_ABI;

  try {
    const holyHand = new web3.eth.Contract(
      contractABI as AbiItem[],
      contractAddress
    );

    let value = undefined;

    if (transferData) {
      value = Web3.utils.toHex(transferData.value);
    }

    const transactionParams = {
      from: accountAddress,
      value: value,
      gas: web3.utils.toBN(gasLimit).toNumber(),
      gasPrice: web3.utils
        .toWei(web3.utils.toBN(gasPriceInGwei), 'gwei')
        .toString()
    } as TransactionsParams;

    const inputAmountInWEI = toWei(inputAmount, inputAsset.decimals);

    console.log('[holy swap] input amount in WEI:', inputAmountInWEI);

    let bytesData: number[] = [];
    let expectedMinimumReceived = '0';

    if (transferData) {
      expectedMinimumReceived = new BigNumber(
        multiply(transferData.buyAmount, '0.85')
      ).toFixed(0);

      console.log(
        '[holy swap] expected minimum received:',
        expectedMinimumReceived
      );

      const valueBytes = Web3.utils.hexToBytes(
        Web3.utils.padLeft(convertStringToHexWithPrefix(transferData.value), 64)
      );
      console.log('[holy swap] valueBytes:', Web3.utils.bytesToHex(valueBytes));

      bytesData = Array.prototype.concat(
        Web3.utils.hexToBytes(transferData.to),
        Web3.utils.hexToBytes(transferData.allowanceTarget),
        valueBytes,
        Web3.utils.hexToBytes(transferData.data)
      );

      console.log('[holy swap] bytesData:', Web3.utils.bytesToHex(bytesData));
    }

    console.log('[holy swap] transactionParams:', transactionParams);

    let inputCurrencyAddress = inputAsset.address;
    if (inputAsset.address === 'eth') {
      inputCurrencyAddress = getPureEthAddress();
    }

    let outputCurrencyAddress = outputAsset.address;
    if (outputAsset.address === 'eth') {
      outputCurrencyAddress = getPureEthAddress();
    }

    console.log('[holy swap] inputCurrencyAddress:', inputCurrencyAddress);
    console.log('[holy swap] outputCurrencyAddress:', outputCurrencyAddress);

    await new Promise<void>((resolve, reject) => {
      holyHand.methods
        .executeSwap(
          inputCurrencyAddress,
          outputCurrencyAddress,
          inputAmountInWEI,
          expectedMinimumReceived,
          bytesData
        )
        .send(transactionParams)
        .once('transactionHash', (hash: string) => {
          console.log(`Swap txn hash: ${hash}`);
        })
        .once('receipt', (receipt: any) => {
          console.log(`Swap txn receipt: ${receipt}`);
          resolve();
        })
        .once('error', (error: Error) => {
          console.log(`Swap txn error: ${error}`);
          reject(error);
        });
    });
  } catch (error) {
    console.error(`can't execute swap due to: ${error}`);
  }
};
