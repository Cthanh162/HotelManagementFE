<template>
  <div class="container-fluid">
        <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

    <h4 class="mt-3 mb-4">Danh sách phòng</h4>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <button @click="openAddModal" class="btn btn-success">Thêm mới</button>
      <input v-model="searchQuery" type="text" class="form-control search-input form-control-sm" placeholder="Tìm kiếm phòng..." />
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle">
        <thead class="table-light text-center">
          <tr>
            <th>STT</th>
            <th>Tên phòng</th>
            <th>Ảnh</th>
            <th>Video</th>
            <th>Loại phòng</th>
            <th>Người lớn</th>
            <th>Trẻ em</th>
            <th>Giá phòng</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(room, index) in paginatedRooms" :key="room.roomId">
            <!-- <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td> -->
            <td>{{ index + 1 }}</td>
            <td>{{ room.roomName }}</td>
            <td>
              <img v-if="room.roomImages?.length" :src="room.roomImages[0]?.url || room.roomImages[0]" width="80" @click="zoomImage(room.roomImages[0]?.url || room.roomImages[0])" class="payment-img" />
            </td>
            <td>
              <button v-if="room.roomVideo" @click="viewVideo(room.roomVideo)" class="btn btn-sm btn-outline-primary">Xem video</button>
            </td>
            <td>{{ room.roomType?.name }}</td>
            <td>{{ room.adults }}</td>
            <td>{{ room.children }}</td>
            <td>{{ Number(room.price).toLocaleString() }} VND</td>
            <td><a href="#" @click.prevent="viewRoom(room)">Xem</a></td>
            <td class="text-center">
  <div class="d-flex justify-content-center gap-1 align-items-center">
    <button @click="editRoom(room)" class="btn btn-primary btn-sm nomargin">Sửa</button>
   <button @click="confirmDelete(room.roomId)" class="btn btn-danger btn-sm nomargin">Xoá</button>
  </div>
</td>
          </tr>
        </tbody>
      </table>
    </div>
     <nav v-if="totalPages > 1" class="mt-3">
  <ul class="pagination justify-content-center">
    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">«</button>
    </li>

    <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage, disabled: page === '...' }">
      <button v-if="page !== '...'" class="page-link" @click="currentPage = page">{{ page }}</button>
      <span v-else class="page-link">…</span>
    </li>

    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">»</button>
    </li>
  </ul>
