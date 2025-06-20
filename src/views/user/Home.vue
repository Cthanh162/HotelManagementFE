<template>
  <div>
    <!-- Banner Full Width -->
    <div class="banner">
      <div class="banner-overlay container">
        <h1 class="banner-title">
          Chào mừng bạn đến với <span class="highlight">CHITHANHHOTEL</span>
        </h1>
        <p class="banner-subtitle">Dịch vụ cho thuê phòng khách sạn sang trọng</p>

        <!-- Search Bar -->
        <div class="search-bar row g-2">
          <div class="col-md-3">
            <input type="text" v-model="searchQuery" class="form-control" placeholder="Từ khoá tìm kiếm" />
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model="filters.roomType">
              <option value="">Chọn loại phòng</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
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
            <button class="btn btn-danger px-4" @click="showSearchResults = true">Tìm kiếm</button>
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
            <div class="rating">★★★★☆ {{ room.viewCount || 0 }} lượt xem</div>
            <p class="price">Giá: {{ Number(room.price).toLocaleString() }} VND</p>
            <router-link :to="`/room/${room.roomId}`" class="view-details">Xem chi tiết</router-link>
          </div>
        </div>

        <div class="text-center mt-3">
          <button class="btn btn-outline-primary me-2" :disabled="searchPage <= 1" @click="searchPage--">←</button>
          <button class="btn btn-outline-primary" :disabled="searchPage >= totalPages" @click="searchPage++">→</button>
        </div>
      </section>

      <!-- Phòng nổi bật -->
     <section class="rooms-section">
        <h2>Phòng có lượt xem nhiều</h2>
        <div class="room-grid">
          <div class="room-card" v-for="room in popularRooms" :key="room.roomId">
            <img :src="room.roomImages?.[0]?.url || room.roomImages?.[0] || 'https://via.placeholder.com/300x200'" class="room-thumb" />
            <h3>{{ room.roomName }}</h3>
            <div class="rating">★★★★☆ {{ room.viewCount || 0 }} lượt xem</div>
            <p class="price">Giá: {{ Number(room.price).toLocaleString() }} VND</p>
            <router-link :to="`/room/${room.roomId}`" class="view-details">Xem chi tiết</router-link>
          </div>
        </div>
      </section>

      <!-- Phòng giá rẻ -->
      <section class="rooms-section">
        <h2>Phòng giá rẻ</h2>
        <div class="room-grid">
          <div class="room-card" v-for="room in discountRooms" :key="room.roomId">
            <img :src="room.roomImages?.[0]?.url || room.roomImages?.[0] || 'https://via.placeholder.com/300x200'" class="room-thumb" />
            <h3>{{ room.roomName }}</h3>
            <div class="rating">★★★★☆ {{ room.viewCount || 0 }} lượt xem</div>
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
            <div class="rating">★★★★☆ {{ room.bookings_count || 0 }} lượt đặt</div>
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
            <div class="rating">★★★★★ {{ room.reviews_avg_rating?.toFixed(1) || 0 }}/5</div>
            <p class="price">Giá: {{ Number(room.price).toLocaleString() }} VND</p>
            <router-link :to="`/room/${room.roomId}`" class="view-details">Xem chi tiết</router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/config';

const allRooms = ref([]);
const popularRooms = ref([]);
const discountRooms = ref([]);
const mostBookedRooms = ref([]);
const topRatedRooms = ref([]);
const searchQuery = ref('');
const showSearchResults = ref(false);
const searchPage = ref(1);
const perPage = 3;

const filters = ref({
  roomType: '',
  capacity: '',
  minPrice: '',
  maxPrice: ''
});

onMounted(async () => {
  try {
    const [roomsRes, mostBookedRes, topRatedRes] = await Promise.all([
      axios.get('/rooms'),
      axios.get('/rooms/most-booked'),
      axios.get('/rooms/top-rated')
    ]);

    const rooms = roomsRes.data?.data || [];
    allRooms.value = rooms;
    popularRooms.value = [...rooms].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 3);
    discountRooms.value = [...rooms].sort((a, b) => a.price - b.price).slice(0, 3);
    mostBookedRooms.value = mostBookedRes.data?.data || [];
    topRatedRooms.value = topRatedRes.data?.data || [];
  } catch (err) {
    console.error('Lỗi khi tải danh sách phòng:', err);
  }
});

const filteredRooms = computed(() => {
  return allRooms.value.filter(room => {
    if (!room) return false;
    if (searchQuery.value && !room.roomName?.toLowerCase().includes(searchQuery.value.toLowerCase())) return false;
    if (filters.value.roomType && room.roomType !== filters.value.roomType) return false;
    if (filters.value.capacity && room.capacity !== Number(filters.value.capacity)) return false;
    if (filters.value.minPrice && Number(room.price) < filters.value.minPrice) return false;
    if (filters.value.maxPrice && Number(room.price) > filters.value.maxPrice) return false;
    return true;
  });
});

const totalPages = computed(() => Math.ceil(filteredRooms.value.length / perPage));

const paginatedRooms = computed(() => {
  const start = (searchPage.value - 1) * perPage;
  return filteredRooms.value.slice(start, start + perPage);
});
</script>

<style scoped>
.banner {
  background: url('https://via.placeholder.com/1600x500') no-repeat center center/cover;
  color: white;
  padding: 6rem 2rem 3rem;
  margin-bottom: 2rem;
  position: relative;
}
.banner-overlay {
  background: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  border-radius: 12px;
}
.banner-title {
  font-size: 2.8rem;
}
.highlight {
  color: #ffcc00;
}
.banner-subtitle {
  font-size: 1.2rem;
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
  color: #ff4d4d;
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