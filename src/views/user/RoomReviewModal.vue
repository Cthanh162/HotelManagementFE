<template>
  <div class="modal" v-if="visible" @click.self="close">
    <div class="modal-dialog modal-lg bg-white p-4 rounded">
      <h5 class="mb-3">🗣️ Đánh Giá</h5>
      <form @submit.prevent="submitReview">
        <div class="mb-3">
          <label class="form-label">Đánh Giá</label>
          <select v-model="rating" class="form-select" required>
            <option :value="5">Rất Tốt</option>
            <option :value="4">Tốt</option>
            <option :value="3">Trung Bình</option>
            <option :value="2">Tệ</option>
            <option :value="1">Rất Tệ</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Nhận Xét</label>
          <textarea v-model="comment" class="form-control" rows="3"></textarea>
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary me-2" @click="close">Đóng</button>
          <button class="btn btn-success" type="submit">Gửi</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/config';

const props = defineProps({ roomId: Number, visible: Boolean });
const emit = defineEmits(['close', 'submitted']);

const rating = ref(5);
const comment = ref('');

function close() {
  emit('close');
}

async function submitReview() {
  const token = localStorage.getItem('accessToken');
  if (!token) return alert('Vui lòng đăng nhập');

  await axios.post(`/rooms/${props.roomId}/reviews`, {
    rating: rating.value,
    comment: comment.value,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });

  alert('Đánh giá thành công');
  emit('submitted');
  close();
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
</style>