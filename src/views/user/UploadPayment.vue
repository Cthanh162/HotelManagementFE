<template>
  <div class="container py-5" style="background-color: #fff; min-height: 100vh" v-if="booking">
         <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

    <div class="row">
      <!-- Left: Bank Info & Upload + QR -->
      <div class="col-md-7">
  <!-- Dòng chứa thông tin ngân hàng và mã QR -->
  <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
    <div>
      <h5 class="mb-3">1. Tài khoản ngân hàng</h5>
      <p><strong>Tên tài khoản:</strong> NGUYEN CHI THANH</p>
      <p><strong>Số tài khoản:</strong> 8881602038888</p>
      <p><strong>Ngân hàng:</strong> MB</p>
      <div class="mt-1">
        <strong>Thời gian giữ chỗ còn lại:</strong>
        <span class="text-danger fw-bold">{{ countdown }}</span>
      </div>
    </div>

    <!-- QR code bên phải -->
    <div class="text-center padding1">
      <p class="fw-bold mb-2">Quét mã QR để thanh toán:</p>
      <img
        src="../../assets/img/qr.jpeg"
        alt="QR Code"
        class="img-fluid"
        style="max-width: 180px;"
      />
    </div>
  </div>

  <!-- Upload -->
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
    <button class="btn btn-primary" @click="confirmUpload" >Xác nhận</button>
    <button class="btn btn-danger" @click="cancelBooking">Xác nhận huỷ</button>
  </div>
</div>

      <!-- Right: Booking Info -->
      <div class="col-md-5">
        <div class="card bg-white text-dark p-3 shadow-sm">
          <h5 class="mb-3">Thông tin đặt phòng</h5>
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
      <h5 class="fw-bold mb-2">ChiThanhHotel</h5>
      <p class="mb-1">Số 46 Phạm Ngọc Thạch , Trung Tự , Đống Đa , Hà Nội</p>

      <div class="d-flex flex-wrap justify-content-center gap-3">
        <span>Điện thoại: <strong>+84 965540033</strong></span>
        <span>• Fax: <strong>+84 965540033</strong></span>
        <span>• Email: <a href="mailto:chithanh1622003@gmail.com">chithanh1622003@gmail.com</a></span>
      </div>

      <div class="mt-3">
        <a href="#" class="me-3 text-dark fs-4"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="text-dark fs-4"><i class="fab fa-instagram"></i></a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted,nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/config';

const emit = defineEmits(['showToast']);
import ToastContainer from '@/components/Toast.vue';
const route = useRoute();
const router = useRouter();
const bookingId = route.params.bookingId;

const fileInput = ref(null);
const booking = ref(null);
const selectedFile = ref(null);
const previewImage = ref(null);
const toastAction = ref('');
const toastMessage = ref('');
const toastVisible = ref(false);
const showCancelPopup = ref(false);
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
const countdown = ref('5:00');
let timer = null;
let secondsLeft = 300;

function startCountdown() {
  timer = setInterval(() => {
    secondsLeft--;
    const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const seconds = (secondsLeft % 60).toString().padStart(2, '0');
    countdown.value = `${minutes}:${seconds}`;

    if (secondsLeft <= 0) {
      clearInterval(timer);
      axios.post(`/bookings/${bookingId}/outTime`)
      showToast('warning', 'Hết thời gian giữ phòng. Bạn sẽ được chuyển về trang phòng.');

      if (booking.value?.room.roomId) {
      setTimeout(() => {
        router.push(`/room/${booking.value.room.roomId}`);
      }, 2000);
        
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
async function cancelBooking() {
  try {
    await axios.post(`/bookings/${bookingId}/cancel-payment`);
    showToast('success', 'Huỷ thanh toán thành công');
    showCancelPopup.value = false;

    const roomId = booking.value?.room?.roomId;
    if (roomId) {
      setTimeout(() => {
        router.push(`/room/${roomId}`);
      }, 1500);
      // router.push(`/room/${roomId}`);
    }
  } catch (err) {
    console.error('Lỗi huỷ thanh toán:', err);
    showToast('danger', 'Huỷ thanh toán thất bại');
  }
}
function confirmUpload() {
   if (!selectedFile.value) {
      showToast('warning', 'Yêu cầu upload ảnh thanh toán');
    // alert('Yêu cầu upload ảnh thanh toán');
    return;
  }

  const formData = new FormData();
  formData.append('paymentProof', selectedFile.value);

  axios.post(`/bookings/${bookingId}/upload-payment`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(() => {
      // alert('Tải ảnh thanh toán thành công');
      showToast('success', 'Tải ảnh thanh toán thành công');
      emit('showToast', 'success', 'Đặt phòng thành công');
      
      const roomId = booking.value?.room.roomId;
      if (roomId) {
        setTimeout(() => {
          router.push(`/room/${roomId}`);
        }, 1500);
        // router.push(`/room/${roomId}`);
      }
    })
    .catch(err => {
      console.error(err);
      showToast('danger', 'Tải ảnh thất bại');
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
    showToast('danger', 'Không tìm thấy bookingId!');
    // alert('Không tìm thấy bookingId!');
    return;
  }

  try {
    const res = await axios.get(`/bookings/${bookingId}`);
    booking.value = res.data?.data || null;
    startCountdown();
  } catch (err) {
    console.error('Lỗi khi tải booking:', err);
    showToast('danger', 'Không thể tải thông tin đơn phòng');

    // alert('Không thể tải thông tin đơn phòng');
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
.padding1{
  padding-right: 62px;
}
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
}
</style>