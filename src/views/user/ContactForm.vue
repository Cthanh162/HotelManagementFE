<template>
  <div class="container py-5">
    <ToastContainer :action="toastAction" :message="toastMessage" v-if="toastVisible" />

    <h3 class="mb-3">Liên hệ với chúng tôi</h3>
    <p class="mb-4 text-muted">
      Bạn có câu hỏi nào không? Xin đừng ngần ngại liên hệ trực tiếp với chúng tôi.
      Nhóm của chúng tôi sẽ liên hệ với bạn trong vòng một vài giờ để giúp bạn.
    </p>

    <div class="row">
      <!-- Left: Form -->
      <div class="col-md-8">
        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-md-6">
              <input type="text" class="form-control" placeholder="Tên bạn" v-model="form.name" required />
            </div>
            <div class="col-md-6">
              <input type="email" class="form-control" placeholder="Email" v-model="form.email" required />
            </div>
          </div>

          <div class="mb-3">
            <textarea class="form-control" placeholder="Nội dung" rows="5" v-model="form.message" required></textarea>
          </div>

          <button class="btn btn-primary" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Đang gửi...' : 'Gửi' }}
          </button>
        </form>
      </div>

      <!-- Right: Contact Info -->
      <div class="col-md-4">
        <p><i class="fas fa-map-marker-alt me-2"></i>Số 46 Phạm Ngọc Thạch, Trung Tự, Đống Đa, Hà Nội</p>
        <p><i class="fas fa-phone me-2"></i> 0965540033</p>
        <p><i class="fas fa-envelope me-2"></i> chithanh1622003@gmail.com</p>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-light text-center text-muted mt-5 py-4 border-top">
    <div class="container">
      <h5 class="fw-bold mb-2">ChiThanhHotel</h5>
      <p class="mb-1">Số 46 Phạm Ngọc Thạch, Trung Tự, Đống Đa, Hà Nội</p>

      <div class="d-flex flex-wrap justify-content-center gap-3">
        <span>Điện thoại: <strong>+84 965540033</strong></span>
        <span>• Fax: <strong>+84 965540033</strong></span>
        <span>• Email: <a href="mailto:chithanh1622003@gmail.com">chithanh1622003@gmail.com</a></span>
      </div>

      <div class="mt-3">
        <a href="#" class="me-3 text-dark fs-4"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="text-dark fs-4"><i class="fab fa-instagram"></i></a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import axios from '@/config';
import ToastContainer from '@/components/Toast.vue';

// Toast state
const toastAction = ref('');
const toastMessage = ref('');
const toastVisible = ref(false);

// Hiển thị toast
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

const getTokenConfig = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Form & trạng thái
const form = ref({ name: '', email: '', message: '' });
const isSubmitting = ref(false);

// Gửi form
const submitForm = async () => {
  isSubmitting.value = true;

  try {
    const res = await axios.post('/contacts', form.value, getTokenConfig());
    showToast('success', 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!');
    form.value = { name: '', email: '', message: '' };
    console.log(res.data);
  } catch (err) {
    console.error(err);
    showToast('danger', 'Gửi liên hệ thất bại. Vui lòng thử lại.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
input,
textarea {
  font-size: 1rem;
}
</style>
