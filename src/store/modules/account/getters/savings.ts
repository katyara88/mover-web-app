import { GetterTree } from 'vuex';

import gt from 'lodash-es/gt';
import { divide, fromWei, multiply } from '@/utils/bigmath';

import { AccountStoreState } from '@/store/modules/account/types';
import { RootStoreState } from '@/store/types';
import { getUSDCAssetData } from '@/wallet/references/data';
import { SavingsMonthBalanceItem } from '@/services/mover';

export default {
  savingsInfoBalanceUSDC(state): string {
    if (state.savingsBalance !== undefined) {
      return state.savingsBalance;
    }

    if (
      state.savingsInfo === undefined ||
      state.isSavingsInfoLoading ||
      state.networkInfo === undefined
    ) {
      return '0';
    }

    return fromWei(
      state.savingsInfo.currentBalance,
      getUSDCAssetData(state.networkInfo.network).decimals
    );
  },
  savingsInfoBalanceNative(state, getters): string {
    return multiply(getters.savingsInfoBalanceUSDC, getters.usdcNativePrice);
  },
  savingsInfoEarnedThisMonthNative(state, getters): string {
    if (
      state.savingsInfo === undefined ||
      state.isSavingsInfoLoading ||
      state.networkInfo === undefined
    ) {
      return '0';
    }

    const valueInUSDC = fromWei(
      state.savingsInfo.earnedThisMonth,
      getUSDCAssetData(state.networkInfo.network).decimals
    );

    return multiply(valueInUSDC, getters.usdcNativePrice);
  },
  savingsInfoEarnedTotalNative(state): string {
    if (
      state.savingsInfo === undefined ||
      state.isSavingsInfoLoading ||
      state.networkInfo === undefined
    ) {
      return '0';
    }

    return fromWei(
      state.savingsInfo.earnedTotal,
      getUSDCAssetData(state.networkInfo.network).decimals
    );
  },
  savingsInfoTotalPoolBalanceNative(state, getters): string {
    if (
      state.savingsInfo === undefined ||
      state.isSavingsInfoLoading ||
      state.networkInfo === undefined
    ) {
      return '0';
    }

    const balanceUSDC = fromWei(
      state.savingsInfo.currentPoolBalance,
      getUSDCAssetData(state.networkInfo.network).decimals
    );
    return multiply(balanceUSDC, getters.usdcNativePrice);
  },
  savingsEstimatedEarningsTomorrowNative(state, getters): string {
    if (
      state.savingsInfo === undefined ||
      state.isSavingsInfoLoading ||
      state.savingsDPY === undefined
    ) {
      return '0';
    }

    const multiplier = divide(state.savingsDPY, 100);
    return multiply(getters.savingsInfoBalanceNative, multiplier);
  },
  savingsEstimatedEarningsNextMonthNative(state, getters): string {
    if (
      state.savingsInfo === undefined ||
      state.isSavingsInfoLoading ||
      state.savingsDPY === undefined
    ) {
      return '0';
    }

    const multiplier = divide(multiply(state.savingsDPY, 30), 100);
    return multiply(getters.savingsInfoBalanceNative, multiplier);
  },
  savingsEstimatedEarningsAnnuallyNative(state, getters): string {
    if (
      state.savingsInfo === undefined ||
      state.isSavingsInfoLoading ||
      state.savingsAPY === undefined
    ) {
      return '0';
    }

    const multiplier = divide(state.savingsAPY, 100);
    return multiply(getters.savingsInfoBalanceNative, multiplier);
  },
  savingsEndOfMonthBalanceNative(state, getters): string {
    if (
      state.savingsReceipt === undefined ||
      state.isSavingsReceiptLoading ||
      state.networkInfo === undefined
    ) {
      return '0';
    }

    const balanceInUSDC = fromWei(
      state.savingsReceipt.endOfMonthBalance,
      getUSDCAssetData(state.networkInfo.network).decimals
    );

    return multiply(balanceInUSDC, getters.usdcNativePrice);
  },
  savingsMonthEarnedNative(state): string {
    if (
      state.savingsReceipt === undefined ||
      state.isSavingsReceiptLoading ||
      state.networkInfo === undefined
    ) {
      return '0';
    }

    return '0';
  },
  savingsMonthAverageEarnedNative(state): string {
    if (
      state.savingsReceipt === undefined ||
      state.isSavingsReceiptLoading ||
      state.networkInfo === undefined
    ) {
      return '0';
    }

    return '0';
  },
  savingsMonthTotalDepositsNative(state, getters): string {
    if (
      state.savingsReceipt === undefined ||
      state.isSavingsReceiptLoading ||
      state.networkInfo === undefined ||
      state.savingsReceipt.totalDeposits === 0
    ) {
      return '0';
    }

    const depositsInUSDC = fromWei(
      state.savingsReceipt.totalDeposits,
      getUSDCAssetData(state.networkInfo.network).decimals
    );

    return multiply(depositsInUSDC, getters.usdcNativePrice);
  },
  savingsMonthTotalWithdrawalsNative(state, getters): string {
    if (
      state.savingsReceipt === undefined ||
      state.isSavingsReceiptLoading ||
      state.networkInfo === undefined ||
      state.savingsReceipt.totalWithdrawals === 0
    ) {
      return '0';
    }

    const withdrawalsInUSDC = fromWei(
      state.savingsReceipt.totalWithdrawals,
      getUSDCAssetData(state.networkInfo.network).decimals
    );

    return multiply(withdrawalsInUSDC, getters.usdcNativePrice);
  },
  savingsMonthStatsOptions(state): Array<SavingsMonthBalanceItem> {
    if (state.isSavingsInfoLoading || state.savingsInfo === undefined) {
      return [];
    }

    return state.savingsInfo.last12MonthsBalances
      .filter((item) => item.balance !== 0)
      .slice()
      .sort((a, b) => b.snapshotTimestamp - a.snapshotTimestamp);
  },
  hasActiveSavings(state): boolean {
    if (state.savingsBalance !== undefined && gt(state.savingsBalance, 0)) {
      return true;
    }

    if (state.savingsInfo !== undefined && !state.isSavingsInfoLoading) {
      const isCurrentBalanceNotEmpty = state.savingsInfo.currentBalance > 0;
      const isEarnedTotalNotEmpty = state.savingsInfo.earnedTotal > 0;

      if (isCurrentBalanceNotEmpty || isEarnedTotalNotEmpty) {
        return true;
      }

      const hadAtLeastOneMonthWithNonZeroBalance =
        state.savingsInfo.last12MonthsBalances.some((item) => item.balance > 0);
      if (hadAtLeastOneMonthWithNonZeroBalance) {
        return true;
      }
    }

    if (state.savingsReceipt !== undefined && !state.isSavingsReceiptLoading) {
      const isEndOfMonthBalanceNotEmpty =
        state.savingsReceipt.endOfMonthBalance > 0;
      const isTotalDepositsNotEmpty = state.savingsReceipt.totalDeposits > 0;
      const isTotalWithdrawalsNotEmpty =
        state.savingsReceipt.totalWithdrawals > 0;

      if (
        isEndOfMonthBalanceNotEmpty ||
        isTotalDepositsNotEmpty ||
        isTotalWithdrawalsNotEmpty
      ) {
        return true;
      }
    }

    return false;
  }
} as GetterTree<AccountStoreState, RootStoreState>;
