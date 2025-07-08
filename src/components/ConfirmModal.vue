<!-- src/components/ConfirmModal.vue -->
<template>
  <div class="modal-overlay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Xác nhận</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">Huỷ</button>
          <button class="btn btn-danger" @click="$emit('confirm')">Đồng ý</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ message: String });
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-dialog {
  width: 90%;
  max-width: 500px;
}
</style>