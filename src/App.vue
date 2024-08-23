<script lang="ts">
import { defineComponent } from 'vue';
import Header from './components/Header.vue';
import TextField from './components/TextField.vue';
import Card from './components/Card.vue';
import Button from './components/Button.vue';
import './index.css';

import { ref, onMounted, onUnmounted } from 'vue';
import StockForm from './components/StockForm.vue';
import StockList from './components/StockList.vue';

import { useWebSocket } from './services/websocket';

export default defineComponent({
  components: {
    Header,
    TextField,
    Card,
    Button,
    StockList,
    StockForm,
  },
  setup() {
    const stocks = ref([]);
    const connectionStatus = ref('connected');
    let socket;

    const initWebSocket = () => {
      socket = new WebSocket('ws://localhost:8425/');

      socket.onopen = () => {
        connectionStatus.value = 'connected';
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateStockPrice(data);
      };

      socket.onclose = () => {
        connectionStatus.value = 'disconnected';
        setTimeout(initWebSocket, 5000);
      };
    };

    const addStock = (isin) => {
      if (!stocks.value.some((stock) => stock.isin === isin)) {
        stocks.value.push({ isin, price: null, bid: null, ask: null });
        socket.send(JSON.stringify({ subscribe: isin }));
      }
    };

    const removeStock = (isin) => {
      stocks.value = stocks.value.filter((stock) => stock.isin !== isin);
      socket.send(JSON.stringify({ unsubscribe: isin }));
    };

    const updateStockPrice = (data) => {
      const stockIndex = stocks.value.findIndex(
        (stock) => stock.isin === data.isin
      );
      if (stockIndex !== -1) {
        stocks.value[stockIndex] = { ...stocks.value[stockIndex], ...data };
      }
    };

    onMounted(() => {
      initWebSocket();
    });

    onUnmounted(() => {
      if (socket) socket.close();
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

  <h1>Stock Watchlist</h1>
  <stock-form @add-stock="addStock" :existingStocks="stocks"></stock-form>

  <stock-list
    :stocks="stocks"
    @remove-stock="removeStock"
    :connection-status="connectionStatus"
  ></stock-list>

  <!-- <main class="main">
    <h1 class="heading1">Welcome to the coding challenge</h1>
    <p>Please take a look at the <code>README.md</code> file for instructions on how to complete this task.</p>
    <p>
      In the interest of saving you some time, we have provided a working Vue app with a few components to get you
      started.
    </p>
    <p>Feel free to use them and change them as you need.</p>
    <ul class="component-list">
      <li>
        <p><code>TextField</code></p>
        <TextField placeholder="Placeholder" />
      </li>
      <li>
        <p><code>Card</code></p>
        <Card>
          <p>Generic card content</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ex, totam ducimus quam eligendi quasi
            laborum optio, tenetur, aperiam reprehenderit voluptates? A velit quia inventore amet excepturi pariatur
            praesentium. Quibusdam.
          </p>
        </Card>
      </li>
      <li>
        <p><code>Button</code></p>
        <Button>Button Label</Button>
      </li>
    </ul>
  </main> -->
</template>

<style>
 #app {
  font-family: var(--font-regular);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
} 

/* .main {
  max-width: var(--max-width);
  margin: 0 auto;
  display: none;
}

.heading1 {
  font-family: var(--font-bold);
}

.component-list {
  padding: 0 0 0 12px;
}  */
</style>
