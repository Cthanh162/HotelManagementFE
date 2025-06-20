<template>
  <div>
    <header class="user-header">
      <nav class="nav-bar">
        <div class="logo">Hotel</div>
        <ul class="nav-links">
          <li><router-link to="/">Trang chủ</router-link></li>
          <li><router-link to="/about">Giới thiệu</router-link></li>
          <!-- <li><router-link to="/booking">Đặt Phòng</router-link></li> -->
          <li><router-link to="/rooms">Phòng trống</router-link></li>
         <li> <router-link to="/bookings/history">Lịch sử đặt phòng</router-link></li>
          <li><router-link to="/contact">Liên hệ</router-link></li>
        </ul>

        <div v-if="user" class="user-menu" @click="dropdownOpen = !dropdownOpen">
          <span class="username">{{ user.userName }}</span>
          <div v-if="dropdownOpen" class="dropdown">
            <a href="#" @click.prevent="logout">Đăng xuất</a>
          </div>
        </div>
        <router-link v-else to="/signin" class="login-button">Đăng nhập</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref(null);
const dropdownOpen = ref(false);

onMounted(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
  }
});

function logout() {
  localStorage.clear();
  user.value = null;
  router.push('/signin');
}
</script>

<style scoped>
.user-header {
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
}
.logo {
  font-weight: bold;
  font-size: 1.5rem;
}
.nav-links {
  list-style: none;
  display: flex;
  gap: 2.5rem;
  margin: 0;
  padding: 0;
  flex-wrap: nowrap;
  align-items: center;
}
.nav-links li a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}
.login-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-decoration: none;
}
.user-menu {
  position: relative;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  font-weight: 500;
}
.username {
  font-weight: 500;
}
.dropdown {
  position: absolute;
  top: 110%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  padding: 0.5rem;
  min-width: 120px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-radius: 4px;
  z-index: 1000;
}
.dropdown a {
  display: block;
  color: #333;
  text-decoration: none;
  padding: 5px 10px;
}
.dropdown a:hover {
  background-color: #f0f0f0;
}
</style>