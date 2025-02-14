export interface Globals {
  isReleaseRadarEnabled: boolean;
  isDebitCardEnabled: boolean;
  isGovernanceEnabled: boolean;
  isNibbleShopEnabled: boolean;
  isNftDropsEnabled: boolean;
  isIntercomEnabled: boolean;
  isSavingsMonthlyChartEnabled: boolean;
  isTreasuryMonthlyChartEnabled: boolean;
}

const values: Globals = {
  isReleaseRadarEnabled: false,
  isDebitCardEnabled: false,
  isGovernanceEnabled: false,
  isNibbleShopEnabled: false,
  isNftDropsEnabled: false,
  isIntercomEnabled: false,
  isSavingsMonthlyChartEnabled: false,
  isTreasuryMonthlyChartEnabled: false
};

export const isFeatureEnabled = <T extends keyof Globals>(key: T): boolean =>
  !!values[key];
