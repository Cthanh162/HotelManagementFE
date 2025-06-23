<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-title">Quản trị</div>
      <ul>
        <li><router-link to="/admin/revenue" exact-active-class="active">Thống kê</router-link></li>
        <li><router-link to="/admin/rooms" exact-active-class="active">Quản lý phòng</router-link></li>
        <!-- <li><router-link to="/admin/floors" exact-active-class="active">Quản lý loại phòng</router-link></li> -->
        <li><router-link to="/admin/bookings" exact-active-class="active">Quản lý đặt phòng</router-link></li>
        <li><router-link to="/admin/bookings/pending" exact-active-class="active">Danh sách chờ duyệt thanh toán</router-link></li>
        <li><router-link to="/admin/floors" exact-active-class="active">Quản lý Tầng</router-link></li>
        <li><router-link to="/admin/user" exact-active-class="active">Quản lý thông tin khách hàng</router-link></li>
        <li><router-link to="/admin/reviews" exact-active-class="active">Quản lý Đánh giá</router-link></li>
        <li><router-link to="/admin/services" exact-active-class="active">Quản lý dịch vụ</router-link></li>
        <li><router-link to="/admin/roomType" exact-active-class="active">Quản lý loại phòng</router-link></li>
      </ul>
    </aside>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 220px;
  background-color: #007bff;
  color: white;
  padding: 1rem;
}
.sidebar-title {
  font-weight: bold;
  margin-bottom: 1rem;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin-bottom: 1rem;
}
.sidebar a {
  color: white;
  text-decoration: none;
  display: block;
  padding: 0.5rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.sidebar a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.sidebar a.active {
  background-color: rgba(255, 255, 255, 0.4);
  font-weight: bold;
}
.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f5f5f5;
  overflow-y: auto;
}
</style>