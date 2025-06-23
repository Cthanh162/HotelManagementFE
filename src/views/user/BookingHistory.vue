<template>
  <div class="container py-5">
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
                <p class="card-text"><strong>Loại:</strong> {{ booking.room?.roomType }}</p>
                <p class="card-text"><strong>Ngày đến:</strong> {{ formatDate(booking.checkinTime) }}</p>
                <p class="card-text"><strong>Ngày đi:</strong> {{ formatDate(booking.checkoutTime) }}</p>
                <p class="card-text"><strong>Trạng thái:</strong> {{ statusLabel(booking.status) }}</p>
                <p class="card-text"><strong>Tổng tiền:</strong> {{ formatCurrency(booking.totalPrice) }}</p>
                <button class="btn btn-outline-primary btn-sm mt-2" @click="viewDetail(booking.id)">
                  Xem chi tiết
                </button>
                <button
                  class="btn btn-outline-danger btn-sm mt-2 ms-2"
                  v-if="booking.status !== 'cancelled'"
                  @click="cancelBooking(booking)">
                  Huỷ đặt
                </button>
              </div>
            </div>
          </div>
        </div>
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
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs'; // dùng để so sánh ngày
import axios from '@/config';
import { useRouter } from 'vue-router';

const bookings = ref([]);
const router = useRouter();

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
async function cancelBooking(booking) {
  const today = dayjs();
  const checkinDate = dayjs(booking.checkinTime);
  const diffDays = checkinDate.diff(today, 'day');
console.log(diffDays)
  if (diffDays < 3) {
    alert('Không thể hủy đặt phòng. Liên hệ với khách sạn để huỷ phòng');
    return;
  }

  const confirmCancel = confirm('Bạn có chắc chắn muốn hủy đặt phòng này?');
  if (!confirmCancel) return;

  try {
    const token = localStorage.getItem('accessToken');
    await axios.put(`/bookings/${booking.id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Huỷ đặt phòng thành công!');
    // Reload lại danh sách
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await axios.get(`/bookings/user/${user.userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    bookings.value = res.data.data;
  } catch (err) {
    console.error('Lỗi huỷ đặt phòng:', err);
    alert('Có lỗi xảy ra khi huỷ đặt phòng.');
  }
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
}
</style>