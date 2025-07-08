<template>
  <div class="container-fluid">
    <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

    <h4 class="mt-3 mb-4">Quản lý loại phòng</h4>
    <div class="mb-3">
      <button @click="openAddModal" class="btn btn-success">Thêm loại phòng</button>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle">
        <thead class="table-light text-center">
          <tr>
            <th>STT</th>
            <th>Tên loại phòng</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(type, index) in roomTypes" :key="type.id">
            <td>{{ index + 1 }}</td>
            <td>{{ type.name }}</td>
            <td>{{ type.des }}</td>
            <td>
              <button @click="editType(type)" class="btn btn-primary btn-sm">Sửa</button>
              <button @click="confirmDelete(type.id)" class="btn btn-danger btn-sm ms-2">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <div v-if="showForm" class="modal d-block" tabindex="-1" @click.self="closeForm">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingType ? 'Điều chỉnh' : 'Thêm loại phòng' }}</h5>
            <button type="button" class="btn-close" @click="closeForm"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label class="form-label">Tên loại phòng</label>
                <input v-model="form.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea v-model="form.des" class="form-control" rows="4"></textarea>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary ms-2 padding1" @click="closeForm">Đóng</button>
                <button type="submit" class="btn btn-primary">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xoá -->
    <ConfirmModal
      v-if="showConfirmModal"
      :message="confirmMessage"
      @confirm="handleConfirm"
      @close="showConfirmModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from '@/config';
import ToastContainer from '@/components/Toast.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';

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

const roomTypes = ref([]);
const showForm = ref(false);
const editingType = ref(null);
const showConfirmModal = ref(false);
const confirmMessage = ref('');
const confirmAction = ref(null);

const form = ref({
  name: '',
  des: ''
});

function fetchRoomTypes() {
  axios.get('/room-types').then(res => roomTypes.value = res.data.data);
}

function openAddModal() {
  editingType.value = null;
  form.value = { name: '', des: '' };
  showForm.value = true;
}

function editType(type) {
  editingType.value = type;
  form.value = { name: type.name, des: type.des };
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
}

function submitForm() {
  const payload = { ...form.value };
  const url = editingType.value ? `/room-types/${editingType.value.id}` : '/room-types';
  const method = editingType.value ? 'put' : 'post';

  axios[method](url, payload)
    .then(() => {
      showToast('success', editingType.value ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
      fetchRoomTypes();
      closeForm();
    })
    .catch(err => {
      console.error('Lỗi khi lưu loại phòng:', err);
      showToast('danger', 'Lưu thất bại!');
    });
}

function confirmDelete(id) {
  openConfirmModal('Bạn có chắc muốn xoá loại phòng này?', async () => {
    try {
      await axios.delete(`/room-types/${id}`);
      showToast('success', 'Xoá thành công!');
      fetchRoomTypes();
    } catch (err) {
      console.error('Lỗi khi xoá:', err);
      showToast('danger', 'Xoá thất bại.');
    }
  });
}

function openConfirmModal(message, action) {
  confirmMessage.value = message;
  confirmAction.value = action;
  showConfirmModal.value = true;
}

function handleConfirm() {
  showConfirmModal.value = false;
  if (confirmAction.value) confirmAction.value();
}

onMounted(fetchRoomTypes);
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.padding1 {
  margin-right: 10px !important;
}
</style>