</nav>
    <!-- Modal chi tiết -->
    
 <!-- Modal Chi tiết -->
    <div v-if="selectedRoom" class="modal" @click.self="selectedRoom = null">
      <div class="modal-content modal-scrollable">
        <h3>{{ selectedRoom.roomName }}</h3>
        <p><strong>Loại phòng:</strong> {{ selectedRoom.roomType?.name }}</p>
        <p><strong>Sức chứa:</strong> {{ selectedRoom.capacity }} người</p>
        <p><strong>Người lớn:</strong> {{ selectedRoom.adults }} - <strong>Trẻ em:</strong> {{ selectedRoom.children }}</p>
        <p><strong>Giá:</strong> {{ Number(selectedRoom.price).toLocaleString() }} VND</p>
        <p><strong>Mô tả:</strong> {{ selectedRoom.description }}</p>

        <div v-if="selectedRoom.services?.length">
          <p><strong>Dịch vụ / Tiện nghi:</strong></p>
          <ul>
            <li v-for="s in selectedRoom.services" :key="s.id">
              {{ s.name }} - {{ s.price ? Number(s.price).toLocaleString() + ' đ' : 'Miễn phí' }}
            </li>
          </ul>
        </div>

        <div v-if="selectedRoom.roomImages?.length">
          <p><strong>Hình ảnh:</strong></p>
          <div class="d-flex flex-wrap gap-2">
            <img
              v-for="(img, i) in selectedRoom.roomImages"
              :key="i"
              :src="img.url || img"
              @click="zoomImage(img.url || img)"
              width="100"
              height="80"
              class="rounded shadow-sm payment-img"
              style="cursor: pointer;"
            />
          </div>
        </div>

        <div v-if="selectedRoom.roomVideo" class="mt-3">
          <p><strong>Video:</strong></p>
          <video controls width="100%">
            <source :src="selectedRoom.roomVideo" type="video/mp4" />
          </video>
        </div>

        <button @click="selectedRoom = null" class="btn btn-secondary mt-3">Đóng</button>
      </div>
    </div>

    <!-- Modal Zoom Ảnh -->
    <div v-if="zoomedImage" class="image-modal" @click.self="zoomedImage = null">
      <img :src="zoomedImage" class="zoomed-img" />
    </div>
  </div>  
    <!-- Modal Thêm/Sửa phòng -->
    <div v-if="showForm" class="modal" @click.self="closeForm">
      <div class="modal-content modal-scrollable">
        <h3>{{ editingRoom ? 'Sửa phòng' : 'Thêm phòng' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label>Tầng:</label>
            <select v-model="form.floorId" class="form-control" required>
              <option disabled value="">Chọn tầng</option>
              <option v-for="f in floors" :key="f.id" :value="f.id">{{ f.floorName }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Tên phòng:</label>
            <input v-model="form.roomName" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Trạng thái:</label>
            <select v-model="form.status" class="form-control" required>
              <option value="available">Đang mở</option>
              <option value="Booked">Tạm khóa</option>
              <option value="Maintenance">Bảo trì</option>
            </select>
          </div>
          <div class="form-group">
            <label>Loại phòng:</label>
            <select v-model="form.roomTypeId" class="form-control" required>
            <option disabled value="">Chọn loại phòng</option>
            <option v-for="type in roomTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
          </div>
          <div class="form-group">
            <label>Sức chứa:</label>
            <input v-model.number="form.capacity" class="form-control" required type="number" min="1" />
          </div>
          <div class="form-group">
            <label>Người lớn:</label>
            <input v-model.number="form.adults" class="form-control" required type="number" min="0" />
          </div>
          <div class="form-group">
            <label>Trẻ em:</label>
            <input v-model.number="form.children" class="form-control" required type="number" min="0" />
          </div>
          <div class="form-group">
            <label>Giá phòng:</label>
            <input v-model.number="form.price" class="form-control" required type="number" min="1" step="0.01" />
          </div>
          <div class="form-group">
            <label>Mô tả:</label>
            <textarea v-model="form.description" class="form-control" rows="5"></textarea>
          </div>

          <div class="form-group">
            <label>Dịch vụ / Tiện nghi:</label>
            <div class="form-check" v-for="s in services" :key="s.id">
              <input class="form-check-input" type="checkbox" :value="s.id" v-model="form.services" :id="`service-${s.id}`" />
              <label class="form-check-label" :for="`service-${s.id}`">
                {{ s.name }} - {{ s.price ? Number(s.price).toLocaleString() + ' đ' : 'Miễn phí' }}
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Ảnh phòng:</label>
            <input type="file" multiple @change="handleImageUpload" class="form-control" accept="image/*" />
          </div>

          <div class="form-group">
            <label>Video phòng:</label>
            <input type="file" @change="handleVideoUpload" class="form-control" accept="video/*" />
          </div>
           <div class="modal-footer">
          <button type="button" @click="closeForm" class="btn btn-secondary mt-2">Huỷ</button>
          <button type="submit" class="btn btn-primary mt-2">Lưu</button>
          </div>
        </form>
      </div>
    </div>
    <ConfirmModal
  v-if="showConfirmModal"
  :message="confirmMessage"
  @confirm="handleConfirm"
  @close="showConfirmModal = false"
/>
    <div v-if="zoomedImage" class="image-modal" @click.self="zoomedImage = null">
      <img :src="zoomedImage" class="zoomed-img" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed,nextTick,watch } from 'vue';
import axios from '@/config';
import ToastContainer from '@/components/Toast.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';

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
const toastAction = ref('');
const toastMessage = ref('');
const toastVisible = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;
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
const zoomedImage = ref(null);

const rooms = ref([]);
const services = ref([]);
const floors = ref([]);
const showForm = ref(false);
const editingRoom = ref(null);
const selectedRoom = ref(null);
const videoToView = ref(null);
const searchQuery = ref('');
const roomTypes = ref([]);
const form = ref({
  hotelId: 1,
  floorId: '',
  roomName: '',
  status: 'available',
  roomTypeId: 0,
  capacity: 1,
  adults: 0,
  children: 0,
  price: 0,
  description: '',
  services: [],
  imageFiles: [],
  videoFile: null,
});
function zoomImage(url) {
  zoomedImage.value = url;
}
onMounted(() => {
  fetchRooms();
  axios.get('/floors?hotelId=1').then(res => floors.value = res.data.data);
  axios.get('/services').then(res => services.value = res.data.data);
  axios.get('/room-types').then(res => roomTypes.value = res.data.data);
});

const filteredRooms = computed(() => {
  if (!searchQuery.value) return rooms.value;
  return rooms.value.filter(r =>
    r.roomName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    r.roomType?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredRooms.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredRooms.value.length / itemsPerPage);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total);
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total);
    }
  }

  return pages;
});
watch([searchQuery, filteredRooms], () => {
  currentPage.value = 1;
});
function fetchRooms() {
  axios.get('/rooms/getAll').then(res => rooms.value = res.data.data);
}

