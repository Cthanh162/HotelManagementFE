<template>
  <div class="container py-5">
    <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

    <h4 class="mb-4">Danh sách đơn chờ duyệt thanh toán</h4>

    <!-- Search -->
    <div class="mb-3 text-end">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control w-auto d-inline-block"
        placeholder="Tìm kiếm..."
      />
    </div>

    <div v-if="paginatedBookings.length > 0" class="table-responsive">
      <table class="table table-bordered align-middle text-center">
        <thead class="table-light">
          <tr>
            <th>STT</th>
            <th>Khách hàng</th>
            <th>Phòng</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Giá</th>
            <th>Ảnh thanh toán</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(booking, index) in paginatedBookings" :key="booking.id" style="height: 170px;">
            <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
            <td>{{ booking.Name || '---' }}</td>
            <td>{{ booking.room.roomName }}</td>
            <td>{{ formatDate(booking.checkinTime) }}</td>
            <td>{{ formatDate(booking.checkoutTime) }}</td>
            <td>{{ formatCurrency(booking.totalPrice) }}</td>
            <td>
              <img
                v-if="booking.paymentProof"
                :src="booking.paymentProof"
                alt="payment"
                class="payment-img"
                @click="zoomImage(booking.paymentProof)"
              />
              <span v-else class="text-muted">Không có</span>
            </td>
            <td>
              <button class="btn btn-success btn-sm" @click="approve(booking.id)">Duyệt</button>
              <button class="btn btn-danger btn-sm ml" @click="reject(booking.id)">Từ chối</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-muted text-center">Không có đơn nào đang chờ duyệt.</div>

    <div v-if="zoomedImage" class="image-modal" @click.self="zoomedImage = null">
      <img :src="zoomedImage" class="zoomed-img" />
    </div>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">«</button>
        </li>

        <li v-for="page in visiblePages" :key="page" class="page-item"
            :class="{ active: page === currentPage, disabled: page === '...'}">
          <button v-if="page !== '...'" class="page-link" @click="currentPage = page">{{ page }}</button>
          <span v-else class="page-link">…</span>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">»</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import axios from '@/config';
import ToastContainer from '@/components/Toast.vue';

const toastAction = ref('');
const toastMessage = ref('');
const toastVisible = ref(false);

function showToast(action, message) {
  toastAction.value = '';
  toastVisible.value = false;
  toastMessage.value = '';

  nextTick(() => {
    toastAction.value = action;
    toastMessage.value = message;
    toastVisible.value = true;

    setTimeout(() => {
      toastVisible.value = false;
    }, 3000);
  });
}

const currentPage = ref(1);
const itemsPerPage = 5;
const token = localStorage.getItem('accessToken');
const bookings = ref([]);
const searchQuery = ref('');
const zoomedImage = ref(null);

// Format functions
function formatDate(dateStr) {
  if (!dateStr) return '---';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN');
}

function formatCurrency(value) {
  if (!value) return '0 đ';
  return Number(value).toLocaleString('vi-VN') + ' đ';
}

function zoomImage(url) {
  zoomedImage.value = url;
}

// API
function loadBookings() {
  axios.get('/bookings/pending', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      bookings.value = res.data.data;
      currentPage.value = 1;
    })
    .catch(err => {
      console.error('Không có đơn chờ duyệt:', err);
      bookings.value = [];
    });
}

function approve(id) {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    showToast('warning', 'Vui lòng đăng nhập!');
    return;
  }

  axios.put(`/bookings/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(() => {
      showToast('success', 'Đã duyệt thành công!');
      loadBookings();
    })
    .catch(err => {
      console.error('Lỗi duyệt:', err);
      showToast('danger', 'Duyệt thất bại!');
    });
}

function reject(id) {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    showToast('warning', 'Vui lòng đăng nhập!');
    return;
  }

  axios.put(`/bookings/${id}/reject`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(() => {
      showToast('success', 'Từ chối thành công!');
      loadBookings();
    })
    .catch(err => {
      console.error('Lỗi duyệt:', err);
      showToast('danger', 'Từ chối thất bại!');
    });
}

// Tìm kiếm và phân trang
const filteredBookings = computed(() => {
  if (!searchQuery.value) return bookings.value;
  const q = searchQuery.value.toLowerCase();

  return bookings.value.filter(b =>
    b.Name?.toLowerCase().includes(q) ||
    String(b.roomId)?.includes(q) ||
    formatDate(b.checkinTime).toLowerCase().includes(q) ||
    formatDate(b.checkoutTime).toLowerCase().includes(q) ||
    String(b.totalPrice)?.includes(q)
  );
});

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredBookings.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredBookings.value.length / itemsPerPage);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total);
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total);
    }
  }

  return pages;
});

watch(searchQuery, () => {
  currentPage.value = 1;
});

onMounted(loadBookings);
</script>

<style scoped>
.payment-img {
  width: 100px;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.zoomed-img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}
.ml {
  margin-left: 8px;
}
</style>