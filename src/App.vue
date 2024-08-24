<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import Header from './components/Header.vue';
import TextField from './components/TextField.vue';
import Button from './components/Button.vue';
import './index.css';

import StockForm from './components/StockForm.vue';
import StockList from './components/StockList.vue';

import { useWebSocket } from './services/websocket';

export default defineComponent({
  components: {
    Header,
    TextField,
    Button,
    StockList,
    StockForm,
  },
  setup() {
    const { stocks, connectionStatus, initWebSocket, addStock, removeStock } = useWebSocket();

    // Initialize WebSocket
    onMounted(() => {
      initWebSocket();
    });

    return {
      stocks,
      connectionStatus,
      addStock,
      removeStock,
    };
  },
});
</script>

<template>
  <Header />

  <main class="main">
    <h1 class="heading1">Stock Watchlist</h1>
    <stock-form @add-stock="addStock" :existingStocks="stocks"></stock-form>

    <stock-list
      :stocks="stocks"
      @remove-stock="removeStock"
      :connection-status="connectionStatus"
    ></stock-list>
  </main>
  
</template>

<style>
#app {
  font-family: var(--font-regular);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
  overflow: hidden;
}

.heading1 {
  font-family: var(--font-bold);
  font-size: larger;
  text-align: center;
}
</style>
