<template>
  <div>
    <!-- Banner Full Width -->
    <div class="banner">
      <div class="banner-overlay container">
        <h1 class="banner-title">
          <span class="text-light">Chào mừng bạn đến với</span>
          <span class="highlight">CHITHANHHOTEL</span>
        </h1>
        <p class="banner-subtitle">Dịch vụ cho thuê phòng khách sạn sang trọng</p>

        <!-- Search Bar -->
        <div class="search-bar row g-2 mt-4">
          <div class="col-md-3">
            <input type="text" v-model="searchQuery" class="form-control" placeholder="Từ khoá tìm kiếm" />
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model="filters.roomType">
              <option value="">Chọn loại phòng</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Luxury</option>
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
          <div class="col-md-1 text-end">
            <button class="btn btn-danger w-100" @click="handleSearch">Tìm kiếm</button>
          </div>
        </div>
      </div>
    </div>

    <div class="home-container">
      <!-- Kết quả tìm kiếm -->
      <section v-if="showSearchResults && filteredRooms.length > 0" class="rooms-section">
        <h2>Kết quả tìm kiếm</h2>
        <div class="room-grid">
          <div class="room-card" v-for="room in filteredRooms" :key="room.roomId">
            <img :src="room.roomImages?.[0]?.url || room.roomImages?.[0] || 'https://via.placeholder.com/300x200'" class="room-thumb" />
            <h3>{{ room.roomName }}</h3>
             <div class="rating">
              <span v-html="renderStars(room.reviews_avg_rating)"></span>
            </div>
            <p class="price">Giá: {{ Number(room.price).toLocaleString() }} VND</p>
            <router-link :to="`/room/${room.roomId}`" class="view-details">Xem chi tiết</router-link>
          </div>
        </div>
      </section>

      <!-- Phòng được đặt nhiều -->
      <section class="rooms-section">
        <h2>Phòng được đặt nhiều</h2>
        <div class="room-grid">
          <div class="room-card" v-for="room in mostBookedRooms" :key="room.roomId">
            <img :src="room.roomImages?.[0]?.url || room.roomImages?.[0] || 'https://via.placeholder.com/300x200'" class="room-thumb" />
            <h3>{{ room.roomName }}</h3>
            <div class="rating">{{ room.bookings_count || 0 }} lượt đặt</div>
            <p class="price">Giá: {{ Number(room.price).toLocaleString() }} VND</p>
            <router-link :to="`/room/${room.roomId}`" class="view-details">Xem chi tiết</router-link>
          </div>
        </div>
      </section>

      <!-- Phòng đánh giá cao -->
      <section class="rooms-section">
        <h2>Phòng đánh giá cao</h2>
        <div class="room-grid">
          <div class="room-card" v-for="room in topRatedRooms" :key="room.roomId">
            <img :src="room.roomImages?.[0]?.url || room.roomImages?.[0] || 'https://via.placeholder.com/300x200'" class="room-thumb" />
            <h3>{{ room.roomName }}</h3>
            <div class="rating">
              <span v-html="renderStars(room.reviews_avg_rating)"></span>
            </div>
            <p class="price">Giá: {{ Number(room.price).toLocaleString() }} VND</p>
            <router-link :to="`/room/${room.roomId}`" class="view-details">Xem chi tiết</router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/config';

// const allRooms = ref([]);
const mostBookedRooms = ref([]);
const topRatedRooms = ref([]);
const filteredRooms = ref([]);
const searchQuery = ref('');
const showSearchResults = ref(false);

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
  }).catch(err => {
    console.error('Lỗi khi tìm kiếm:', err);
  });
}

onMounted(async () => {
  try {
    const [mostBookedRes, topRatedRes] = await Promise.all([
      axios.get('/rooms/most-booked'),
      axios.get('/rooms/top-rated')
    ]);

    mostBookedRooms.value = mostBookedRes.data?.data || [];
    topRatedRooms.value = topRatedRes.data?.data || [];
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
.room-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background: white;
  transition: transform 0.3s;
}
.room-card:hover {
  transform: translateY(-5px);
}
.room-thumb {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.room-card h3 {
  font-size: 1.2rem;
  margin: 0.5rem;
  color: #333;
}
.rating {
  color: #ffc107;
  margin: 0.5rem;
  font-size: 0.9rem;
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
