<template>
  <div class="container-fluid">
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
          <tr v-for="(room, index) in filteredRooms" :key="room.roomId">
            <td>{{ index + 1 }}</td>
            <td>{{ room.roomName }}</td>
            <td>
              <img v-if="room.roomImages?.length" :src="room.roomImages[0]?.url || room.roomImages[0]" width="80" />
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
    <button @click="deleteRoom(room.roomId)" class="btn btn-danger btn-sm nomargin">Xoá</button>
  </div>
</td>
          </tr>
        </tbody>
      </table>
    </div>
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
              class="rounded shadow-sm"
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
              <option value="available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Maintenance">Maintenance</option>
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/config';

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
  // formData.append('hotelId', String(form.value.hotelId));
  // formData.append('floorId', String(form.value.floorId));
  // formData.append('roomName', String(form.value.roomName));
  // formData.append('status', String(form.value.status));
  // formData.append('roomTypeId', String(form.value.roomTypeId));
  // formData.append('capacity', String(form.value.capacity));
  // formData.append('adults', String(form.value.adults));
  // formData.append('children', String(form.value.children));
  // formData.append('price', String(form.value.price));
  // formData.append('description', String(form.value.description || ''));
  for (const key in form.value) {
    if (key === 'imageFiles') {
      form.value.imageFiles.forEach(f => formData.append('roomImages[]', f));
    } else if (key === 'services') {
      form.value.services.forEach(id => formData.append('services[]', id));
    } else if (key === 'videoFile' && form.value.videoFile) {
      formData.append('roomVideo', form.value.videoFile);
    } else {
      formData.append(key, form.value[key]);
    }
  }
for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  const url = editingRoom.value ? `/rooms/${editingRoom.value.roomId}` : '/rooms';
  const method = editingRoom.value ? axios.put : axios.post;

    await method(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  // await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  fetchRooms();
  closeForm();
}

function deleteRoom(id) {
  if (!confirm('Bạn có chắc chắn muốn xoá phòng này?')) return;

  axios.delete(`/rooms/${id}`)
    .then(() => {
      fetchRooms();
    })
    .catch(err => {
      alert('Lỗi khi xoá phòng!');
      console.error(err);
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