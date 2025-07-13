<template>
  <div class="container py-5" v-if="booking">
    <ToastContainer v-if="toastVisible" :action="toastAction" :message="toastMessage" />

    <h3 class="mb-4">Chi tiết đơn đặt phòng</h3>

    <div class="card shadow-sm p-4">
      <div class="grid-layout">
        <!-- Ảnh phòng -->
        <div>
          <img
            :src="booking.room?.roomImages?.[0]?.url || booking.room?.roomImages?.[0] || 'https://via.placeholder.com/300x200'"
            alt="Ảnh phòng"
            class="img-fluid rounded object-fit-cover w-100 h-100"
            style="object-fit: cover"
          />
        </div>

        <!-- Thông tin -->
        <div>
          <p><strong>Tên phòng:</strong> {{ booking.room?.roomName }}</p>
          <p><strong>Loại:</strong> {{ booking.room?.roomType }}</p>
          <p><strong>Sức chứa:</strong> {{ booking.room?.capacity }}</p>
          <p><strong>Giá:</strong> {{ formatCurrency(booking.room?.price) }} / đêm</p>
          <p><strong>Ngày đến:</strong> {{ formatDate(booking.checkinTime) }}</p>
          <p><strong>Ngày đi:</strong> {{ formatDate(booking.checkoutTime) }}</p>
          <p><strong>Khách:</strong> {{ booking.Name }}</p>
          <p><strong>Điện thoại:</strong> {{ booking.phone }}</p>
          <p><strong>CCCD:</strong> {{ booking.cccd }}</p>
          <p><strong>Trạng thái:</strong> {{ statusLabel(booking.status) }}</p>
          <p><strong>Tổng tiền:</strong> {{ formatCurrency(booking.totalPrice) }}</p>
        </div>

        <!-- Ảnh thanh toán -->
        <div>
          <p><strong>Ảnh thanh toán:</strong></p>
          <img
            v-if="booking.paymentProof"
            :src="booking.paymentProof"
            alt="Payment Proof"
            class="payment-img"
            @click="zoomImage(booking.paymentProof)"
          />
          <p v-else class="text-muted">Chưa có ảnh</p>
        </div>

        <!-- Các nút -->
        <div>
          <router-link to="/bookings/history" class="btn btn-secondary me-2">Quay lại</router-link>
            <button class="btn btn-outline-success" @click="showReviewForm = !showReviewForm">
              {{ showReviewForm ? 'Đóng form' : 'Đánh giá phòng' }}
            </button>
          <!-- Đánh giá -->
          <div v-if="['confirmed', 'completed'].includes(booking.status) && !hasReviewed" class="mt-3">
           

            <div v-if="showReviewForm" class="mt-2">
              <label class="form-label">Số sao (1-5):</label>
              <select class="form-select mb-2" v-model="review.rating">
                <option disabled value="">-- Chọn --</option>
                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
              </select>

              <label class="form-label">Nhận xét:</label>
              <textarea class="form-control mb-2" v-model="review.des" rows="3"></textarea>

              <button class="btn btn-primary" @click="submitReview">Gửi đánh giá</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-5">Đang tải thông tin đơn đặt phòng...</div>
 <div v-if="zoomedImage" class="image-modal" @click.self="zoomedImage = null">
      <img :src="zoomedImage" class="zoomed-img" />
    </div>
  <!-- Footer -->
  <footer class="bg-light text-center text-muted mt-5 py-4 border-top">
    <div class="container">
      <h5 class="fw-bold mb-2">ChiThanhHotel</h5>
      <p class="mb-1">Số 46 Phạm Ngọc Thạch, Trung Tự, Đống Đa, Hà Nội</p>
      <div class="d-flex justify-content-center gap-3 flex-wrap">
        <span>Điện thoại: <strong>+84 965540033</strong></span>
        <span>• Email: <a href="mailto:chithanh1622003@gmail.com">chithanh1622003@gmail.com</a></span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from '@/config';
import ToastContainer from '@/components/Toast.vue';
import { nextTick } from 'vue';
const zoomedImage = ref(null);

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
function zoomImage(url) {
  zoomedImage.value = url;
}
const booking = ref(null);
const hasReviewed = ref(false);
const showReviewForm = ref(false);
const review = ref({ rating: '', des: '' });
const route = useRoute();
const bookingId = route.params.id;

onMounted(async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const res = await axios.get(`/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    booking.value = res.data.data;
console.log('Booking status:', booking.value.status);
    const roomId = booking.value.room?.roomId;
    console.log(roomId)
    const userId = JSON.parse(localStorage.getItem('user'))?.userId;
    const reviewRes = await axios.get(`/reviews/${roomId}`);
    hasReviewed.value = reviewRes.data.data.some(r => r.user?.userId === userId);
  } catch (err) {
    console.error('Lỗi khi tải chi tiết đặt phòng hoặc đánh giá:', err);
  }
});

function submitReview() {
  const token = localStorage.getItem('accessToken');
  axios.post('/reviews', {
    roomId: booking.value.room.roomId,
    rating: review.value.rating,
    des: review.value.des
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(() => {
    showToast('success', 'Đánh giá thành công!');

    hasReviewed.value = true;
    showReviewForm.value = false;
  }).catch(err => {
    console.error('Lỗi khi đánh giá:', err);
    showToast('success', 'Không thể gửi đánh giá');

  });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN');
}



function formatCurrency(val) {
  return Number(val || 0).toLocaleString('vi-VN') + ' đ';
}

function statusLabel(status) {
  switch (status) {
    case 'pending_payment': return 'Chờ thanh toán';
    case 'confirmed': return 'Đã xác nhận';
    case 'cancelled': return 'Đã huỷ';
    case 'completed': return 'Đã trả phòng';
    default: return status;
  }
}
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
  /* height: 100%; */
}
.grid-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 cột */
  grid-template-rows: repeat(2, auto); /* 2 hàng */
  gap: 20px;
}
.object-fit-cover {
  object-fit: cover;
}
.payment-img {
  width: 380px;
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