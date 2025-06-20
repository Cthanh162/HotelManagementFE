// src/views/admin/FloorManager.vue
<template>
  <div>
    <h2>Quản lý tầng khách sạn</h2>
    <button @click="openForm" class="btn btn-success mb-3">Thêm tầng</button>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Stt</th>
          <th>Tên tầng</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
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
          <div class="form-group">
            <label>Tên tầng:</label>
            <input v-model="form.floorName" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-success mt-2">Lưu</button>
          <button type="button" class="btn btn-secondary mt-2" @click="closeForm">Huỷ</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/config';

const floors = ref([]);
const showForm = ref(false);
const editingFloor = ref(null);
const form = ref({ floorName: '', hotelId: 1 });

onMounted(fetchFloors);

function fetchFloors() {
  axios.get('/floors?hotelId=1')
    .then(res => { floors.value = res.data.data; })
    .catch(err => console.error('Lỗi khi lấy danh sách tầng:', err));
}

function openForm() {
  editingFloor.value = null;
  form.value = { floorName: '', hotelId: 1 };
  showForm.value = true;
}
function editFloor(floor) {
  console.log('Floor to edit:', floor); // 👉 Kiểm tra tại đây

  editingFloor.value = floor;
  console.log("aaa",editingFloor.value.id);
  form.value = { floorName: floor.floorName, hotelId: 1 };
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
}

// function submitForm() {
//   const url = editingFloor.value ? `/floors/${editingFloor.value.id}` : '/floors';
//   axios.post(url, form.value)
//     .then(() => {
//       fetchFloors();
//       closeForm();
//     })
//     .catch(err => console.error('Lỗi khi lưu tầng:', err));
// }
function submitForm() {
  if (editingFloor.value) {
    // Cập nhật chỉ floorName
    axios.put(`/floors/${editingFloor.value.id}`, {
      floorName: form.value.floorName
    })
      .then(() => {
        fetchFloors();
        closeForm();
      })
      .catch(err => console.error('Lỗi khi cập nhật tầng:', err));
  } else {
    // Tạo mới cần cả hotelId
    axios.post('/floors', {
      hotelId: 1,
      floorName: form.value.floorName
    })
      .then(() => {
        fetchFloors();
        closeForm();
      })
      .catch(err => console.error('Lỗi khi tạo tầng:', err));
  }
}
function deleteFloor(id) {
  axios.delete(`/floors/${id}`)
    .then(() => fetchFloors())
    .catch(err => console.error('Lỗi khi xoá tầng:', err));
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
}
.modal-content {
  background: white;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  border-radius: 5px;
}
</style>
