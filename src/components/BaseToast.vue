<template>
  <div v-if="visible" class="toast-box" :class="type">
    {{ message }}
  </div>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const message = ref('');
const type = ref('success');

function showToast(msg, t = 'success') {
  message.value = msg;
  type.value = t;
  visible.value = true;
  setTimeout(() => (visible.value = false), 3000);
}

defineExpose({ showToast });
</script>

<style scoped>
.toast-box {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  padding: 12px 20px;
  border-radius: 6px;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.success {
  background-color: #28a745;
}
.error {
  background-color: #dc3545;
}
.warning {
  background-color: #ffc107;
  color: #333;
}
</style>