<template>
  <div class="container py-4">
    <h4 class="mb-4">Quản lý Dịch vụ / Tiện nghi</h4>

    <div class="d-flex justify-content-between mb-3">
      <button class="btn btn-success" @click="openCreateForm">Thêm mới</button>
      <input type="text" class="form-control w-auto" placeholder="Tìm kiếm..." v-model="searchQuery" />
    </div>

    <div class="table-responsive">
      <table class="table table-bordered align-middle">
        <thead class="table-light text-center">
          <tr>
            <th>#</th>
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
              <button class="btn btn-sm btn-danger" @click="deleteService(service.id)">Xoá</button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/config';

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

  if (isEdit.value) {
    axios.put(`/services/${form.value.id}`, payload)
      .then(() => {
        fetchServices();
        closeModal();
      })
      .catch(err => alert('Lỗi khi cập nhật' + err));
  } else {
    axios.post('/services', payload)
      .then(() => {
        fetchServices();
        closeModal();
      })
      .catch(err => alert('Lỗi khi thêm mới'+err));
  }
}

function deleteService(id) {
  if (!confirm('Bạn chắc chắn muốn xoá dịch vụ này?')) return;
  axios.delete(`/services/${id}`)
    .then(() => fetchServices())
    .catch(err => alert('Xoá thất bại' + err));
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