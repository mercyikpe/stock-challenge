<script setup lang="ts">
import { defineEmits } from 'vue';
import { formatNumber } from './utils/formatNumber';

interface Stock {
  isin: string;
  price: number | null;
  bid: number | null;
  ask: number | null;
}

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
    <p class="connection-status">
      Connection status:
      <span
        :class="
          props.connectionStatus === 'disconnected'
            ? 'disconnected'
            : 'connected'
        "
      >
        {{ props.connectionStatus }}
      </span>
    </p>
    <div v-if="props.stocks.length === 0" class="empty-state">
      <p>No stocks in your watchlist. Add stocks to track their prices.</p>
    </div>

    <div
      class="table-wrapper"
      :class="{ 'stale-data': props.connectionStatus === 'disconnected' }"
      v-else
    >
      <p
        v-if="props.connectionStatus === 'disconnected'"
        class="warning-text"
        role="alert"
      >
        ⚠️ Stock data may not be up-to-date due to no connection
      </p>

      <table aria-label="Stock Watchlist">
        <thead>
          <tr>
            <th scope="col">ISIN</th>
            <th scope="col">Price (€)</th>
            <th scope="col">Bid (€)</th>
            <th scope="col">Ask (€)</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="stock in props.stocks" :key="stock.isin">
            <td>{{ stock.isin }}</td>
            <td>{{ formatNumber(stock.price) }}</td>
            <td>{{ formatNumber(stock.bid) }}</td>
            <td>{{ formatNumber(stock.ask) }}</td>
            <td>
              <button
                class="remove-stock-btn"
                @click="emit('remove-stock', stock.isin)"
                :aria-label="`Remove ${stock.isin} from watchlist`"
              >
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.table-wrapper {
  overflow-x: auto;
}
table {
  margin-top: 2rem;
  border-collapse: collapse;
  width: 100%;

  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

/* Hide scrollbar for WebKit-based browsers (Chrome, Safari, Edge) */
.table-wrapper::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for Firefox */
.table-wrapper {
  scrollbar-color: transparent;
}

/* Hide scrollbar for Internet Explorer, Edge (non-Chromium) */
.table-wrapper {
  -ms-overflow-style: none;
}

thead th,
tbody td {
  padding: 8px 16px;
  text-align: left;
}

@media screen {
  thead th,
  tbody td {
    padding: 4px 6px;
    text-align: left;
    font-size: 13px;
  }
}

.remove-stock-btn {
  color: var(--color-primary-red3);
  cursor: pointer;
  border: none;
  background: transparent;

  &:hover {
    text-decoration: underline;
  }
}

.connection-status {
  font-size: 14px;
}

.disconnected {
  color: var(--color-primary-red3);
}

.connected {
  color: var(--color-primary-green2);
}

.empty-state {
  text-align: center;
  margin-top: 20%;
  padding: 0 24px;
}

.warning-text {
  color: var(--color-primary-orange3);
  margin-left: 5px;
}
</style>
