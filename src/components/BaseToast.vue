<!-- src/components/BaseToast.vue -->
<template>
  <div v-if="visible" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
    <div class="toast align-items-center text-white" :class="toastClass" role="alert">
      <div class="d-flex">
        <div class="toast-body">{{ message }}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="visible = false"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,computed } from 'vue';

const visible = ref(false);
const message = ref('');
const type = ref('success');

function showToast(msg, toastType = 'success') {
  message.value = msg;
  type.value = toastType;
  visible.value = true;

  setTimeout(() => {
    visible.value = false;
  }, 4000);
}

const toastClass = computed(() => {
  return {
    'bg-success': type.value === 'success',
    'bg-danger': type.value === 'error',
    'bg-warning': type.value === 'warning',
  };
});

defineExpose({ showToast });
</script>

<style scoped>
.toast {
  min-width: 250px;
  animation: fadein 0.3s ease-in-out;
}
@keyframes fadein {
  from { opacity: 0; right: -100px }
  to { opacity: 1; right: 0 }
}
</style>