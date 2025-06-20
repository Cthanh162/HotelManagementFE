<!-- RoomList.vue -->
<template>
  <div class="container py-4">
     <base-toast ref="toastRef" />
    <div class="row">
      <!-- Filter Sidebar -->
      <div class="col-md-3">
        <div class="card p-3">
          <h5 class="mb-3">Tìm Kiếm</h5>
          <div class="mb-3">
            <label class="form-label">Ngày Nhận Phòng</label>
            <input type="datetime-local" v-model="search.checkIn" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Ngày Trả Phòng</label>
            <input type="datetime-local" v-model="search.checkOut" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">TIỆN NGHI</label>
            <div v-for="amenity in amenities" :key="amenity" class="form-check">
              <input class="form-check-input" type="checkbox" :id="amenity" :value="amenity" v-model="search.selectedAmenities" />
              <label class="form-check-label" :for="amenity">{{ amenity }}</label>
            </div>
          </div>
          <button class="btn btn-primary w-100" @click="fetchRooms">Tìm kiếm</button>
        </div>
      </div>

      <!-- Room List -->
      <div class="col-md-9">
        <div class="row g-4">
          <div v-for="room in rooms" :key="room.roomId" class="col-12">
            <div
              class="card p-3 d-flex flex-row align-items-center justify-content-between flex-wrap"
              style="min-height: 180px;"
            >
              <!-- Ảnh -->
              <img
                :src="room.roomImages[0]?.url || room.roomImages[0]"
                alt="Room"
                width="180"
                height="120"
                class="me-3 rounded object-fit-cover"
                style="flex-shrink: 0;"
              />

              <!-- Thông tin -->
              <div class="flex-grow-1 me-3" style="min-width: 220px;">
                <h5 class="mb-1">{{ room.roomName }}</h5>
                <p class="mb-1"><strong>Loại Phòng:</strong> {{ room.roomType || 'N/A' }}</p>
                <p class="mb-1"><strong>Tiện Nghi:</strong> Wifi, Điều Hoà, Tivi</p>
                <p class="mb-1"><strong>Khách Hàng:</strong> {{ room.adults }} Người Lớn - {{ room.children }} Trẻ Em</p>
              </div>

              <!-- Giá & nút -->
              <div class="text-end" style="min-width: 150px;">
                <p class="fw-bold">{{ Number(room.price).toLocaleString() }} VND mỗi đêm</p>
                <div class="d-grid gap-2">
                  <button class="btn btn-success btn-sm" @click="bookRoom(room.roomId)">Đặt Ngay</button>
                  <button class="btn btn-outline-secondary btn-sm" @click="viewDetails(room.roomId)">Chi Tiết</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="rooms.length === 0" class="text-center text-muted">Không có phòng nào.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from '@/config';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseToast from '@/components/BaseToast.vue';

const router = useRouter();
const rooms = ref([]);
const toastRef = ref(null);
const amenities = ['Wifi', 'Điều Hoà', 'Tivi', 'Spa', 'Máy Sưởi'];
const search = ref({ checkIn: '', checkOut: '', selectedAmenities: [] });

function fetchRooms() {
  axios.get('/rooms')
    .then(res => {
      rooms.value = res.data.data;
    })
    .catch(err => {
      console.error('Lỗi khi tải danh sách phòng:', err);
      toastRef.value.showToast('Lỗi khi tải phòng', 'error');
    });
}

function bookRoom(roomId) {
  // if (!search.value.checkIn || !search.value.checkOut) {
  //   toastRef.value.showToast('Vui lòng chọn ngày nhận và trả phòng', 'warning');
  //   return;
  // }
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('accessToken');
  console.log(token)
  if (!token) {
    toastRef.value.showToast('Bạn cần đăng nhập để đặt phòng', 'error');
    // router.push('/signin');
    return;
  }

  axios.post('/bookings', {
    roomId,
    userId: user.userId,
    checkinTime: search.value.checkIn.replace('T', ' ') + ':00',
    checkoutTime: search.value.checkOut.replace('T', ' ') + ':00',
    totalPrice: rooms.value.price
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(() => toastRef.value.showToast('Đặt phòng thành công', 'success'))
    .catch(err => {
      console.error('Lỗi khi đặt phòng:', err);
      toastRef.value.showToast('Đặt phòng thất bại', 'error');
    });
}

function viewDetails(roomId) {
  router.push(`/room/${roomId}`);
}

onMounted(fetchRooms);
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
</style>
