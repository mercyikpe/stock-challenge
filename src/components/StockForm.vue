<script setup lang="ts">
import { ref } from 'vue';

import Button from './Button.vue';
import TextField from './TextField.vue';

const props = defineProps<{
  existingStocks: { isin: string }[];
}>();

const emit = defineEmits<{
  (e: 'add-stock', isin: string): void;
}>();

const isin = ref('');
const isValid = ref(true);
const errorMessage = ref('');

// Function to validate ISIN format
const isValidISIN = (isin: string) => {
  return /^[A-Z]{2}[A-Z0-9]{9}\d$/.test(isin);
};

// Function to validate the input
const validateInput = () => {
  if (!isValidISIN(isin.value)) {
    isValid.value = false;
    errorMessage.value = 'Invalid ISIN format';
  } else if (props.existingStocks.some((stock) => stock.isin === isin.value)) {
    isValid.value = false;
    errorMessage.value = 'This ISIN already exists in your watchlist';
  } else {
    isValid.value = true;
    errorMessage.value = '';
  }
};

// Function to handle form submission
const submitForm = () => {
  validateInput();
  if (isValid.value && isin.value.length > 0) {
    emit('add-stock', isin.value);
    isin.value = ''; // Reset the input field
    isValid.value = true;
    errorMessage.value = '';
  }
};
</script>

<template>
  <form @submit.prevent="submitForm" class="stock-form">
    <div class="form-group">
      <label for="isin-input" class="visually-hidden">Enter ISIN</label>

      <TextField
        v-model="isin"
        type="text"
        placeholder="Enter ISIN"
        @input="validateInput"
        class="text-input"
        :class="{ invalid: !isValid && isin.length > 0 }"
        :aria-invalid="!isValid && isin.length > 0"
        :aria-describedby="
          !isValid && isin.length > 0 ? 'isin-error' : undefined
        "
      />

      <Button
        class="submit-btn"
        type="submit"
        :disabled="!isValid || isin.length === 0"
        aria-label="Add Stock to Watchlist"
        >Add Stock</Button
      >
    </div>

    <p v-if="!isValid && isin.length > 0" class="error-message" role="alert">
      {{ errorMessage }}
    </p>
  </form>
</template>

<style scoped>
.stock-form {
  margin: 0 auto;
  max-width: 32rem;
  text-align: center;
}
.form-group {
  display: flex;
  margin: 3rem 0 5px 0;
  gap: 12px;
}

.text-input {
  width: 90%;
}

input.invalid {
  border-color: var(--color-primary-red2);
}

.error-message {
  color: var(--color-primary-red3);
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

.submit-btn {
  white-space: nowrap;
}

button:disabled {
  background-color: var(--color-foreground1);
  cursor: not-allowed;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
