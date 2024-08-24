import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import StockForm from '@/components/StockForm.vue';

describe('StockForm', () => {
  const factory = (existingStocks = []) =>
    mount(StockForm, {
      props: { existingStocks },
    });

  const setInputValue = async (wrapper, value) => {
    const input = wrapper.find('input');
    await input.setValue(value);
    await input.trigger('input');
    return input;
  };

  it('validates ISIN format and handles duplicate ISINs', async () => {
    const wrapper = factory([{ isin: 'US0378331005' }]);

    // Invalid ISIN format
    let input = await setInputValue(wrapper, 'invalid');
    expect(wrapper.find('.error-message').text()).toBe('Invalid ISIN format');
    expect(wrapper.find('button').element.disabled).toBe(true);

    // Valid ISIN but duplicate
    input = await setInputValue(wrapper, 'US0378331005');
    expect(wrapper.find('.error-message').text()).toBe(
      'This ISIN already exists in your watchlist'
    );
    expect(wrapper.find('button').element.disabled).toBe(true);

    // Valid ISIN and unique
    input = await setInputValue(wrapper, 'US0378331006');
    expect(wrapper.find('.error-message').exists()).toBe(false);
    expect(wrapper.find('button').element.disabled).toBe(false);
  });

  it('emits add-stock event with valid ISIN', async () => {
    const wrapper = factory();

    await setInputValue(wrapper, 'US0378331005');
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.emitted('add-stock')).toBeTruthy();
    expect(wrapper.emitted('add-stock')[0]).toEqual(['US0378331005']);
  });
});