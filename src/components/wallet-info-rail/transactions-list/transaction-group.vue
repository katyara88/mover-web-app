<template>
  <div class="general-desktop__sidebar-wrapper-info">
    <h3>{{ headingText }}</h3>
    <transaction-item
      v-for="tx in transactions"
      :key="tx.uniqHash"
      :transaction="tx"
    ></transaction-item>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { Transaction } from '@/wallet/types';

import TransactionItem from './transaction-item.vue';

export default Vue.extend({
  name: 'TransactionGroup',
  components: {
    TransactionItem
  },
  props: {
    headingText: {
      type: String,
      required: true
    },
    transactions: {
      type: Array as PropType<Array<Transaction>>,
      required: true
    }
  }
});
</script>
