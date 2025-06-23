<template>
  <main class="main-content mt-0">
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
  </main>
</template>

<script setup>
import { ref } from 'vue';
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

async function submit() {
  error.value = null;

  if (form.value.password !== confirmPassword.value) {
    error.value = 'Mật khẩu xác nhận không khớp';
    return;
  }

  try {
    await axios.post('/signup', form.value);
    alert('Đăng ký thành công!');
    router.push('/signin');
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    error.value = err?.response?.data?.message || 'Đăng ký thất bại';
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
</style>