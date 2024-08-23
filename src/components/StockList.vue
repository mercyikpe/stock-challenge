<script setup lang="ts">
import { defineEmits } from 'vue';

// Define the Stock interface
interface Stock {
  isin: string;
  price: number | null;
  bid: number | null;
  ask: number | null;
}

// Define props using the Stock interface
const props = defineProps<{
  stocks: Stock[];
  connectionStatus: string;
}>();

const emit = defineEmits<{
  (e: 'remove-stock', isin: string): void;
}>();
</script>

<template>
  <div>
    <p :class="{ disconnected: props.connectionStatus === 'disconnected' }">
      Connection status: {{ props.connectionStatus }}
    </p>
    <div v-if="props.stocks.length === 0" class="empty-state">
      <p>No stocks in your watchlist. Add stocks to track their prices.</p>
    </div>
    <ul :class="{ 'stale-data': props.connectionStatus === 'disconnected' }" v-else>
      <li v-for="stock in props.stocks" :key="stock.isin">
        {{ stock.isin }} - Price: {{ stock.price }} (Bid: {{ stock.bid }}, Ask:
        {{ stock.ask }})
        <span
          v-if="props.connectionStatus === 'disconnected'"
          class="warning-icon"
          title="Data may not be up-to-date"
          >⚠️</span
        >
        <button @click="emit('remove-stock', stock.isin)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.disconnected {
  color: red;
}

.stale-data {
  opacity: 0.6;
}

.empty-state {
  text-align: center;
  margin-top: 20px;
}

.warning-icon {
  color: #ffc107;
  margin-left: 5px;
  cursor: pointer;
}
</style>
