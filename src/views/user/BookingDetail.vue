<template>
  <div class="container py-5" v-if="booking">
    <h3 class="mb-4">Chi tiết đơn đặt phòng</h3>

    <div class="card shadow-sm">
      <div class="row g-0">
        <div class="col-md-5">
          <img
            :src="booking.room?.roomImages?.[0]?.url || booking.room?.roomImages?.[0] || 'https://via.placeholder.com/300x200'"
            class="img-fluid rounded-start object-fit-cover"
          />
        </div>
        <div class="col-md-7">
          <div class="card-body">
            <h4 class="card-title">{{ booking.room?.roomName }}</h4>
            <p><strong>Loại phòng:</strong> {{ booking.room?.roomType }}</p>
            <p><strong>Sức chứa:</strong> {{ booking.room?.capacity }}</p>
            <p><strong>Giá:</strong> {{ formatCurrency(booking.room?.price) }} / đêm</p>
            <p><strong>Ngày nhận phòng:</strong> {{ formatDate(booking.checkinTime) }}</p>
            <p><strong>Ngày trả phòng:</strong> {{ formatDate(booking.checkoutTime) }}</p>
            <p><strong>Khách hàng:</strong> {{ booking.Name }}</p>
            <p><strong>SĐT:</strong> {{ booking.phone }}</p>
            <p><strong>CCCD:</strong> {{ booking.cccd }}</p>
            <p><strong>Trạng thái:</strong> {{ statusLabel(booking.status) }}</p>
            <p><strong>Tổng tiền:</strong> {{ formatCurrency(booking.totalPrice) }}</p>

            <div v-if="booking.paymentProof">
              <p><strong>Ảnh thanh toán:</strong></p>
              <img :src="booking.paymentProof" alt="Payment Proof" class="img-thumbnail" style="max-width: 300px" />
            </div>

            <router-link to="/user/bookings" class="btn btn-secondary mt-3">Quay lại lịch sử</router-link>
            <!-- Đánh giá -->
            <div v-if="booking.status === 'confirmed' && !hasReviewed">
              <button class="btn btn-outline-success mt-3" @click="showReviewForm = !showReviewForm">
                {{ showReviewForm ? 'Đóng form' : 'Đánh giá phòng' }}
              </button>

              <div v-if="showReviewForm" class="mt-3">
                <label class="form-label">Số sao (1-5):</label>
                <select class="form-select mb-2" v-model="review.rating" required>
                  <option disabled value="">-- Chọn --</option>
                  <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>

                <label class="form-label">Nhận xét:</label>
                <textarea class="form-control mb-2" v-model="review.des" rows="3" required></textarea>

                <button class="btn btn-primary" @click="submitReview">Gửi đánh giá</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-5">Đang tải thông tin đơn đặt phòng...</div>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from '@/config';

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
    alert('Đánh giá thành công!');
    hasReviewed.value = true;
    showReviewForm.value = false;
  }).catch(err => {
    console.error('Lỗi khi đánh giá:', err);
    alert('Không thể gửi đánh giá');
  });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('vi-VN');
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
  height: 100%;
}
</style>