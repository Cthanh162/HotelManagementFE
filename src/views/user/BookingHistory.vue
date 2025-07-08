<template>
  <div class="container py-5">
    <ToastContainer v-if="toastVisible" :action="toastAction" :message="toastMessage" />

    <h3 class="mb-4">Lịch sử đặt phòng</h3>

    <div v-if="bookings.length === 0" class="text-muted text-center">
      Bạn chưa có lịch sử đặt phòng nào.
    </div>

    <div v-else class="row row-cols-1 row-cols-md-2 g-4">
      <div class="col" v-for="booking in bookings" :key="booking.id">
        <div class="card shadow-sm h-100">
          <div class="row g-0">
            <div class="col-md-5">
              <img
                :src="booking.room?.roomImages?.[0]?.url || booking.room?.roomImages?.[0] || 'https://via.placeholder.com/300x200'"
                class="img-fluid rounded-start object-fit-cover w-100"
                style="height: 350px"
              />
            </div>
            <div class="col-md-7">
              <div class="card-body">
                <h5 class="card-title">{{ booking.room?.roomName }}</h5>
                <p class="card-text"><strong>Loại:</strong> {{ booking.room?.roomType.name }}</p>
                <p class="card-text"><strong>Ngày đến:</strong> {{ formatDate(booking.checkinTime) }}</p>
                <p class="card-text"><strong>Ngày đi:</strong> {{ formatDate(booking.checkoutTime) }}</p>
                <p class="card-text"><strong>Trạng thái:</strong> {{ statusLabel(booking.status) }}</p>
                <p class="card-text"><strong>Tổng tiền:</strong> {{ formatCurrency(booking.totalPrice) }}</p>
                <button class="btn btn-outline-primary btn-sm mt-2" @click="viewDetail(booking.id)">
                  Xem chi tiết
                </button>
                <button
                  class="btn btn-outline-danger btn-sm mt-2 ms-2"
                  v-if="booking.status !== 'cancelled' && booking.paymentStatus !== 'paid' && booking.status !== 'timeout'"
                  @click="openConfirmPopup(booking)"
                >
                  Huỷ đặt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <ConfirmModal
      v-if="showConfirmModal"
      @confirm="handleConfirmCancel"
      @close="showConfirmModal = false"
    />
  </div>

  <!-- Footer -->
  <footer class="bg-light text-center text-muted mt-5 py-4 border-top">
    <div class="container">
      <h5 class="fw-bold mb-2">ChiThanhHotel</h5>
      <p class="mb-1">Số 46 Phạm Ngọc Thạch, Trung Tự, Đống Đa, Hà Nội</p>
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
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/config';
import dayjs from 'dayjs';
import ToastContainer from '@/components/Toast.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';

const bookings = ref([]);
const toastAction = ref('');
const toastMessage = ref('');
const toastVisible = ref(false);
const router = useRouter();

const showConfirmModal = ref(false);
const bookingToCancel = ref(null);

function showToast(action, message) {
  toastAction.value = '';
  toastMessage.value = '';
  toastVisible.value = false;

  nextTick(() => {
    toastAction.value = action;
    toastMessage.value = message;
    toastVisible.value = true;
    setTimeout(() => {
      toastVisible.value = false;
    }, 3000);
  });
}

function openConfirmPopup(booking) {
  bookingToCancel.value = booking;
  showConfirmModal.value = true;
}

async function handleConfirmCancel() {
  showConfirmModal.value = false;
  if (!bookingToCancel.value) return;

  const booking = bookingToCancel.value;
  const today = dayjs().startOf('day');
  const checkinDate = dayjs(booking.checkinTime).startOf('day');
  const diffDays = checkinDate.diff(today, 'day');

  if (diffDays < 3) {
    showToast('warning', 'Không thể hủy đặt phòng. Liên hệ với khách sạn để huỷ phòng');
    return;
  }

  try {
    const token = localStorage.getItem('accessToken');
    await axios.put(`/bookings/${booking.id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    showToast('success', 'Huỷ đặt phòng thành công!');

    const user = JSON.parse(localStorage.getItem('user'));
    const res = await axios.get(`/bookings/user/${user.userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    bookings.value = res.data.data;
  } catch (err) {
    console.error('Lỗi huỷ đặt phòng:', err);
    showToast('danger', 'Có lỗi xảy ra khi huỷ đặt phòng.');
  }
}

function viewDetail(id) {
  router.push(`/booking/${id}/detail`);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('vi-VN');
}

function formatCurrency(val) {
  if (!val) return '0 đ';
  return Number(val).toLocaleString('vi-VN') + ' đ';
}

function statusLabel(status) {
  switch (status) {
    case 'pending_payment': return 'Chờ xác nhận';
    case 'confirmed': return 'Đã xác nhận';
    case 'cancelled': return 'Đã huỷ';
    case 'completed': return 'Đã trả phòng';
    case 'timeout': return 'Hết thời gian thanh toán';
    case 'reject': return 'Từ chối thanh toán';
    default: return status;
  }
}

onMounted(async () => {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !token) return;

  try {
    const res = await axios.get(`/bookings/user/${user.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    bookings.value = res.data.data;
  } catch (err) {
    console.error('Lỗi khi lấy lịch sử:', err);
  }
});
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
</style>