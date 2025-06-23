<template>
  <div class="container py-5">
    <h4 class="mb-4">Cập nhật thông tin Booking</h4>

    <div v-if="booking" class="card p-4 shadow-sm">
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Họ tên khách hàng</label>
          <input v-model="booking.Name" type="text" class="form-control" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Số điện thoại</label>
          <input v-model="booking.phone" type="text" class="form-control" />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">CCCD</label>
          <input v-model="booking.cccd" type="text" class="form-control" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Tổng tiền (VND)</label>
          <input v-model="booking.totalPrice" type="number" class="form-control" />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Trạng thái đơn</label>
          <select v-model="booking.status" class="form-select">
            <option value="pending_payment">Chờ xác nhận</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="CANCELLED">Đã huỷ</option>
          </select>
        </div>

        <div class="col-md-6">
          <label class="form-label">Thanh toán</label>
          <select v-model="booking.paymentStatus" class="form-select">
            <option value="pending">Chờ xác nhận</option>
            <option value="pending_payment">Chưa thanh toán</option>
            <option value="pending_approval">Đã thanh toán</option>
          </select>
        </div>
      </div>

      <div class="text-end">
        <button class="btn btn-secondary me-2" @click="goBack">Quay lại</button>
        <button class="btn btn-primary" @click="updateBooking">Cập nhật</button>
      </div>
    </div>

    <div v-else class="text-center text-muted">Đang tải thông tin booking...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/config';

const route = useRoute();
const router = useRouter();
const bookingId = route.params.id;
const booking = ref(null);

onMounted(() => {
  axios.get(`/bookings/${bookingId}`)
    .then(res => {
      booking.value = res.data.data;
    })
    .catch(err => {
      console.error('Lỗi khi lấy booking:', err);
      alert('Không thể tải dữ liệu booking');
    });
});

function updateBooking() {
  const token = localStorage.getItem('accessToken');

  const payload = {
    ...booking.value,
    roomId: booking.value.room?.roomId || booking.value.roomId // đảm bảo có roomId
  };

  axios.put(`/bookings/${bookingId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(() => {
      alert('Cập nhật thành công');
      router.push('/admin/bookings');
    })
    .catch(err => {
      console.error('Lỗi khi cập nhật:', err);
      alert('Cập nhật thất bại');
    });
}

function goBack() {
  router.push('/admin/bookings');
}
</script>

<style scoped>
label {
  font-weight: 500;
}
</style>