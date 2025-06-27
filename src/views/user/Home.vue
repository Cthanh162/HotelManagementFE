<template>
  <div>
    <!-- Banner Full Width -->
         <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

    <div class="banner">
      <div class="banner-overlay container">
        <h1 class="banner-title">
          <span class="text-light">Chào mừng bạn đến với</span>
          <span class="highlight">ChiThanhHotel</span>
        </h1>
        <p class="banner-subtitle">Dịch vụ cho thuê phòng khách sạn sang trọng</p>

        <!-- Search Bar -->
        <div class="search-bar row g-2 mt-4 justify-content-center">
          <div class="col-md-3">
            <input type="text" v-model="searchQuery" class="form-control" placeholder="Từ khoá tìm kiếm" />
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model="filters.roomType">
              <option value="">Chọn loại phòng</option>
               <option v-for="type in roomTypes" :key="type.id" :value="type.name">
    {{ type.name }}
  </option>
            </select>
          </div>
          <div class="col-md-2">
            <input type="number" v-model.number="filters.capacity" class="form-control" placeholder="Sức chứa" />
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model.number="filters.minPrice">
              <option value="">Giá từ</option>
              <option :value="1000000">1 triệu</option>
              <option :value="2000000">2 triệu</option>
              <option :value="3000000">3 triệu</option>
            </select>
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model.number="filters.maxPrice">
              <option value="">Giá đến</option>
              <option :value="2000000">2 triệu</option>
              <option :value="3000000">3 triệu</option>
              <option :value="5000000">5 triệu</option>
            </select>
          </div>
          <div class="row mt-3">
            <div class="col-12 text-center">
              <button class="btn btn-danger px-5 py-2" @click="handleSearch">Tìm kiếm</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="home-container">
      <!-- Kết quả tìm kiếm -->
      <section v-if="showSearchResults && filteredRooms.length > 0" class="rooms-section">
        <h2>Kết quả tìm kiếm</h2>
        <div class="room-grid">
          <div class="room-card" v-for="room in paginatedRooms" :key="room.roomId">
            <img :src="room.roomImages?.[0]?.url || room.roomImages?.[0] || 'https://via.placeholder.com/300x200'" class="room-thumb" />
            <h3>{{ room.roomName }}</h3>
            <div class="center-div">
             <div class="rating">
              <span v-html="renderStars(room.reviews_avg_rating)"></span>
            </div>
            <p class="price">Giá: {{ Number(room.price).toLocaleString() }} VND</p>
            </div>
            <router-link :to="`/room/${room.roomId}`" class="view-details">Xem chi tiết</router-link>
          </div>
        </div>
      </section>
      <!-- Pagination -->
<nav v-if="showSearchResults && totalPages > 1" class="mt-4">
  <ul class="pagination justify-content-center">
    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">«</button>
    </li>

    <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: page === currentPage }">
      <button class="page-link" @click="currentPage = page">{{ page }}</button>
    </li>

    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">»</button>
    </li>
  </ul>
</nav>
<!-- <li v-for="page in visiblePages" :key="page" class="page-item"
    :class="{ active: page === currentPage, disabled: page === '...'}">
  <button v-if="page !== '...'" class="page-link" @click="currentPage = page">{{ page }}</button>
  <span v-else class="page-link">…</span>
</li> -->
      <!-- Phòng được đặt nhiều -->
      <section class="rooms-section margin-top" v-if="mostBookedRooms.length">
  <h2>Phòng được đặt nhiều</h2>
  <div class="room-grid">
    <div
      class="room-card"
      v-for="room in mostBookedRooms"
      :key="room.roomId"
    >
      <img
        :src="room.roomImages?.[0]?.url || room.roomImages?.[0] || 'https://via.placeholder.com/300x200'"
        class="room-thumb"
      />
      <h3>{{ room.roomName }}</h3>
      <div class="center-div">
        <div class="rating">{{ room.bookings_count || 0 }} lượt đặt</div>
        <p class="price">Giá: {{ Number(room.price).toLocaleString() }} VND</p>
      </div>
      <router-link :to="`/room/${room.roomId}`" class="view-details">
        Xem chi tiết
      </router-link>
    </div>
  </div>
