<template>
  <div>
    <h2>Danh sách phòng</h2>
    <button @click="openAddModal" class="btn btn-success mb-3">Thêm mới</button>

    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
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
          <tr v-for="(room, index) in rooms" :key="room.roomId">
            <td>{{ index + 1 }}</td>
            <td>{{ room.roomName }}</td>
            <td>
              <img
                v-if="room.roomImages?.length"
                :src="room.roomImages[0]?.url || room.roomImages[0]"
                alt="room"
                width="80"
              />
            </td>
            <td>
              <button v-if="room.roomVideo" @click="viewVideo(room.roomVideo)" class="btn btn-sm btn-outline-primary">Xem video</button>
            </td>
            <td>{{ room.roomType }}</td>
            <td>{{ room.adults }}</td>
            <td>{{ room.children }}</td>
            <td>{{ Number(room.price).toLocaleString() }} VND</td>
            <td><a href="#" @click.prevent="viewRoom(room)">Xem</a></td>
            <td>
              <button @click="editRoom(room)" class="btn btn-primary btn-sm">Sửa</button>
              <button @click="deleteRoom(room.roomId)" class="btn btn-danger btn-sm">Xoá</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal xem chi tiết -->
    <div v-if="selectedRoom" class="modal" @click.self="selectedRoom = null">
      <div class="modal-content">
        <h3>{{ selectedRoom.roomName }}</h3>
        <p>{{ selectedRoom.description }}</p>
        <div v-if="selectedRoom.roomImages?.length">
          <div class="carousel">
            <img v-for="(img, i) in selectedRoom.roomImages" :key="i" :src="img.url || img" :alt="selectedRoom.roomName" width="100%" />
          </div>
        </div>
        <video v-if="selectedRoom.roomVideo" controls width="100%">
          <source :src="selectedRoom.roomVideo" type="video/mp4" />
        </video>
        <button @click="selectedRoom = null" class="btn btn-secondary mt-2">Đóng</button>
      </div>
    </div>

    <!-- Modal xem video riêng -->
    <div v-if="videoToView" class="modal" @click.self="videoToView = null">
      <div class="modal-content">
        <video controls width="100%">
          <source :src="videoToView" type="video/mp4" />
        </video>
        <button @click="videoToView = null" class="btn btn-secondary mt-2">Đóng</button>
      </div>
    </div>

    <!-- Modal thêm/sửa phòng -->
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
            <select v-model="form.roomType" class="form-control" required>
              <option value="Deluxe">Deluxe</option>
              <option value="Standard">Standard</option>
              <option value="Luxury'">Luxury</option>
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
          <div v-if="editingRoom?.roomImages?.length">
            <p>Ảnh hiện tại:</p>
            <img v-for="(img, i) in editingRoom.roomImages" :key="i" :src="img.url || img" width="100" class="me-2 mb-2" />
          </div>
          <div class="form-group">
            <label>Ảnh phòng (mới):</label>
            <input type="file" multiple @change="handleImageUpload" class="form-control" accept="image/jpeg,image/png,image/jpg" />
          </div>
          <div v-if="editingRoom?.roomVideo">
            <p>Video hiện tại:</p>
            <video :src="editingRoom.roomVideo" controls width="100%" class="mb-2" />
          </div>
          <div class="form-group">
            <label>Video (mới):</label>
            <input type="file" @change="handleVideoUpload" class="form-control" accept="video/mp4,video/avi,video/mov" />
          </div>
          <button type="submit" class="btn btn-success mt-2" :disabled="isSubmitting">Lưu</button>
          <button @click.prevent="closeForm" class="btn btn-secondary mt-2">Huỷ</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from '@/config';
import { onMounted, ref } from 'vue';

const rooms = ref([]);
const floors = ref([]);
const selectedRoom = ref(null);
const videoToView = ref(null);
const showForm = ref(false);
const editingRoom = ref(null);
const isSubmitting = ref(false);

const form = ref({
  hotelId: 1,
  floorId: '',
  roomName: '',
  status: 'available',
  roomType: '',
  capacity: 1,
  adults: 0,
  children: 0,
  price: 0,
  description: '',
  videoFile: null,
  imageFiles: []
});

onMounted(() => {
  fetchRooms();
  axios.get('/floors?hotelId=1').then(res => {
    floors.value = res.data.data;
  });
});

function fetchRooms() {
  axios.get('/rooms')
    .then(res => {
      rooms.value = res.data.data;
    })
    .catch(err => {
      console.error('Lỗi khi tải danh sách phòng:', err);
    });
}

