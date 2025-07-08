<template>
  <div class="container py-4">
    <ToastContainer v-if="toastVisible" :action="toastAction" :message="toastMessage" />

    <h4 class="mb-3">Đánh Giá</h4>

    <div class="d-flex justify-content-between mb-3">
      <div>
        <button class="btn btn-sm btn-primary me-1" @click="markAllAsRead">✔️ Đánh dấu tất cả đã đọc</button>
        <button class="btn btn-danger" @click="deleteAll">🗑️ Xoá tất cả</button>
      </div>
      <div class="mb-3 text-end">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control w-auto d-inline-block"
          placeholder="Tìm kiếm..."
        />
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle">
        <thead class="table-light text-center">
          <tr>
            <th>STT</th>
            <th>Tên Phòng</th>
            <th>Tên Khách Hàng</th>
            <th>Đánh Giá</th>
            <th>Nhận Xét</th>
            <th>Ngày</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(review, index) in filteredReviews"
            :key="review.id"
            :class="{ 'table-active': !review.isRead }"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ review.room?.roomName || '---' }}</td>
            <td>{{ review.user?.userName || '---' }}</td>
            <td>{{ review.rating }}</td>
            <td>{{ review.des }}</td>
            <td>{{ formatDate(review.createdAt) }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" @click="markAsRead(review.id)">
                Đánh dấu là đã đọc
              </button>
              <button class="btn btn-sm btn-danger" @click="deleteReview(review.id)">
                Xoá
              </button>
            </td>
          </tr>
          <tr v-if="reviews.length === 0">
            <td colspan="7" class="text-muted text-center">Không có đánh giá nào.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal xác nhận -->
    <ConfirmModal
      v-if="showConfirmModal"
      :message="confirmMessage"
      @confirm="handleConfirm"
      @close="showConfirmModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import axios from '@/config';
import ToastContainer from '@/components/Toast.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';

// Toast
const toastAction = ref('');
const toastMessage = ref('');
const toastVisible = ref(false);

function showToast(action, message) {
  toastAction.value = '';
  toastMessage.value = '';
  toastVisible.value = false;

  nextTick(() => {
    toastAction.value = action;
    toastMessage.value = message;
    toastVisible.value = true;
    setTimeout(() => {
      toastVisible.value = false;
    }, 3000);
  });
}

// State
const reviews = ref([]);
const searchQuery = ref('');

// Modal confirm
const showConfirmModal = ref(false);
const confirmMessage = ref('');
const confirmAction = ref(null);

function openConfirmModal(message, action) {
  confirmMessage.value = message;
  confirmAction.value = action;
  showConfirmModal.value = true;
}

function handleConfirm() {
  showConfirmModal.value = false;
  if (confirmAction.value) confirmAction.value();
}

// LocalStorage: trạng thái đã đọc
function loadReadStatusFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('readReviews') || '[]');
  } catch {
    return [];
  }
}

function saveReadStatusToStorage(ids) {
  localStorage.setItem('readReviews', JSON.stringify(ids));
}

// Load dữ liệu
function loadReviews() {
  axios.get('/reviews')
    .then(res => {
      const readIds = loadReadStatusFromStorage();
      reviews.value = res.data.data.map(r => ({
        ...r,
        isRead: readIds.includes(r.id)
      }));
    })
    .catch(err => {
      console.error('Lỗi khi tải reviews:', err);
      reviews.value = [];
    });
}

// Xử lý xoá
function deleteReview(id) {
  openConfirmModal('Bạn có chắc chắn muốn xoá đánh giá này?', async () => {
    try {
      await axios.delete(`/reviews/${id}`);
      reviews.value = reviews.value.filter(r => r.id !== id);
      const readIds = loadReadStatusFromStorage().filter(rid => rid !== id);
      saveReadStatusToStorage(readIds);
      showToast('success', 'Xoá thành công!');
    } catch (err) {
      console.error('Xoá thất bại:', err);
      showToast('danger', 'Xoá thất bại!');
    }
  });
}

function deleteAll() {
  openConfirmModal('Bạn có chắc chắn muốn xoá TẤT CẢ đánh giá?', async () => {
    try {
      await Promise.all(reviews.value.map(r => axios.delete(`/reviews/${r.id}`)));
      reviews.value = [];
      localStorage.removeItem('readReviews');
      showToast('success', 'Xoá thành công!');
    } catch (err) {
      console.error('Lỗi xoá tất cả:', err);
      showToast('danger', 'Xoá thất bại!');
    }
  });
}

// Đánh dấu đã đọc
function markAsRead(id) {
  const review = reviews.value.find(r => r.id === id);
  if (review && !review.isRead) {
    review.isRead = true;
    const readIds = loadReadStatusFromStorage();
    if (!readIds.includes(id)) {
      readIds.push(id);
      saveReadStatusToStorage(readIds);
    }
  }
}

function markAllAsRead() {
  reviews.value = reviews.value.map(r => ({ ...r, isRead: true }));
  const allIds = reviews.value.map(r => r.id);
  saveReadStatusToStorage(allIds);
}

// Tìm kiếm
const filteredReviews = computed(() => {
  if (!searchQuery.value) return reviews.value;
  const q = searchQuery.value.toLowerCase();

  return reviews.value.filter(b =>
    b.room.roomName?.toLowerCase().includes(q) ||
    b.user.userName?.toLowerCase().includes(q) ||
    String(b.rating)?.includes(q) ||
    b.des?.toLowerCase().includes(q) ||
    formatDate(b.createdAt).toLowerCase().includes(q)
  );
});

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

onMounted(loadReviews);
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
</style>