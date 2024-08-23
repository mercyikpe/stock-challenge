// services/websocket.js
import { ref } from 'vue';

export const useWebSocket = () => {
  const stocks = ref([]);
  const connectionStatus = ref('disconnected');
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
    if (!stocks.value.some(stock => stock.isin === isin)) {
      stocks.value.push({ isin, price: null, bid: null, ask: null });
      socket.send(JSON.stringify({ subscribe: isin }));
      return true;
    }
    return false;
  };

  const removeStock = (isin) => {
    stocks.value = stocks.value.filter(stock => stock.isin !== isin);
    socket.send(JSON.stringify({ unsubscribe: isin }));
  };

  const updateStockPrice = (data) => {
    const stockIndex = stocks.value.findIndex(stock => stock.isin === data.isin);
    if (stockIndex !== -1) {
      stocks.value[stockIndex] = { ...stocks.value[stockIndex], ...data };
    }
  };

  return {
    stocks,
    connectionStatus,
    initWebSocket,
    addStock,
    removeStock
  };
};