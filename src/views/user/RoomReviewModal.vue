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
   <!-- Footer -->
<footer class="bg-light text-center text-muted mt-5 py-4 border-top">
  <div class="container">
    <!-- <hr class="mb-3" style="width: 60px; border-top: 3px solid #444;" /> -->

    <h5 class="fw-bold mb-2">ChiThanhHotel</h5>
    <p class="mb-1">Số 46 Phạm Ngọc Thạch , Trung Tự , Đống Đa ,Hà Nội , Điện thoại</p>

    <div class="d-flex flex-wrap justify-content-center gap-3">
      <span>Điện thoại: <strong>+84 965540033</strong></span>
      <span>• Fax: <strong>+84 965540033</strong></span>
      <span>• Email: <a href="mailto:mhres.hanjw.reservation@marriott.com">chithanh1622003@gmail.com</a></span>
    </div>

    <div class="mt-3">
      <a href="#" class="me-3 text-dark fs-4"><i class="fab fa-facebook-f"></i></a>
      <a href="#" class="text-dark fs-4"><i class="fab fa-instagram"></i></a>
    </div>
  </div>
</footer>
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