</section>

      <!-- Phòng đánh giá cao -->
      <section v-if="topRatedRooms.length" class="rooms-section margin-top">
  <h2>Phòng đánh giá cao</h2>
  <div class="room-grid">
    <div
      v-for="room in topRatedRooms"
      :key="room.roomId"
      class="room-card"
    >
      <img
        :src="room.roomImages?.[0]?.url || room.roomImages?.[0] || 'https://via.placeholder.com/300x200'"
        class="room-thumb"
      />
      <h3>{{ room.roomName }}</h3>
      <div class="center-div">
        <div class="rating">
          <span v-html="renderStars(room.reviews_avg_rating)"></span>
        </div>
        <p class="price">Giá: {{ Number(room.price).toLocaleString() }} VND</p>
      </div>
      <router-link :to="`/room/${room.roomId}`" class="view-details">Xem chi tiết</router-link>
    </div>
  </div>
</section>
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
import { ref, onMounted,nextTick,computed } from 'vue';
import axios from '@/config';
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
}
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
const currentPage = ref(1);
const itemsPerPage = 6;

const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredRooms.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredRooms.value.length / itemsPerPage);
});
// const allRooms = ref([]);
const mostBookedRooms = ref([]);
const topRatedRooms = ref([]);
const filteredRooms = ref([]);
const searchQuery = ref('');
const showSearchResults = ref(false);
const roomTypes = ref([]);
const filters = ref({
  roomType: '',
  capacity: '',
  minPrice: '',
  maxPrice: ''
});

function renderStars(rating) {
  if (!rating) return '☆☆☆☆☆';
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function handleSearch() {
  axios.get('/rooms/search', {
    params: {
      q: searchQuery.value,
      roomType: filters.value.roomType,
      capacity: filters.value.capacity,
      minPrice: filters.value.minPrice,
      maxPrice: filters.value.maxPrice,
    }
  }).then(res => {
    filteredRooms.value = res.data.data || [];
    showSearchResults.value = true;
    console.log(filteredRooms.value)
    if (filteredRooms.value.length === 0) {
      showToast('warning', 'Không có dữ liệu phù hợp.');
    }

  }).catch(err => {
    console.error('Lỗi khi tìm kiếm:', err);
    showToast('danger', 'Lỗi khi tìm kiếm phòng!');
  });
}

onMounted(async () => {
  try {
    const [mostBookedRes, topRatedRes,roomTypesRes] = await Promise.all([
      axios.get('/rooms/most-booked'),
      axios.get('/rooms/top-rated'),
      axios.get('/room-types')
    ]);

    mostBookedRooms.value = mostBookedRes.data?.data || [];
    topRatedRooms.value = topRatedRes.data?.data || [];
    roomTypes.value = roomTypesRes.data?.data || [];
  } catch (err) {
    console.error('Lỗi khi tải danh sách phòng:', err);
  }
});
</script>

<style scoped>
.banner {
  background: url('@/assets/header.jpeg') no-repeat center center/cover;
  color: white;
  padding: 10rem 2rem 5rem;
  margin-bottom: 2rem;
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.banner-overlay {
  background: rgba(0, 0, 0, 0.4);
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
}
.center-div{
  display: flex;
  align-items: center;
}
.margin-top{
  margin-top: 20px;
}
.banner-title {
  font-size: 2.8rem;
  font-weight: bold;
}
.highlight {
  color: #ffc107;
  font-weight: 800;
}
.banner-subtitle {
  font-size: 1.2rem;
  color: #f8f9fa;
}
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
.rooms-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
}
.room-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: flex-start;
}

.room-card {
  width: calc(33.333% - 1rem);
  box-sizing: border-box;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.room-card:hover {
  transform: translateY(-5px);
}

.room-thumb {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.room-card h3 {
  margin: 0.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

.center-div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 0.5rem;
}

.rating,
.price {
  margin: 0.3rem 0;
}

.view-details {
  display: block;
  text-align: center;
  padding: 0.5rem;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin: 0.5rem;
}
.rating {
  color: #ffc107;
  margin: 0.5rem;
  /* font-size: 0.9rem; */
}
.price {
  font-weight: bold;
  color: #28a745;
  margin: 0.5rem;
}
.view-details {
  display: block;
  text-align: center;
  padding: 0.5rem;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin: 0.5rem;
}
.view-details:hover {
  background-color: #218838;
}
</style>
