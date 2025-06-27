<template>
  <div class="container py-5" v-if="room">
    <div class="card shadow-sm p-4">
    <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />


      <!-- Header -->
        <h2 class="mb-2">{{ room.roomName }}</h2>
      <div class="d-flex justify-content-between align-items-start flex-wrap">
        <div>
          <p><strong>Loại phòng:</strong> {{ room.roomType }}</p>
          <p><strong>Trạng thái:</strong> {{ displayStatus(room.status) }}</p>
          <p><strong>Người lớn:</strong> {{ room.adults }}</p>
          <p><strong>Trẻ em:</strong> {{ room.children }}</p>
          <p><strong>Sức chứa:</strong> {{ room.capacity }}</p>
          <p><strong>Giá:</strong> {{ formatCurrency(room.price) }} VND / đêm</p>
          
        </div>
        <div class="text-end">
          <p style="text-align: left;"><strong>Khách sạn:</strong> {{ room.hotelId }}</p>
          <p style="text-align: left;"> <strong>Tầng:</strong> {{ room.floorId }}</p>
          <div v-if="services.length" class="mt-2 text-start">
            <p class="fw-bold mb-1">Dịch vụ đi kèm:</p>
            <ul class="mb-0 ps-3">
              <li v-for="s in services" :key="s.id">
                {{ s.name }} - {{ s.price ? formatCurrency(s.price) + ' VND' : 'Miễn phí' }}
              </li>
            </ul>
          </div>
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
              <!-- <input type="datetime-local" v-model="booking.checkinTime" class="form-control" required /> -->
             <input
                type="date"
                v-model="booking.checkinTime"
                class="form-control"
                :min="booking.checkinTime || minDate"
              />
            </div>
            <div class="col-md-6">
              <label>Ngày đi:</label>
              <input
                type="date"
                v-model="booking.checkoutTime"
                class="form-control"
                :min="booking.checkinTime || minDate"
                required
              />
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
          <router-link to="/rooms" class="btn btn-secondary" style="margin-left: 10px;">Quay lại</router-link>
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
import { ref, onMounted, computed,nextTick,watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/config';
import dayjs from 'dayjs';
// import BaseToast from '@/components/BaseToast.vue';
// const emit = defineEmits(['showToast']);
import ToastContainer from '@/components/Toast.vue';
const route = useRoute();
const router = useRouter();
const room = ref(null);
const reviews = ref([]);
const minDate = ref(new Date().toISOString().split("T")[0]);
// const toastRef = ref(null);
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
// const toastRef = ref(null);
const zoomedImage = ref(null);
const showReviewPopup = ref(false);
const services = ref([]);
const booking = ref({
  checkinTime: '',
  checkoutTime: '',
  guestName: '',
  phone: '',
  identityNumber: ''
});

watch(() => booking.value.checkinTime, (val) => {
  if (val && booking.value.checkoutTime) {
    const checkin = new Date(val);
    const checkout = new Date(booking.value.checkoutTime);
    if (checkout <= checkin) {
      const nextDay = new Date(checkin);
      nextDay.setDate(nextDay.getDate() + 1);
      booking.value.checkoutTime = nextDay.toISOString().split('T')[0];
    }
  }
});
const reviewForm = ref({ rating: '', des: '' });
// function validateCheckinTime() {
//   const selected = new Date(booking.value.checkin);
//   const now = new Date();

//   if (selected < now) {
//     toastRef.value?.showToast?.('Không được chọn giờ trong quá khứ', 'warning');
//     booking.value.checkin = now.toISOString().slice(0, 16);
//   }
// }
// function getCurrentMinDateTime() {
//   const now = new Date();
//   now.setSeconds(0, 0);
//   return now.toISOString().slice(0, 16);
// }
// watch(() => booking.value.checkin, (val) => {
//   const selectedDate = new Date(val);
//   const now = new Date();
//   const isToday =
//     selectedDate.getFullYear() === now.getFullYear() &&
//     selectedDate.getMonth() === now.getMonth() &&
//     selectedDate.getDate() === now.getDate();

//   // if (isToday) {
//   //   minDateTime.value = getCurrentMinDateTime();
//   // } else {
//   //   minDateTime.value = selectedDate.toISOString().slice(0, 16);
//   // }
// });
onMounted(async () => {
  const id = route.params.id;

  try {
    const res = await axios.get(`/rooms/${id}`);
    room.value = res.data.data;
  } catch (err) {
    console.error('Lỗi khi tải chi tiết phòng:', err);
    showToast('danger', 'Không thể tải thông tin phòng.');

    // alert('Không thể tải thông tin phòng.');
  }

  try {
    const res = await axios.get(`/reviews/${id}`);
    reviews.value = res.data.data;
  } catch (err) {
    console.error('Lỗi khi tải đánh giá:', err);
    // alert('Không thể tải đánh giá.');
  }

  if (route.query.review === '1') {
    showReviewPopup.value = true;
  }
  try {
  const res = await axios.get(`/rooms/${id}/services`);
  services.value = res.data.data || [];
} catch (err) {
  console.error('Lỗi khi lấy dịch vụ phòng:', err);
}
});

const totalPrice = computed(() => {
  if (!room.value || !booking.value.checkinTime || !booking.value.checkoutTime) return 0;

  const basePrice = Number(room.value.price);
  const checkin = dayjs(booking.value.checkinTime);
  const checkout = dayjs(booking.value.checkoutTime);

  const nights = checkout.startOf('day').diff(checkin.startOf('day'), 'day');
  const total = Math.max(nights, 1) * basePrice;

  return total;
});

function submitBooking() {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    showToast('warning', 'Vui lòng đăng nhập để đặt phòng.');

    return router.push('/signin');
  }

  const payload = {
    roomId: room.value.roomId,
    userId: user.userId,
    checkinTime: booking.value.checkinTime ,
    checkoutTime: booking.value.checkoutTime,
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
      // emit('showToast', 'success', 'Đặt phòng thành công');
    showToast('warning', 'Vui lòng đăng nhập để đặt phòng.');
      router.push(`/booking/${bookingId}/payment`);
    })
    .catch(err => {
      console.error('Lỗi khi đặt phòng:', err);
      const message = err.response?.data?.message || 'Đặt phòng thất bại.';
      showToast('warning', message);
      // alert(message);
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
function displayStatus(status) {
  switch (status) {
    case 'available':
      return 'Phòng có thể đặt';
    case 'booked':
      return 'Đã được đặt';
    default:
      return status;
  }
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