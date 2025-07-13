<template>
  <div class="container py-5">
    <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

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
        <router-link :to="`/admin/bookings/${booking.id}/edit`" class="btn btn-primary">Cập nhật đơn</router-link>
        <router-link to="/admin/bookings" class="btn btn-secondary ms-2">Quay lại danh sách</router-link>
        <button
          v-if="booking.status === 'confirmed' && booking.paymentStatus === 'paid'"
          @click="handleCheckout"
          class="btn btn-success ms-2"
        >
          Checkout
        </button>
      </div>

      <!-- Modal nhập thời gian thực tế -->
      <div v-if="showTimeModal" class="modal-backdrop" @click.self="showTimeModal = false">
        <div class="modal-content">
          <h5>Nhập thời gian checkout thực tế</h5>
          <input type="datetime-local" v-model="actualCheckoutTime" class="form-control my-3" />
          <div class="text-end">
            <button class="btn btn-secondary me-2" @click="showTimeModal = false">Huỷ</button>
            <button class="btn btn-primary" @click="compareCheckoutTime">Xác nhận</button>
          </div>
        </div>
      </div>

      <!-- Modal hiển thị phụ thu -->
      <div v-if="showFeeModal" class="modal-backdrop" @click.self="showFeeModal = false">
        <div class="modal-content">
          <h5>Phụ thu trễ giờ</h5>
          <p>
            Checkout trễ {{ delayMinutes }} phút. Áp dụng phụ thu:
            <strong>{{ formatCurrency(lateFee) }}</strong>
          </p>
          <div class="text-end">
            <button class="btn btn-secondary me-2" @click="showFeeModal = false">Huỷ</button>
            <button class="btn btn-success" @click="sendCheckout(lateFee)">Xác nhận Checkout</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted">Đang tải dữ liệu...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/config';
import ToastContainer from '@/components/Toast.vue';

const toastAction = ref('');
const toastMessage = ref('');
const toastVisible = ref(false);

const booking = ref(null);
const route = useRoute();
const router = useRouter();
const id = route.params.id;

const showTimeModal = ref(false);
const showFeeModal = ref(false);
const actualCheckoutTime = ref(new Date().toISOString().slice(0, 16));
const lateFee = ref(0);
const delayMinutes = ref(0);

// ✅ Lấy token từ localStorage
const token = localStorage.getItem('accessToken');

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

function formatDate(val) {
  return val ? new Date(val).toLocaleString('vi-VN') : '---';
}

function formatCurrency(val) {
  return Number(val || 0).toLocaleString('vi-VN') + ' đ';
}

onMounted(() => {
  if (!token) {
    router.push('/signin');
    return;
  }

  axios.get(`/bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      booking.value = res.data.data;
      console.log(res.data); // ✅ dùng res để tránh eslint warning
    })
    .catch(err => {
      console.error('Lỗi khi tải chi tiết:', err);
      showToast('danger', 'Không tải được dữ liệu đơn!');
    });
});

function handleCheckout() {
  actualCheckoutTime.value = new Date().toISOString().slice(0, 16);
  showTimeModal.value = true;
}

function compareCheckoutTime() {
  const expected = new Date(booking.value.checkoutTime);
  const actual = new Date(actualCheckoutTime.value);
  const diffMs = actual - expected;
  delayMinutes.value = Math.floor(diffMs / 60000);

  if (delayMinutes.value > 10) {
    const hoursLate = Math.ceil(delayMinutes.value / 60);
    lateFee.value = hoursLate * 50000; // 50k mỗi giờ
    showFeeModal.value = true;
  } else {
    sendCheckout(0);
  }

  showTimeModal.value = false;
}

function sendCheckout(fee = 0) {
  axios.put(`/bookings/${booking.value.id}/checkout`, {
    actualCheckoutTime: actualCheckoutTime.value,
    lateFee: fee
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      console.log(res.data); // ✅ dùng res
      showToast('success', 'Checkout thành công!');
      booking.value.status = 'completed';
      showFeeModal.value = false;
    })
    .catch(err => {
      showToast('danger', 'Lỗi khi checkout!');
      console.log(err);
    });
}
</script>

<style scoped>
.img-thumbnail {
  border: 1px solid #ccc;
  padding: 4px;
  background-color: #f9f9f9;
}
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 6px;
  width: 400px;
  max-width: 90%;
}
</style>
