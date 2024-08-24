import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StockList from '@/components/StockList.vue';

describe('StockList', () => {
  let wrapper;
  const stocks = [
    { isin: 'US0378331005', price: 150.25, bid: 150.20, ask: 150.30 },
    { isin: 'US5949181045', price: 280.50, bid: 280.45, ask: 280.55 }
  ];

  it('renders stocks correctly in a table', () => {
    wrapper = mount(StockList, {
      props: {
        stocks,
        connectionStatus: 'connected'
      }
    });

    const rows = wrapper.findAll('tr');
    expect(rows).toHaveLength(3); // 1 header row + 2 data rows

    const cells = rows[1].findAll('td');
    expect(cells[0].text()).toBe('US0378331005');
    expect(cells[1].text()).toBe('150.25');
    expect(cells[2].text()).toBe('150.2');
    expect(cells[3].text()).toBe('150.3');

    const cells2 = rows[2].findAll('td');
    expect(cells2[0].text()).toBe('US5949181045');
    expect(cells2[1].text()).toBe('280.5');
    expect(cells2[2].text()).toBe('280.45');
    expect(cells2[3].text()).toBe('280.55');
  });

  it('shows disconnected status', () => {
    wrapper = mount(StockList, {
      props: {
        stocks: [],
        connectionStatus: 'disconnected'
      }
    });

    expect(wrapper.find('.disconnected').exists()).toBe(true);
    expect(wrapper.text()).toContain('Connection status: disconnected');
  });

  it('emits remove-stock event when remove button is clicked', async () => {
    wrapper = mount(StockList, {
      props: {
        stocks,
        connectionStatus: 'connected'
      }
    });

    const removeButton = wrapper.find('button');
    await removeButton.trigger('click');

    expect(wrapper.emitted('remove-stock')).toBeTruthy();
    expect(wrapper.emitted('remove-stock')[0]).toEqual(['US0378331005']);
  });
});