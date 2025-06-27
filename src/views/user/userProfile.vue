<template>
  <div class="container py-4">
    <div class="border rounded p-4 shadow-sm bg-white round1">
    <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

    <!-- THÔNG TIN KHÁCH HÀNG -->
    <h5 class="fw-bold mb-3">Thông tin khách hàng</h5>
    <div class="row mb-4">
      <div class="col-md-6">
        <p><strong>Tên tài khoản:</strong> {{ profile.userName }}</p>
        <p><strong>Họ tên:</strong> {{ profile.fullName }}</p>
        <p><strong>Email:</strong> {{ profile.email }}</p>
      </div>
      <div class="col-md-6">
        <p><strong>SĐT:</strong> {{ profile.phone }}</p>
        <p><strong>Địa chỉ:</strong> {{ profile.address }}</p>
      </div>
    </div>

    <hr>

    <!-- CẬP NHẬT THÔNG TIN -->
    <h5 class="fw-bold mb-3">Cập nhật thông tin</h5>
    <form @submit.prevent="updateProfile">
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Họ tên</label>
          <input v-model="form.fullName" type="text" class="form-control" required />
        </div>
        <div class="col-md-6">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-control" required />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Số điện thoại</label>
          <input v-model="form.phone" type="text" class="form-control" required />
        </div>
        <div class="col-md-6">
          <label class="form-label">Địa chỉ</label>
          <input v-model="form.address" type="text" class="form-control" required />
        </div>
      </div>

      <!-- Buttons -->
      <div class="d-flex justify-content-end gap-2 mt-4">
        <button type="submit" class="btn btn-success">CẬP NHẬT</button>
        <button type="button" @click="resetForm" class="btn btn-outline-secondary">ĐÓNG</button>
      </div>
    </form>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from '@/config';
import ToastContainer from '@/components/Toast.vue';

const profile = ref({});
const form = ref({});
const userId = JSON.parse(localStorage.getItem('user'))?.userId || null;
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
const fetchProfile = async () => {
  try {
    const res = await axios.post(`/users/${userId}`);
    profile.value = res.data.data;
    form.value = { ...profile.value };
  } catch (err) {
    showToast('danger', 'Lỗi lấy thông tin user:',err);

    // console.error('Lỗi lấy thông tin user:', err);
  }
};

onMounted(fetchProfile);

const updateProfile = async () => {
  try {
    await axios.put(`/users/${userId}`, form.value);
    showToast('success', 'Cập nhật thành công!');

    // alert('Cập nhật thành công!');
    fetchProfile();
  } catch (err) {
    console.error('Lỗi cập nhật user:', err);
    showToast('danger', 'Cập nhật thất bại.');

    // alert('Cập nhật thất bại.');
  }
};

function resetForm() {
  form.value = { ...profile.value };
}
</script>

<style scoped>
label {
  font-weight: 500;
}
p {
  margin-bottom: 0.5rem;
}
.round1{
    border-radius: 1.0rem !important;
}
</style>