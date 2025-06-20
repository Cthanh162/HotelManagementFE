<template>
  <div class="container py-4">
    <h4 class="mb-3">Đánh Giá</h4>

    <div class="d-flex justify-content-between mb-3">
      <div>
        <button class="btn btn-dark me-2" @click="markAllAsRead">✔️ Đánh dấu tất cả đã đọc</button>
        <button class="btn btn-danger" @click="deleteAll">🗑️ Xoá tất cả</button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered align-middle text-center">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>Tên Phòng</th>
            <th>Tên Khách Hàng</th>
            <th>Đánh Giá</th>
            <th>Nhận Xét</th>
            <th>Ngày</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(review, index) in reviews" :key="review.id">
            <td>{{ index + 1 }}</td>
            <td>{{ review.room?.roomName || '---' }}</td>
            <td>{{ review.user?.userName || '---' }}</td>
            <td>{{ review.rating }}</td>
            <td>{{ review.des }}</td>
            <td>{{ formatDate(review.createdAt) }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" @click="markAsRead(review.id)">Đánh dấu là đã đọc</button>
              <button class="btn btn-sm btn-danger" @click="deleteReview(review.id)">Xoá</button>
            </td>
          </tr>
          <tr v-if="reviews.length === 0">
            <td colspan="7" class="text-muted">Không có đánh giá nào.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/config';

const reviews = ref([]);

function loadReviews() {
  axios.get('/reviews')
    .then(res => reviews.value = res.data.data)
    .catch(err => {
      console.error('Lỗi khi tải reviews:', err);
      reviews.value = [];
    });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

function deleteReview(id) {
  if (!confirm('Bạn có chắc chắn muốn xoá đánh giá này?')) return;
  axios.delete(`/reviews/${id}`)
    .then(() => {
      reviews.value = reviews.value.filter(r => r.id !== id);
    })
    .catch(err => {
      console.error('Xoá thất bại:', err);
    });
}

function deleteAll() {
  if (!confirm('Bạn có chắc chắn muốn xoá TẤT CẢ đánh giá?')) return;
  Promise.all(reviews.value.map(r => axios.delete(`/reviews/${r.id}`)))
    .then(loadReviews)
    .catch(err => console.error('Lỗi xoá tất cả:', err));
}

function markAsRead(id) {
  // Chức năng đánh dấu đã đọc: bạn có thể tùy ý thêm flag `isRead` nếu muốn
  alert(`Đã đánh dấu review #${id} là đã đọc`);
}

function markAllAsRead() {
  alert('Tất cả đánh giá đã được đánh dấu là đã đọc');
}

onMounted(loadReviews);
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
</style>