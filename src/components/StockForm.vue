<script setup lang="ts">
import { ref } from 'vue';

import Button from './Button.vue';
import TextField from './TextField.vue';

// Define the props and assign them to a variable
const props = defineProps<{
  existingStocks: { isin: string }[];
}>();

// Define emits
const emit = defineEmits<{
  (e: 'add-stock', isin: string): void;
}>();

// Reactive variables
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
  <form @submit.prevent="submitForm">
    <div class="form-group">
      <TextField
        v-model="isin"
        type="text"
        placeholder="Enter ISIN"
        @input="validateInput"
        :class="{ invalid: !isValid && isin.length > 0 }"
      />

      <small v-if="!isValid && isin.length > 0" class="error-message">
        {{ errorMessage }}
      </small>
    </div>

    <Button type="submit" :disabled="!isValid || isin.length === 0"
      >Add Stock</Button
    >
  </form>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

/* input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
} */

input.invalid {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

/* button {
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
} */

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
