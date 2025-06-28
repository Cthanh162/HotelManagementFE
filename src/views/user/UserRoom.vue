<template>
  <div class="container py-4">
        <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

    <div class="row">
      <!-- Bộ lọc -->
      <div class="col-md-3">
        <div class="card p-3">
          <h5 class="mb-3">Tìm kiếm nâng cao</h5>

          <div class="mb-3">
            <label class="form-label">Từ khoá</label>
            <input type="text" v-model="search.q" class="form-control" placeholder="Nhập từ khoá..." />
          </div>

          <div class="mb-3">
            <label class="form-label">Loại phòng</label>
            <select class="form-select" v-model="search.roomType">
              <option value="">Tất cả</option>
              <option v-for="type in roomTypes" :key="type.id" :value="type.name">{{ type.name }}</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Sức chứa</label>
            <input type="number" class="form-control" v-model.number="search.capacity" placeholder="Sức chứa" />
          </div>

          <div class="mb-3">
            <label class="form-label">Giá từ</label>
            <select class="form-select" v-model.number="search.minPrice">
              <option value="">Không chọn</option>
              <option :value="1000000">1 triệu</option>
              <option :value="2000000">2 triệu</option>
              <option :value="3000000">3 triệu</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Giá đến</label>
            <select class="form-select" v-model.number="search.maxPrice">
              <option value="">Không chọn</option>
              <option :value="2000000">2 triệu</option>
              <option :value="3000000">3 triệu</option>
              <option :value="5000000">5 triệu</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Ngày nhận phòng</label>
            <!-- <input type="datetime-local" v-model="search.checkin" class="form-control" /> -->
            <input
              type="date"
              v-model="search.checkin"
              class="form-control"
              :min="minDate"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Ngày trả phòng</label>
            <input
              type="date"
              v-model="search.checkout"
              class="form-control"
              :min="search.checkin || minDate"
            />
          </div>

          <button class="btn btn-danger w-100" @click="fetchRooms">Tìm kiếm</button>
        </div>
      </div>

      <!-- Danh sách phòng -->
      <div class="col-md-9">
        <div class="row g-4">
          <div v-for="room in paginatedRooms" :key="room.roomId" class="col-12">
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
                <p class="mb-1"><strong>Loại Phòng:</strong> {{ room.roomType.name || 'N/A' }}</p>
                <p class="mb-1">
                  <strong>Tiện Nghi: </strong>
                  <span v-if="room.services?.length"> {{ room.services.map(s => s.name).join(', ') }}</span>
                  <span v-else class="text-muted">Không có</span>
                </p>
                <p class="mb-1"><strong>Khách Hàng:</strong> {{ room.adults }} Người Lớn - {{ room.children }} Trẻ Em</p>
              </div>

              <!-- Giá & nút -->
              <div class="text-end" style="max-width: 150px;">
                <p class="fw-bold">{{ Number(room.price).toLocaleString() }} VND</p>

                <div class="d-grid gap-2">
                  <button class="btn btn-success btn-sm" @click="viewDetails(room.roomId)">Đặt Ngay</button>
                  <button class="btn btn-outline-secondary btn-sm" @click="viewDetails(room.roomId)">Chi Tiết</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="rooms.length === 0" class="text-center text-muted">Không có phòng nào.</div>
        </div>
        <nav v-if="totalPages > 1" class="mt-4">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">«</button>
      </li>

      <li v-for="page in visiblePages" :key="page" class="page-item"
          :class="{ active: page === currentPage, disabled: page === '...'}">
        <button v-if="page !== '...'" class="page-link" @click="currentPage = page">{{ page }}</button>
        <span v-else class="page-link">…</span>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">»</button>
      </li>
    </ul>
  </nav>
      </div>
    </div> 
  </div>
  <!-- Footer -->
  <footer class="bg-light text-center text-muted mt-5 py-4 border-top">
    <div class="container">
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
import { ref, onMounted,watch,nextTick,computed } from 'vue';
import { useRouter } from 'vue-router';
// import BaseToast from '@/components/BaseToast.vue';
import ToastContainer from '@/components/Toast.vue';
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
}const currentPage = ref(1);
const itemsPerPage = 5;

const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return rooms.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(rooms.value.length / itemsPerPage);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total);
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total);
    }
  }

  return pages;
});
const router = useRouter();
const rooms = ref([]);
const allServices = ref([]);
const minDateTime = ref(getCurrentMinDateTime());
const now = new Date();
const tomorrow = new Date();
tomorrow.setDate(now.getDate() + 1);
const minDate = ref(new Date().toISOString().split("T")[0]);

const search = ref({
  q: '',
  roomType: '',
  capacity: '',
  minPrice: '',
  maxPrice: '',
  checkin: now.toISOString().slice(0, 16),
  checkout: tomorrow.toISOString().slice(0, 16)
});
watch(() => search.value.checkin, (val) => {
  if (val && search.value.checkout && new Date(search.value.checkout) <= new Date(val)) {
    const nextDay = new Date(val);
    nextDay.setDate(nextDay.getDate() + 1);
    search.value.checkout = nextDay.toISOString().split('T')[0];
  }
});
async function fetchRooms() {
  try {
    const params = {
      q: search.value.q,
      roomType: search.value.roomType,
      capacity: search.value.capacity,
      minPrice: search.value.minPrice,
      maxPrice: search.value.maxPrice,
      checkin: search.value.checkin,
      checkout: search.value.checkout
    };

    const res = await axios.get('/rooms/available', { params });
    rooms.value = res.data.data || [];
    currentPage.value = 1;
  } catch (err) {
    console.error('Lỗi khi tìm kiếm phòng:', err);
        showToast('danger', 'Lỗi khi tìm kiếm phòng!');

    // toastRef.value?.showToast?.('Không thể tìm kiếm phòng', 'error');
  }
}
function getCurrentMinDateTime() {
  const now = new Date();
  now.setSeconds(0, 0);
  return now.toISOString().slice(0, 16);
}
watch(() => search.value.checkin, (val) => {
  const selectedDate = new Date(val);
  const now = new Date();
  const isToday =
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate();

  if (isToday) {
    minDateTime.value = getCurrentMinDateTime();
  } else {
    minDateTime.value = selectedDate.toISOString().slice(0, 16);
  }
});
async function fetchRoomTypes() {
  try {
    const res = await axios.get('/room-types');
    roomTypes.value = res.data?.data || [];
  } catch (err) {
    console.error('Lỗi khi tải loại phòng:', err);
  }
}

const roomTypes = ref([]);

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
  fetchRoomTypes();
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