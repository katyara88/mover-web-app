<template>
  <div class="general-desktop__sidebar-wrapper-user">
    <wallet-header-avatar />
    <div class="button-active" @click.prevent="disconnectWallet">
      <button type="button">
        <span>{{ currentAddressText }}</span>
        <img
          :alt="$t('txtChangeWalletAlt')"
          src="@/assets/images/arrow-down.svg"
        />
      </button>
      <button class="status-button" type="button">
        <span class="status">
          {{ $t('lblDisconnect') }}
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapMutations, mapState } from 'vuex';

import WalletHeaderAvatar from './wallet-header-avatar.vue';

export default Vue.extend({
  name: 'WalletHeader',
  components: {
    WalletHeaderAvatar
  },
  computed: {
    ...mapState('account', ['currentAddress']),
    currentAddressText(): string {
      if (this.currentAddress) {
        const val = this.currentAddress as string;
        const cutSize = 4;
        const prefixSize = 2; // 0x...

        return [
          ...val.slice(0, cutSize + prefixSize - 1),
          '...',
          ...val.slice(val.length - cutSize, val.length)
        ].join('');
      }

      return this.$t('btnConnectWallet') as string;
    }
  },
  methods: {
    ...mapMutations('account', { setCurrentWallet: 'setCurrentWallet' }),
    ...mapActions('account', {
      refreshWallet: 'refreshWallet',
      clearWalletState: 'disconnectWallet'
    }),
    handleAddressChanged(address: string): void {
      this.setCurrentWallet(address);
      this.refreshWallet();
      this.$emit('selected-address-changed', address);
    },
    async disconnectWallet(): Promise<void> {
      await this.clearWalletState();
      window.location.reload();
    }
  }
});
</script>
