<template>
  <div class="container py-5" style="background-color: #fff; min-height: 100vh" v-if="booking">
    <div class="row">
      <!-- Left: Bank Info & Upload -->
      <div class="col-md-7">
        <h5 class="mb-3">1. Tài khoản ngân hàng</h5>
        <p><strong>Tên tài khoản:</strong> Nguyen Chi Thanh</p>
        <p><strong>Số tài khoản:</strong> 8844472165</p>
        <p><strong>Ngân hàng:</strong> BIDV</p>

        <div class="mt-3">
          <strong>Thời gian giữ chỗ còn lại:</strong>
          <span class="text-danger fw-bold">{{ countdown }}</span>
        </div>

        <div class="upload-box text-center mt-4" @click="triggerFileUpload">
          <i class="fas fa-upload fa-2x mb-2"></i>
          <p>Nhấn để chọn ảnh thanh toán</p>
          <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" hidden />
        </div>

        <div v-if="previewImage" class="mt-3 text-center">
          <p class="fw-bold">Ảnh đã chọn:</p>
          <img :src="previewImage" alt="Ảnh thanh toán" class="img-thumbnail" style="max-width: 300px;" />
        </div>

        <div class="mt-3 text-center">
          <button class="btn btn-primary" @click="confirmUpload" :disabled="!selectedFile">Xác nhận</button>
        </div>
      </div>

      <!-- Right: Booking Info -->
      <div class="col-md-5">
        <div class="card bg-white text-dark p-3 shadow-sm">
          <div class="d-flex justify-content-between align-items-start">
            <h5 class="mb-3">Thông tin đặt phòng</h5>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?data=8844472165&size=100x100"
              alt="QR Code"
              style="width: 100px; height: 100px"
            />
          </div>

          <p><strong>Tên:</strong> {{ booking.Name || '---' }}</p>
          <p><strong>SĐT:</strong> {{ booking.phone || '---' }}</p>
          <p><strong>Mã đơn:</strong> #{{ booking.id }}</p>
          <p>
            <strong>Chi tiết đơn:</strong><br />
            Từ: {{ formatDate(booking.checkinTime) }}<br />
            Đến: {{ formatDate(booking.checkoutTime) }}
          </p>
          <p><strong>Tổng đơn:</strong> {{ formatCurrency(booking.totalPrice) }}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-5 text-muted">
    Đang tải thông tin đặt phòng...
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/config';

const route = useRoute();
const router = useRouter();
const bookingId = route.params.bookingId;

const fileInput = ref(null);
const booking = ref(null);
const selectedFile = ref(null);
const previewImage = ref(null);

const countdown = ref('5:00');
let timer = null;
let secondsLeft = 600;

function startCountdown() {
  timer = setInterval(() => {
    secondsLeft--;
    const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const seconds = (secondsLeft % 60).toString().padStart(2, '0');
    countdown.value = `${minutes}:${seconds}`;

    if (secondsLeft <= 0) {
      clearInterval(timer);
      alert('Hết thời gian giữ phòng. Bạn sẽ được chuyển về trang phòng.');
      if (booking.value?.roomId) {
        router.push(`/room/${booking.value.roomId}`);
      }
    }
  }, 1000);
}

function triggerFileUpload() {
  fileInput.value.click();
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  selectedFile.value = file;
  previewImage.value = URL.createObjectURL(file);
}

function confirmUpload() {
  if (!selectedFile.value) return;

  const formData = new FormData();
  formData.append('paymentProof', selectedFile.value);

  axios.post(`/bookings/${bookingId}/upload-payment`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(() => {
      alert('Tải ảnh thanh toán thành công');
      const roomId = booking.value?.roomId;
      if (roomId) {
        router.push(`/room/${roomId}`);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Tải ảnh thất bại');
    });
}

function formatDate(dateStr) {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleString('vi-VN');
}

function formatCurrency(val) {
  if (!val) return '0 đ';
  return Number(val).toLocaleString('vi-VN') + ' đ';
}

onMounted(async () => {
  if (!bookingId) {
    alert('Không tìm thấy bookingId!');
    return;
  }

  try {
    const res = await axios.get(`/bookings/${bookingId}`);
    booking.value = res.data?.data || null;
    startCountdown();
  } catch (err) {
    console.error('Lỗi khi tải booking:', err);
    alert('Không thể tải thông tin đơn phòng');
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.upload-box {
  border: 2px dashed #ccc;
  padding: 2rem;
  border-radius: 10px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.upload-box:hover {
  background-color: #f0f0f0;
}
</style>