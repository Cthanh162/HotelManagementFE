<template>
  <div class="container py-4">
    <h4 class="mb-4">Danh sách booking</h4>

    <div class="d-flex justify-content-between mb-3">
      <div>
        <label>
          <select class="form-select form-select-sm" v-model="entriesPerPage" style="width: auto; display: inline-block;">
            <option value="5">5 entries per page</option>
            <option value="10">10 entries per page</option>
            <option value="20">20 entries per page</option>
          </select>
        </label>
      </div>
      <input v-model="searchQuery" type="text" class="form-control form-control-sm w-auto" placeholder="Search..." />
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle">
        <thead class="table-light text-center">
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
            <td class="text-center">{{ index + 1 + (currentPage - 1) * entriesPerPage }}</td>
            <td>{{ booking.Name }}</td>
            <td>Phòng {{ booking.room?.roomName || '---' }}</td>
            <td>{{ formatDate(booking.checkinTime) }}</td>
            <td>{{ formatDate(booking.checkoutTime) }}</td>
            <td>{{ statusLabel(booking.status) }}</td>
            <td>{{ paymentLabel(booking.paymentStatus) }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-primary me-1" @click="editBooking(booking.id)">Cập nhật</button>
              <button class="btn btn-sm btn-warning" @click="viewBooking(booking.id)">Chi tiết</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav>
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="currentPage--">Trước</a>
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
          <a class="page-link" href="#" @click.prevent="currentPage++">Sau</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/config';
import { useRouter } from 'vue-router';

const router = useRouter();
const bookings = ref([]);
const entriesPerPage = ref(10);
const currentPage = ref(1);
const searchQuery = ref('');

onMounted(() => {
  axios.get('/bookings')
    .then(res => {
      bookings.value = res.data.data || [];
    })
    .catch(err => {
      console.error('Lỗi khi tải danh sách bookings:', err);
    });
});
const filteredBookings = computed(() => {
  if (!searchQuery.value) return bookings.value;
  const q = searchQuery.value.toLowerCase();

  return bookings.value.filter(b => {
    return (
      b.Name?.toLowerCase().includes(q) ||
      b.phone?.toLowerCase().includes(q) ||
      b.cccd?.toLowerCase().includes(q) ||
      b.room?.roomName?.toLowerCase().includes(q) ||
      formatDate(b.checkinTime).includes(q) ||
      formatDate(b.checkoutTime).includes(q) ||
      translateStatus(b.status).toLowerCase().includes(q) ||
      translatePayment(b.paymentStatus).toLowerCase().includes(q)
    );
  });
});
function translateStatus(status) {
  switch (status) {
    case 'pending_payment': return 'Chờ xác nhận';
    case 'confirmed': return 'Đã xác nhận';
    case 'cancelled': return 'Đã huỷ';
    case 'completed': return 'Đã trả phòng';
    default: return '';
  }
}

function translatePayment(status) {
  switch (status) {
    case 'pending_approval': return 'Đã thanh toán';
    case 'pending': return 'Chưa thanh toán';
    case 'timeout': return 'Hết thời gian';
    default: return '';
  }
}
const totalPages = computed(() =>
  Math.ceil(filteredBookings.value.length / entriesPerPage.value)
);

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value;
  return filteredBookings.value.slice(start, start + entriesPerPage.value);
});

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
    default: return '---';
  }
}

function paymentLabel(status) {
  switch (status) {
    case 'pending_approval': return 'Đã thanh toán';
    case 'pending': return 'Chưa thanh toán';
    case 'timeout' : return 'Hết thời gian';
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