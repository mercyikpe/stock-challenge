import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWebSocket } from '@/services/websocket';

vi.mock('vue', () => ({
  ref: (val) => ({ value: val }),
}));

describe('useWebSocket', () => {
  let ws;

  beforeEach(() => {
    global.WebSocket = vi.fn().mockImplementation(() => ({
      send: vi.fn(),
      close: vi.fn(),
    }));
    ws = useWebSocket();
    ws.initWebSocket(); // initialize Websocket before each test
  });

  it('initializes with empty stocks and disconnected status', () => {
    expect(ws.stocks.value).toEqual([]);
    expect(ws.connectionStatus.value).toBe('disconnected');
  });

  it('adds a stock correctly', () => {
    const result = ws.addStock('US0378331005');
    expect(result).toBe(true);
    expect(ws.stocks.value).toContainEqual({
      isin: 'US0378331005',
      price: null,
      bid: null,
      ask: null,
    });
  });

  it('prevents adding duplicate stocks', () => {
    ws.addStock('US0378331005');
    const result = ws.addStock('US0378331005');
    expect(result).toBe(false);
    expect(ws.stocks.value.length).toBe(1);
  });

  it('removes a stock correctly', () => {
    ws.addStock('US0378331005');
    ws.removeStock('US0378331005');
    expect(ws.stocks.value).toEqual([]);
  });
});
