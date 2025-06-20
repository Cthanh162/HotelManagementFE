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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
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