function openAddModal() {
  editingRoom.value = null;
  form.value = {
    hotelId: 1, floorId: '', roomName: '', status: 'available', roomType: '',
    capacity: 1, adults: 0, children: 0, price: 0, description: '', services: [], imageFiles: [], videoFile: null
  };
  showForm.value = true;
}

function editRoom(room) {
  editingRoom.value = room;
  form.value = {
    hotelId: room.hotelId, floorId: room.floorId, roomName: room.roomName, status: room.status,
    roomTypeId: room.roomType?.id, capacity: room.capacity, adults: room.adults, children: room.children,
    price: room.price, description: room.description || '', services: room.services?.map(s => s.id) || [],
    imageFiles: [], videoFile: null
  };
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
}

function handleImageUpload(e) {
  form.value.imageFiles = Array.from(e.target.files);
}

function handleVideoUpload(e) {
  form.value.videoFile = e.target.files[0];
}

async function submitForm() {
  const formData = new FormData();
 if (editingRoom.value) {
    formData.append('_method', 'PUT'); // 👈 Đây là dòng quan trọng nhất!
  }
  for (const key in form.value) {
    const value = form.value[key];

    if (key === 'imageFiles' && Array.isArray(value)) {
      value.forEach(f => formData.append('roomImages[]', f));
    } else if (key === 'services' && Array.isArray(value)) {
      value.forEach(id => formData.append('services[]', id));
    } else if (key === 'videoFile' && value) {
      formData.append('roomVideo', value);
    } else {
      formData.append(key, value ?? ''); 
    }
  }

  for (let [k, v] of formData.entries()) {
    console.log(`${k}: ${v}`);
  }

  const url = editingRoom.value ? `/rooms/${editingRoom.value.roomId}` : '/rooms';
  // const method = editingRoom.value ? axios.put : axios.post;

  await axios.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  showToast('success', 'Thành công!');
  fetchRooms();
  closeForm();
}

function confirmDelete(id) {
  openConfirmModal('Bạn có chắc chắn muốn xoá phòng này?', async () => {
    try {
      await axios.delete(`/rooms/${id}`);
      showToast('success', 'Xoá phòng thành công!');
      fetchRooms();
    } catch (err) {
      showToast('danger', 'Xoá thất bại!');
      console.error(err);
    }
  });
}

function viewRoom(room) {
  selectedRoom.value = room;
}

function viewVideo(url) {
  videoToView.value = url;
}
</script>

<style scoped>
.container-fluid {
  max-width: 100%;
  /* padding: 0 1rem; */
  padding-left: 0 !important;
  padding-right: 0 !important;
} 
main{
  padding:0 !important;
}
.nomargin{
    margin-bottom:0 !important;
}
.search-input {
  max-width: 220px;
  min-width: 160px;
}
main .main-content{
  padding: 0 !important;;
}
.modal {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; overflow: auto;
}
.modal-content {
  background: white; padding: 2rem;
  max-width: 600px; width: 100%; border-radius: 5px;
}
.modal-scrollable {
  max-height: 90vh; overflow-y: auto;
}
.payment-img {
  width: 100px;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.zoomed-img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}
</style>
<style>
.main-content {
  padding: 10px !important;
}
.container-fluid {
  padding-left: 10px !important;
  padding-right: 10px !important;
}
</style>