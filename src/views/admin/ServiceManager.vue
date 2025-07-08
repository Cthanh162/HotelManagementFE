<template>
  <div class="container py-4">
    <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

    <h4 class="mb-4">Quản lý Dịch vụ / Tiện nghi</h4>

    <div class="d-flex justify-content-between mb-3">
      <button class="btn btn-success" @click="openCreateForm">Thêm mới</button>
      <input type="text" class="form-control w-auto" placeholder="Tìm kiếm..." v-model="searchQuery" />
    </div>

    <div class="table-responsive">
      <table class="table table-bordered align-middle">
        <thead class="table-light text-center">
          <tr>
            <th>STT</th>
            <th>Tên dịch vụ</th>
            <th>Trạng thái</th>
            <th>Giá (VND)</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, index) in filteredServices" :key="service.id">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ service.name }}</td>
            <td>{{ service.status === 'active' ? 'Hoạt động' : 'Tạm tắt' }}</td>
            <td>{{ Number(service.price).toLocaleString() }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-primary me-2" @click="editService(service)">Sửa</button>
              <button class="btn btn-sm btn-danger" @click="confirmDelete(service.id)">Xoá</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Thêm/Sửa -->
    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.3)">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="saveService">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEdit ? 'Cập nhật dịch vụ' : 'Thêm mới dịch vụ' }}</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Tên dịch vụ</label>
                <input v-model="form.name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Giá (VND)</label>
                <input v-model.number="form.price" type="number" class="form-control" min="0" />
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select v-model="form.status" class="form-select" required>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm tắt</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Huỷ</button>
              <button type="submit" class="btn btn-primary">Lưu</button>
            </div>
          </form>
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
import { ref, onMounted, computed, nextTick } from 'vue';
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

const services = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const searchQuery = ref('');
const form = ref({
  id: null,
  name: '',
  status: 'active',
  price: 0,
});

const showConfirmModal = ref(false);
const confirmMessage = ref('');
const confirmAction = ref(null);

function fetchServices() {
  axios.get('/services')
    .then(res => services.value = res.data.data)
    .catch(err => console.error('Lỗi khi lấy dịch vụ:', err));
}

function openCreateForm() {
  isEdit.value = false;
  form.value = {
    id: null,
    name: '',
    status: 'active',
    price: 0
  };
  showModal.value = true;
}

function editService(service) {
  isEdit.value = true;
  form.value = { ...service };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function saveService() {
  const payload = {
    name: form.value.name,
    status: form.value.status,
    price: form.value.price || 0,
  };

  const request = isEdit.value
    ? axios.put(`/services/${form.value.id}`, payload)
    : axios.post('/services', payload);

  request
    .then(() => {
      showToast('success', isEdit.value ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
      fetchServices();
      closeModal();
    })
    .catch(err => {
      console.log(err);
      showToast('danger', isEdit.value ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!');
    });
}

function confirmDelete(id) {
  openConfirmModal('Bạn có chắc muốn xoá dịch vụ này?', async () => {
    try {
      await axios.delete(`/services/${id}`);
      showToast('success', 'Xoá thành công!');
      fetchServices();
    } catch (err) {
      console.log(err);
      showToast('danger', 'Xoá thất bại!');
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

const filteredServices = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase();
  return services.value.filter(s =>
    s.name?.toLowerCase().includes(keyword) ||
    s.status?.toLowerCase().includes(keyword) ||
    String(s.price).includes(keyword)
  );
});

onMounted(fetchServices);
</script>