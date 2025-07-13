<template>
  <main class="main-content mt-0">
    <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

    <!-- Background header -->
    <div class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
         style="background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg');
                background-position: top;">
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">Đăng ký tài khoản</h1>
            <p class="text-lead text-white">Tham gia và trải nghiệm dịch vụ tuyệt vời!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form đăng ký -->
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <h5>Đăng ký</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="submit">
                <div class="mb-3">
                  <label class="form-label">Tên đăng nhập</label>
                  <input v-model="form.userName" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="form.email" type="email" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Mật khẩu</label>
                  <input v-model="form.password" type="password" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Xác nhận mật khẩu</label>
                  <input v-model="confirmPassword" type="password" class="form-control" required />
                </div>
                <button class="btn btn-primary w-100" type="submit">Đăng ký</button>
              </form>
              <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác minh -->
    <div v-if="showVerifyModal" class="modal-backdrop" @click.self="showVerifyModal = false">
      <div class="modal-content">
        <h5 class="mb-3">Xác minh email</h5>
        <p>Nhập mã xác minh được gửi tới email của bạn.</p>
        <input v-model="verifyCode" class="form-control mb-3" type="text" maxlength="6" placeholder="Mã xác minh" />
        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary me-2" @click="showVerifyModal = false">Huỷ</button>
          <button class="btn btn-primary" @click="confirmVerifyCode">Xác minh</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/config';

const router = useRouter();
const form = ref({
  userName: '',
  email: '',
  password: ''
});
const confirmPassword = ref('');
const error = ref(null);
const toastAction = ref('');
const toastMessage = ref('');
const toastVisible = ref(false);

const showVerifyModal = ref(false);
const verifyCode = ref('');
const pendingEmail = ref('');

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

async function submit() {
  error.value = null;

  if (form.value.password !== confirmPassword.value) {
    error.value = 'Mật khẩu xác nhận không khớp';
    return;
  }

  try {
    await axios.post('/signup', form.value);
    showToast('success', 'Mã xác nhận đã được gửi tới email.');
    pendingEmail.value = form.value.email;
    showVerifyModal.value = true;
  } catch (err) {
    const message = err?.response?.data?.message || 'Đăng ký thất bại';
    error.value = message;
    showToast('danger', message);
  }
}

async function confirmVerifyCode() {
  try {
    await axios.post('/verify-code', {
      email: pendingEmail.value,
      code: verifyCode.value
    });
    showToast('success', 'Xác minh thành công. Chuyển hướng...');
    showVerifyModal.value = false;
    setTimeout(() => router.push('/signin'), 2000);
  } catch (err) {
    const msg = err?.response?.data?.message || 'Xác minh thất bại';
    showToast('danger', msg);
  }
}
</script>

<style scoped>
.page-header {
  background-size: cover;
  background-position: center;
}
.card {
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
</style>