function viewRoom(room) {
  selectedRoom.value = room;
}

function viewVideo(videoUrl) {
  videoToView.value = videoUrl;
}

function openAddModal() {
  editingRoom.value = null;
  form.value = {
    hotelId: 1,
    floorId: '',
    roomName: '',
    status: 'available',
    roomType: '',
    capacity: 1,
    adults: 0,
    children: 0,
    price: 0,
    description: '',
    videoFile: null,
    imageFiles: []
  };
  showForm.value = true;
}

function editRoom(room) {
  editingRoom.value = room;
  form.value = {
    hotelId: room.hotelId,
    floorId: room.floorId,
    roomName: room.roomName,
    status: room.status || 'available',
    roomType: room.roomType,
    capacity: room.capacity,
    adults: room.adults,
    children: room.children,
    price: room.price,
    description: room.description,
    videoFile: null,
    imageFiles: []
  };
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
}

function handleVideoUpload(e) {
  const file = e.target.files[0];
  if (file && ['video/mp4', 'video/avi', 'video/mov'].includes(file.type)) {
    form.value.videoFile = file;
  } else {
    alert('Vui lòng chọn file video hợp lệ (mp4, avi, mov)');
    e.target.value = '';
  }
}

function handleImageUpload(e) {
  const files = Array.from(e.target.files);
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const validFiles = files.filter(file => validTypes.includes(file.type));
  if (validFiles.length < files.length) {
    alert('Chỉ chấp nhận file ảnh định dạng jpeg, png, jpg');
  }
  form.value.imageFiles = validFiles;
  if (!validFiles.length) {
    e.target.value = '';
  }
}

async function submitForm() {
  // Validation trước khi gửi
  if (!form.value.floorId) {
    alert('Vui lòng chọn tầng');
    return;
  }
  if (!form.value.roomName.trim()) {
    alert('Vui lòng nhập tên phòng');
    return;
  }
  if (!form.value.roomType) {
    alert('Vui lòng chọn loại phòng');
    return;
  }
  if (form.value.capacity < 1) {
    alert('Sức chứa phải lớn hơn 0');
    return;
  }
  if (form.value.adults < 0 || form.value.children < 0) {
    alert('Số người lớn và trẻ em không được âm');
    return;
  }
  if (form.value.price <= 0) {
    alert('Giá phòng phải lớn hơn 0');
    return;
  }

  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('hotelId', form.value.hotelId);
    formData.append('floorId', form.value.floorId);
    formData.append('roomName', form.value.roomName);
    formData.append('status', form.value.status);
    formData.append('roomType', form.value.roomType);
    formData.append('capacity', form.value.capacity);
    formData.append('adults', form.value.adults);
    formData.append('children', form.value.children);
    formData.append('price', form.value.price);
    formData.append('description', form.value.description || '');

    if (form.value.videoFile) {
      formData.append('roomVideo', form.value.videoFile);
    }
    form.value.imageFiles.forEach(file => {
      formData.append('roomImages[]', file);
    });

    // Log FormData để debug
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    if (editingRoom.value) {
      await axios.post(`/rooms/${editingRoom.value.roomId}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Cập nhật phòng thành công');
    } else {
      await axios.post('/rooms', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Tạo phòng thành công');
    }

    fetchRooms();
    closeForm();
  } catch (err) {
    console.error('Lỗi khi lưu phòng:', err);
    if (err.response && err.response.status === 422) {
      alert('Dữ liệu không hợp lệ: ' + JSON.stringify(err.response.data.errors, null, 2));
    } else if (err.response && err.response.status === 404) {
      alert('Không tìm thấy phòng');
    } else {
      alert('Có lỗi xảy ra, vui lòng thử lại');
    }
  } finally {
    isSubmitting.value = false;
  }
}
async function deleteRoom(id) {
  try {
    await axios.delete(`/rooms/${id}`);
    // alert('Xoá phòng thành công');
    fetchRooms();
  } catch (error) {
    console.error('Lỗi khi xoá phòng:', error);
    alert('Lỗi khi xoá phòng');
  }
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
  z-index: 1000;
  overflow: auto;
}
.modal-content {
  background: white;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  border-radius: 5px;
}
.modal-scrollable {
  max-height: 90vh;
  overflow-y: auto;
}
.carousel img {
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.table-responsive {
  overflow-x: auto;
}
</style>