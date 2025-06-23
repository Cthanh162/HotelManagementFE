<template>
  <div class="container py-5">
    <div v-if="booking" class="card shadow-sm p-4">
      <h3 class="mb-4">Chi tiết đơn đặt phòng</h3>
      <div class="row">
        <div class="col-md-6">
          <p><strong>Mã đơn:</strong> #{{ booking.id }}</p>
          <p><strong>Tên khách:</strong> {{ booking.Name }}</p>
          <p><strong>Số điện thoại:</strong> {{ booking.phone }}</p>
          <p><strong>CCCD:</strong> {{ booking.cccd }}</p>
          <p><strong>Phòng:</strong> {{ booking.room?.roomName || '---' }}</p>
          <p><strong>Ngày đến:</strong> {{ formatDate(booking.checkinTime) }}</p>
          <p><strong>Ngày đi:</strong> {{ formatDate(booking.checkoutTime) }}</p>
        </div>
        <div class="col-md-6">
          <p><strong>Trạng thái:</strong> {{ booking.status }}</p>
          <p><strong>Thanh toán:</strong> {{ booking.paymentStatus }}</p>
          <p><strong>Giá:</strong> {{ formatCurrency(booking.totalPrice) }}</p>
          <p><strong>Ngày tạo:</strong> {{ formatDate(booking.created_at) }}</p>
          <p><strong>Ảnh thanh toán:</strong></p>
          <img
            v-if="booking.paymentProof"
            :src="booking.paymentProof"
            alt="Payment Proof"
            class="img-thumbnail"
            style="max-width: 250px"
          />
          <div v-else class="text-muted">Chưa có</div>
        </div>
      </div>
      <div class="mt-4">
        <router-link :to="`/admin/bookings/${booking.id}/edit`" class="btn btn-primary">
          Cập nhật đơn
        </router-link>
        <router-link to="/admin/bookings" class="btn btn-secondary ms-2">
          Quay lại danh sách
        </router-link>
        <button
          v-if="booking.status === 'confirmed' && booking.paymentStatus === 'paid'"
          @click="handleCheckout"
          class="btn btn-success ms-2"
        >
          Checkout
        </button>
      </div>
    </div>
    <div v-else class="text-center text-muted">Đang tải dữ liệu...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from '@/config';

const route = useRoute();
const booking = ref(null);
const id = route.params.id;

onMounted(() => {
  axios.get(`/bookings/${id}`)
    .then(res => booking.value = res.data.data)
    .catch(err => console.error('Lỗi khi tải chi tiết:', err));
});

function formatDate(val) {
  return val ? new Date(val).toLocaleString('vi-VN') : '---';
}

function formatCurrency(val) {
  return Number(val || 0).toLocaleString('vi-VN') + ' đ';
}
// const router = useRouter();

function handleCheckout() {
  if (!confirm('Xác nhận checkout đơn này?')) return;

  axios.put(`/bookings/${booking.value.id}/checkout`)
    .then(res => {
      alert(res.data.message || 'Checkout thành công!');
      booking.value.status = 'completed'; // Cập nhật trạng thái tại UI
    })
    .catch(err => {
      const msg = err.response?.data?.message || 'Lỗi khi checkout.';
      alert(msg);
    });
}
</script>

<style scoped>
.img-thumbnail {
  border: 1px solid #ccc;
  padding: 4px;
  background-color: #f9f9f9;
}
</style>