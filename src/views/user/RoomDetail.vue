<template>
  <div class="container py-5" v-if="room">
    <div class="card shadow-sm p-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-start flex-wrap">
        <div>
          <h2 class="mb-2">{{ room.roomName }}</h2>
          <p><strong>Loại phòng:</strong> {{ room.roomType }}</p>
          <p><strong>Trạng thái:</strong> {{ room.status }}</p>
          <p><strong>Người lớn:</strong> {{ room.adults }}</p>
          <p><strong>Trẻ em:</strong> {{ room.children }}</p>
          <p><strong>Sức chứa:</strong> {{ room.capacity }}</p>
          <p><strong>Giá:</strong> {{ formatCurrency(room.price) }} VND / đêm</p>
        </div>
        <div class="text-end">
          <p><strong>Khách sạn:</strong> {{ room.hotelId }}</p>
          <p><strong>Tầng:</strong> {{ room.floorId }}</p>
        </div>
      </div>

      <!-- Media -->
      <div class="row mt-4">
        <div class="col-md-6" v-if="room.roomVideo">
          <video controls width="100%">
            <source :src="room.roomVideo" type="video/mp4" />
          </video>
        </div>
        <div class="col-md-6">
          <div class="d-flex flex-wrap gap-2">
            <img
              v-for="(img, i) in room.roomImages"
              :key="i"
              :src="img.url || img"
              class="img-preview"
              @click="zoomImage(img.url || img)"
            />
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="mt-4">
        <h5 class="mb-2">Mô tả phòng</h5>
        <div v-html="room.description" class="text-muted" />
      </div>

      <!-- Booking -->
      <div class="mt-5">
        <h4 class="mb-3">Thuê phòng</h4>
        <form @submit.prevent="submitBooking">
          <div class="row mb-3">
            <div class="col-md-6">
              <label>Ngày đến:</label>
              <input type="datetime-local" v-model="booking.checkinTime" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label>Ngày đi:</label>
              <input type="datetime-local" v-model="booking.checkoutTime" class="form-control" required />
            </div>
          </div>

          <div class="mb-3">
            <label>Họ tên:</label>
            <input type="text" v-model="booking.guestName" class="form-control" required />
          </div>
          <div class="mb-3">
            <label>Số điện thoại:</label>
            <input type="text" v-model="booking.phone" class="form-control" required />
          </div>
          <div class="mb-3">
            <label>CCCD:</label>
            <input type="text" v-model="booking.identityNumber" class="form-control" required />
          </div>

          <div class="mb-3">
            <p><strong>Giá tạm tính:</strong> {{ totalPrice.toLocaleString() }} VND</p>
          </div>

          <button class="btn btn-primary">Đặt phòng</button>
        </form>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="zoomedImage" class="image-modal" @click.self="zoomedImage = null">
      <img :src="zoomedImage" class="zoomed" />
    </div>

    <!-- Review Popup -->
    <div v-if="showReviewPopup" class="review-overlay" @click.self="showReviewPopup = false">
      <div class="review-box">
        <h5 class="mb-3">Đánh giá phòng</h5>
        <form @submit.prevent="submitReview">
          <label class="form-label">Chọn điểm đánh giá (1 - 5):</label>
          <select v-model="reviewForm.rating" class="form-select mb-3" required>
            <option disabled value="">-- Chọn điểm --</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>

          <label class="form-label">Nhận xét:</label>
          <textarea class="form-control mb-3" rows="3" v-model="reviewForm.des" required></textarea>

          <button class="btn btn-primary" type="submit">Gửi đánh giá</button>
        </form>
      </div>
    </div>

    <!-- Reviews -->
    <div class="mt-5">
      <h4 class="mb-3">Đánh giá phòng</h4>
      <div v-if="reviews.length === 0" class="text-muted">Chưa có đánh giá nào.</div>
      <div v-else class="review-box border p-3 rounded mb-3" v-for="review in reviews" :key="review.id">
        <div class="d-flex align-items-center mb-2">
          <div class="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-2" style="width: 40px; height: 40px;">
            {{ review.user?.userName?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div>
            <strong>{{ review.user?.userName || 'Người dùng' }}</strong><br />
            <small class="text-muted">{{ formatDate(review.createdAt) }}</small>
          </div>
        </div>
        <div class="mb-1">
          <span class="text-warning" v-for="i in review.rating" :key="i">★</span>
          <span class="text-muted" v-for="i in (5 - review.rating)" :key="i + 5">☆</span>
        </div>
        <p class="mb-0">{{ review.des }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/config';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const room = ref(null);
const reviews = ref([]);
const zoomedImage = ref(null);
const showReviewPopup = ref(false);

const booking = ref({
  checkinTime: '',
  checkoutTime: '',
  guestName: '',
  phone: '',
  identityNumber: ''
});

const reviewForm = ref({ rating: '', des: '' });

onMounted(async () => {
  const id = route.params.id;

  try {
    const res = await axios.get(`/rooms/${id}`);
    room.value = res.data.data;
  } catch (err) {
    console.error('Lỗi khi tải chi tiết phòng:', err);
    alert('Không thể tải thông tin phòng.');
  }

  try {
    const res = await axios.get(`/reviews/${id}`);
    reviews.value = res.data.data;
  } catch (err) {
    console.error('Lỗi khi tải đánh giá:', err);
    alert('Không thể tải đánh giá.');
  }

  if (route.query.review === '1') {
    showReviewPopup.value = true;
  }
});

const totalPrice = computed(() => {
  if (!room.value || !booking.value.checkinTime || !booking.value.checkoutTime) return 0;

  const basePrice = room.value.price;
  let total = 0;

  const checkin = dayjs(booking.value.checkinTime);
  const checkout = dayjs(booking.value.checkoutTime);
  let standardCheckin = checkin.startOf('day').add(14, 'hour');
  let standardCheckout = checkout.startOf('day').add(12, 'hour').add(1, 'day');

  if (checkin.isAfter(standardCheckin)) standardCheckin = standardCheckin.add(1, 'day');
  if (checkout.isBefore(standardCheckout)) standardCheckout = standardCheckout.subtract(1, 'day');

  const days = Math.max(0, standardCheckout.diff(standardCheckin, 'day'));
  total += days * basePrice;

  const earlyHour = standardCheckin.diff(checkin, 'hour');
  if (checkin.isBefore(standardCheckin)) {
    if (earlyHour >= 5 && earlyHour < 9) total += basePrice * 0.5;
    else if (earlyHour >= 0 && earlyHour < 5) total += basePrice * 0.3;
  }

  const lateHour = checkout.diff(standardCheckout, 'hour');
  if (checkout.isAfter(standardCheckout)) {
    if (lateHour > 0 && lateHour <= 3) total += basePrice * 0.3;
    else if (lateHour > 3 && lateHour <= 6) total += basePrice * 0.5;
    else if (lateHour > 6) total += basePrice;
  }

  return Math.round(total);
});

function submitBooking() {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    alert('Vui lòng đăng nhập để đặt phòng.');
    return router.push('/signin');
  }

  const payload = {
    roomId: room.value.roomId,
    userId: user.userId,
    checkinTime: booking.value.checkinTime.replace('T', ' ') + ':00',
    checkoutTime: booking.value.checkoutTime.replace('T', ' ') + ':00',
    totalPrice: totalPrice.value,
    Name: booking.value.guestName,
    phone: booking.value.phone,
    cccd: booking.value.identityNumber
  };

  axios.post('/bookings', payload, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      const bookingId = res.data.data.id;
      router.push(`/booking/${bookingId}/payment`);
    })
    .catch(err => {
      console.error('Lỗi khi đặt phòng:', err);
      const message = err.response?.data?.message || 'Đặt phòng thất bại.';
      alert(message);
    });
}

function submitReview() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('Vui lòng đăng nhập để đánh giá.');
    return;
  }

  axios.post('/reviews', {
    roomId: room.value.roomId,
    rating: reviewForm.value.rating,
    des: reviewForm.value.des
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(() => {
      alert('Đánh giá thành công.');
      showReviewPopup.value = false;
      reviewForm.value.rating = '';
      reviewForm.value.des = '';
      return axios.get(`/reviews/${room.value.roomId}`);
    })
    .then(res => reviews.value = res.data.data || [])
    .catch(err => {
      console.error('Lỗi khi gửi đánh giá:', err);
      const message = err.response?.data?.message || 'Không thể gửi đánh giá.';
      alert(message);
    });
}

function zoomImage(url) {
  zoomedImage.value = url;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('vi-VN');
}

function formatCurrency(val) {
  if (!val) return '0';
  return Number(val).toLocaleString('vi-VN');
}
</script>

<style scoped>
.img-preview {
  width: 48%;
  height: 140px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 4px;
}
.image-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
}
.zoomed {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(255,255,255,0.5);
}
.review-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.review-box {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
}
</style>