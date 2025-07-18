<template>
  <div class="container py-4">
    <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

    <h4 class="mb-3">Danh sách khách hàng</h4>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-success" @click="openCreateForm">Thêm mới</button>
      <input type="text" v-model="searchQuery" placeholder="Tìm kiếm ..." class="form-control w-auto"/>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered align-middle">
        <thead class="table-light text-center">
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Tên tài khoản</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="user.userId">
            <td class="text-center">{{ index + 1 + (currentPage - 1) * entriesPerPage }}</td>
            <td>{{ user.fullName }}</td>
            <td>{{ user.userName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.address }}</td>
            <td class="text-center">
              <button class="btn btn-primary btn-sm me-1" @click="openEditForm(user)">Sửa</button>
              <button class="btn btn-danger btn-sm" @click="deleteUser(user.userId)">Xoá</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <nav>
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="currentPage--">&laquo;</a>
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
          <a class="page-link" href="#" @click.prevent="currentPage++">&raquo;</a>
        </li>
      </ul>
    </nav>

    

<!-- Modal Form -->
<form v-if="showModal" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.3);" @submit.prevent="submitForm($event)">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ isEdit ? 'Cập nhật người dùng' : 'Thêm mới người dùng' }}</h5>
        <button class="btn-close" @click="closeModal" type="button"></button>
      </div>
      <div class="modal-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Tên tài khoản</label>
            <input class="form-control" v-model="form.userName" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Email</label>
            <input class="form-control" v-model="form.email" type="email" required />
          </div>
          <div class="col-6">
            <label class="form-label">Họ tên</label>
            <input class="form-control" v-model="form.fullName" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Số điện thoại</label>
            <input class="form-control" v-model="form.phone" required />
          </div>
          <div class="col-md-6" v-if="!isEdit">
            <label class="form-label">Mật khẩu</label>
            <input class="form-control" v-model="form.password" type="password" required />
          </div>
          <div class="col-6">
            <label class="form-label">Địa chỉ</label>
            <input class="form-control" v-model="form.address" required />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" type="button" @click="closeModal">Huỷ</button>
        <button class="btn btn-primary" type="submit">Lưu</button>
      </div>
    </div>
  </div>
</form>

    <!-- Xác nhận xoá -->
    <ConfirmModal
      v-if="showConfirmModal"
      :message="confirmMessage"
      @confirm="handleConfirm"
      @close="showConfirmModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import axios from '@/config';
import ToastContainer from '@/components/Toast.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import { useRouter } from 'vue-router';

const toastAction = ref('');
const toastMessage = ref('');
const toastVisible = ref(false);
const router = useRouter();
const token = localStorage.getItem('accessToken');

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

const users = ref([]);
const entriesPerPage = ref(10);
const currentPage = ref(1);
const searchQuery = ref('');
const showModal = ref(false);
const isEdit = ref(false);

const form = ref({
  userId: null,
  userName: '',
  email: '',
  phone: '',
  password: '',
  address: '',
  fullName: ''
});

const showConfirmModal = ref(false);
const confirmMessage = ref('');
const confirmAction = ref(null);

function openConfirmModal(message, action) {
  confirmMessage.value = message;
  confirmAction.value = action;
  showConfirmModal.value = true;
}

function handleConfirm() {
  showConfirmModal.value = false;
  if (confirmAction.value) confirmAction.value();
}

onMounted(() => {
  if (!token) return router.push('/signin');
  refreshUsers();
});

function refreshUsers() {
  axios.get('/users', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => users.value = res.data.data || [])
    .catch(err => {
      console.error('Lỗi khi lấy danh sách user:', err);
      showToast('danger', 'Không thể tải danh sách người dùng');
    });
}

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const keyword = searchQuery.value.toLowerCase();
  return users.value.filter(u =>
    u.userName?.toLowerCase().includes(keyword) ||
    u.email?.toLowerCase().includes(keyword) ||
    u.phone?.toLowerCase().includes(keyword) ||
    u.fullName?.toLowerCase().includes(keyword) ||
    u.address?.toLowerCase().includes(keyword)
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / entriesPerPage.value);
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value;
  return filteredUsers.value.slice(start, start + entriesPerPage.value);
});

function openEditForm(user) {
  isEdit.value = true;
  form.value = { ...user };
  showModal.value = true;
}

function openCreateForm() {
  isEdit.value = false;
  form.value = {
    userId: null,
    email: '',
    phone: '',
    userName: '',
    password: '',
    address: '',
    fullName: ''
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function submitForm(e) {
  const formEl = e.target.closest('form');
  if (!formEl.checkValidity()) {
    formEl.reportValidity();
    return;
  }

  try {
    if (!token) return router.push('/signin');

    if (isEdit.value) {
      await axios.put(`/users/${form.value.userId}`, form.value, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('success', 'Cập nhật thành công!');
    } else {
      await axios.post('/users', form.value, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('success', 'Thêm mới thành công!');
    }

    closeModal();
    refreshUsers();
  } catch (err) {
    let msg = 'Đã xảy ra lỗi';
    if (err.response?.status === 422) {
      const errors = err.response.data.errors;
      const first = Object.values(errors)?.[0]?.[0];
      msg = first || 'Dữ liệu không hợp lệ';
    } else {
      msg = err.response?.data?.message || msg;
    }
    showToast('danger', msg);
  }
}



function deleteUser(id) {
  openConfirmModal('Bạn có chắc chắn muốn xoá người dùng này?', async () => {
    try {
      await axios.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      users.value = users.value.filter(u => u.userId !== id);
      showToast('success', 'Xoá thành công!');
    } catch (err) {
      console.error(err);
      showToast('danger', 'Xoá thất bại!');
    }
  });
}
</script>

<style scoped>
.toast {
  min-width: 250px;
  animation: fadein 0.3s ease-in-out;
}

.pagination .page-link {
  border-radius: 50% !important;
  width: 40px;
  height: 40px;
  padding: 0;
  line-height: 40px;
  text-align: center;
  margin: 0 4px;
  border: none;
  color: #444;
  background-color: #f1f1f1;
  font-weight: 600;
  transition: all 0.2s ease;
}

.pagination .page-item.active .page-link {
  background-color: #5567ff;
  color: white;
}

.pagination .page-item.disabled .page-link {
  opacity: 0.4;
  pointer-events: none;
}
</style>
