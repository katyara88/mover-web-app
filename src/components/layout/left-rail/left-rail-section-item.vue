<template>
  <li>
    <p class="description" :class="descriptionClass">
      <slot name="description">{{ description }}</slot>
    </p>
    <span class="value" :class="valueClass">
      <slot>{{ value }}</slot>
    </span>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LeftRailSectionItem',
  props: {
    description: {
      type: String,
      default: ''
    },
    descriptionClass: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    valueClass: {
      type: String,
      default: ''
    }
  }
});
</script>
