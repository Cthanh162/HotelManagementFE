<template>
  <div class="container py-4">
    <base-toast ref="toastRef" />
    <div class="row">
      <!-- Bộ lọc -->
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
            <label class="form-label">Dịch vụ / Tiện nghi</label>
            <div v-for="item in allServices" :key="item.id" class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                :id="'service_' + item.id"
                :value="item.id"
                v-model="search.selectedServiceIds"
              />
              <label class="form-check-label" :for="'service_' + item.id">{{ item.name }}</label>
            </div>
          </div>

          <button class="btn btn-primary w-100" @click="fetchRooms">Tìm kiếm</button>
        </div>
      </div>

      <!-- Danh sách phòng -->
      <div class="col-md-9">
        <div class="row g-4">
          <div v-for="room in rooms" :key="room.roomId" class="col-12">
            <div class="card p-3 d-flex flex-row align-items-center justify-content-between flex-wrap" style="min-height: 180px;">
              <!-- Ảnh -->
              <img
                :src="room.roomImages?.[0]?.url || room.roomImages?.[0]"
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
                <p class="mb-1">
                  <strong>Tiện Nghi:</strong>
                  <span v-if="room.services?.length">{{ room.services.map(s => s.name).join(', ') }}</span>
                  <span v-else class="text-muted">Không có</span>
                </p>
                <p class="mb-1"><strong>Khách Hàng:</strong> {{ room.adults }} Người Lớn - {{ room.children }} Trẻ Em</p>
              </div>

              <!-- Giá & nút -->
              <div class="text-end" style="min-width: 150px;">
                <p class="fw-bold">{{ Number(room.price).toLocaleString() }} VND mỗi đêm</p>
                <div class="d-grid gap-2">
                  <button class="btn btn-success btn-sm" @click="viewDetails(room.roomId)">Đặt Ngay</button>
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
import axios from '@/config';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseToast from '@/components/BaseToast.vue';

const router = useRouter();
const toastRef = ref(null);
const rooms = ref([]);
const allServices = ref([]);
const search = ref({
  checkIn: '',
  checkOut: '',
  selectedServiceIds: [],
});

async function fetchRooms() {
  try {
    const params = {
      services: search.value.selectedServiceIds, // array of serviceId
      checkIn: search.value.checkIn,
      checkOut: search.value.checkOut,
    };
    const res = await axios.get('/rooms/search', { params });
    rooms.value = res.data.data || [];
  } catch (err) {
    console.error('Lỗi khi tải phòng:', err);
    toastRef.value.showToast('Không thể tải danh sách phòng', 'error');
  }
}

async function fetchServices() {
  try {
    const res = await axios.get('/services');
    allServices.value = res.data.data || [];
  } catch (err) {
    console.error('Lỗi khi tải dịch vụ:', err);
  }
}

function viewDetails(roomId) {
  router.push(`/room/${roomId}`);
}

onMounted(() => {
  fetchServices();
  fetchRooms();
});
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
footer a:hover {
  color: #007bff;
  text-decoration: none;
}
</style>