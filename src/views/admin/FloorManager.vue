<template>
  <div class="container py-4">
    <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

    <h4 class="mt-3 mb-4">Quản lý tầng</h4>
    <button @click="openForm" class="btn btn-success mb-3">Thêm tầng</button>

    <table class="table table-bordered table-hover align-middle">
      <thead class="table-light text-center">
        <tr>
          <th>STT</th>
          <th>Tên tầng</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody class="text-center">
        <tr v-for="(floor, index) in floors" :key="floor.id">
          <td>{{ index + 1 }}</td>
          <td>{{ floor.floorName }}</td>
          <td>
            <button class="btn btn-sm btn-primary me-2" @click="editFloor(floor)">Sửa</button>
            <button class="btn btn-sm btn-danger" @click="deleteFloor(floor.id)">Xoá</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal thêm/sửa -->
    <div v-if="showForm" class="modal" @click.self="closeForm">
      <div class="modal-content">
        <h3>{{ editingFloor ? 'Sửa tầng' : 'Thêm tầng' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group mb-3">
            <label>Tên tầng:</label>
            <input v-model="form.floorName" class="form-control" required />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeForm">Huỷ</button>
            <button type="submit" class="btn btn-primary">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from '@/config';
import ToastContainer from '@/components/Toast.vue';
import { useRouter } from 'vue-router';

// Token
const token = localStorage.getItem('accessToken');
const router = useRouter();

// Toast
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

// State
const floors = ref([]);
const showForm = ref(false);
const editingFloor = ref(null);
const form = ref({ floorName: '', hotelId: 1 });

onMounted(() => {
  if (!token) return router.push('/signin');
  fetchFloors();
});

// Load floors
function fetchFloors() {
  axios.get('/floors?hotelId=1', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      floors.value = res.data.data;
    })
    .catch(err => {
      console.error('Lỗi khi lấy danh sách tầng:', err);
      showToast('danger', 'Không thể tải danh sách tầng');
    });
}

// Modal actions
function openForm() {
  editingFloor.value = null;
  form.value = { floorName: '', hotelId: 1 };
  showForm.value = true;
}
function editFloor(floor) {
  editingFloor.value = floor;
  form.value = { floorName: floor.floorName, hotelId: 1 };
  showForm.value = true;
}
function closeForm() {
  showForm.value = false;
}

// Submit form
function submitForm() {
  if (!form.value.floorName) {
    showToast('danger', 'Tên tầng không được để trống!');
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  if (editingFloor.value) {
    axios.put(`/floors/${editingFloor.value.id}`, {
      floorName: form.value.floorName
    }, { headers })
      .then(() => {
        showToast('success', 'Cập nhật thành công!');
        fetchFloors();
        closeForm();
      })
      .catch(err => {
        console.error(err);
        showToast('danger', 'Cập nhật thất bại!');
      });
  } else {
    axios.post('/floors', {
      hotelId: 1,
      floorName: form.value.floorName
    }, { headers })
      .then(() => {
        showToast('success', 'Thêm mới thành công!');
        fetchFloors();
        closeForm();
      })
      .catch(err => {
        console.error(err);
        showToast('danger', 'Thêm mới thất bại!');
      });
  }
}

// Xoá tầng
function deleteFloor(id) {
  axios.delete(`/floors/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(() => {
      showToast('success', 'Xoá thành công!');
      fetchFloors();
    })
    .catch(err => {
      console.error(err);
      showToast('danger', 'Xoá thất bại!');
    });
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-content {
  background: white;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  border-radius: 5px;
}
</style>
