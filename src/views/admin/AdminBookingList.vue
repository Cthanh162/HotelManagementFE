<template>
  <div class="container py-4">
    <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

    <h4 class="mb-4">Danh sách đặt phòng</h4>

    <div class="d-flex justify-content-between mb-3">
      <div></div>
      <input
        v-model="searchQuery"
        type="text"
        class="form-control form-control-sm w-auto"
        placeholder="Tìm kiếm..."
      />
    </div>

    <table class="table table-bordered table-hover align-middle text-center w-100">
      <thead class="table-light">
        <tr>
          <th>STT</th>
          <th>Khách hàng</th>
          <th>Phòng</th>
          <th>Ngày đến</th>
          <th>Ngày đi</th>
          <th>Trạng thái</th>
          <th>Thanh toán</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(booking, index) in paginatedBookings" :key="booking.id">
          <td>{{ index + 1 + (currentPage - 1) * entriesPerPage }}</td>
          <td>{{ booking.Name }}</td>
          <td>{{ booking.room?.roomName || '---' }}</td>
          <td>{{ formatDate(booking.checkinTime) }}</td>
          <td>{{ formatDate(booking.checkoutTime) }}</td>
          <td>{{ statusLabel(booking.status) }}</td>
          <td>{{ paymentLabel(booking.paymentStatus) }}</td>
          <td>
            <button class="btn btn-sm btn-primary me-1" @click="editBooking(booking.id)">Cập nhật</button>
            <button class="btn btn-sm btn-warning" @click="viewBooking(booking.id)">Chi tiết</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <nav>
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="currentPage--">«</a>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="currentPage++">»</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
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
    setTimeout(() => { toastVisible.value = false; }, 3000);
  });
}

const router = useRouter();
const bookings = ref([]);
const searchQuery = ref('');
const entriesPerPage = ref(10);
const currentPage = ref(1);

const token = localStorage.getItem('accessToken');

onMounted(() => {
  if (!token) {
    router.push('/signin');
    return;
  }

  axios.get('/bookings', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      bookings.value = res.data.data || [];
    })
    .catch(err => {
      showToast('danger', 'Lỗi khi tải danh sách đặt phòng');
      console.error(err);
    });
});

const filteredBookings = computed(() => {
  let list = bookings.value;
  const q = searchQuery.value.toLowerCase();

  if (q) {
    list = list.filter(b =>
      b.Name?.toLowerCase().includes(q) ||
      b.phone?.toLowerCase().includes(q) ||
      b.cccd?.toLowerCase().includes(q) ||
      b.room?.roomName?.toLowerCase().includes(q) ||
      formatDate(b.checkinTime).includes(q) ||
      formatDate(b.checkoutTime).includes(q) ||
      statusLabel(b.status).toLowerCase().includes(q) ||
      paymentLabel(b.paymentStatus).toLowerCase().includes(q)
    );
  }

  // Sắp xếp ưu tiên
  return list.sort((a, b) => {
    const now = new Date();
    const scoreA =
      (a.status === 'pending_payment' ? 100 : 0) +
      (a.paymentStatus !== 'paid' ? 10 : 0) +
      (new Date(a.checkoutTime) > now ? 1 : 0);
    const scoreB =
      (b.status === 'pending_payment' ? 100 : 0) +
      (b.paymentStatus !== 'paid' ? 10 : 0) +
      (new Date(b.checkoutTime) > now ? 1 : 0);
    return scoreB - scoreA;
  });
});

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value;
  return filteredBookings.value.slice(start, start + entriesPerPage.value);
});

const totalPages = computed(() =>
  Math.ceil(filteredBookings.value.length / entriesPerPage.value)
);

function formatDate(dateStr) {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

function statusLabel(status) {
  switch (status) {
    case 'pending_payment': return 'Chờ xác nhận';
    case 'confirmed': return 'Đã xác nhận';
    case 'cancelled': return 'Đã huỷ';
    case 'completed': return 'Đã trả phòng';
    case 'timeout': return 'Hết thời gian';
    case 'reject': return 'Từ chối';
    default: return '---';
  }
}

function paymentLabel(status) {
  switch (status) {
    case 'pending_approval': return 'Chờ duyệt';
    case 'pending': return 'Chưa thanh toán';
    case 'timeout': return 'Hết hạn';
    case 'paid': return 'Đã thanh toán';
    case 'cancelled': return 'Đã huỷ';
    case 'reject': return 'Từ chối';
    default: return '---';
  }
}

function editBooking(id) {
  router.push(`/admin/bookings/${id}/edit`);
}

function viewBooking(id) {
  router.push(`/admin/bookings/${id}`);
}
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
  white-space: nowrap;
}
.table td:nth-child(2),
.table td:nth-child(3),
.table td:nth-child(4),
.table td:nth-child(5) {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.form-control-sm.w-auto {
  min-width: 180px;
}
</style>
