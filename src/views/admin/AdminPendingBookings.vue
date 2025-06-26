<template>
  <div class="container py-5">
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

    <div v-if="filteredBookings.length > 0" class="table-responsive">
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
          <tr v-for="(booking, index) in filteredBookings" :key="booking.id">
            <td>{{ index + 1 }}</td>
            <td>{{ booking.Name || '---' }}</td>
            <td>Phòng {{ booking.room.roomId }}</td>
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
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-muted text-center">Không có đơn nào đang chờ duyệt.</div>

    <div v-if="zoomedImage" class="image-modal" @click.self="zoomedImage = null">
      <img :src="zoomedImage" class="zoomed-img" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/config';

const bookings = ref([]);
const searchQuery = ref('');
const zoomedImage = ref(null);

function formatDate(dateStr) {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleString('vi-VN');
}

function formatCurrency(value) {
  if (!value) return '0 đ';
  return Number(value).toLocaleString('vi-VN') + ' đ';
}

function zoomImage(url) {
  zoomedImage.value = url;
}

function loadBookings() {
  axios.get('/bookings/pending')
    .then(res => bookings.value = res.data.data)
    .catch(err => {
      console.error('Không có đơn chờ duyệt:', err);
      bookings.value = [];
    });
}

function approve(id) {
  const token = localStorage.getItem('accessToken');
  if (!token) return alert('Vui lòng đăng nhập');

  axios.put(`/bookings/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(() => {
      alert('Đã duyệt thành công');
      loadBookings();
    })
    .catch(err => {
      console.error('Lỗi duyệt:', err);
      alert('Không thể duyệt đơn này');
    });
}

// ✅ Tìm kiếm theo nhiều trường
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
</style>