<template>
  <div class="container py-5">
    <h3 class="mb-3">Liên hệ với chúng tôi</h3>
    <p class="mb-4 text-muted">
      Bạn có câu hỏi nào không? Xin đừng ngần ngại liên hệ trực tiếp với chúng tôi. Nhóm của chúng tôi sẽ liên hệ với bạn trong vòng một vài giờ để giúp bạn.
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

        <div class="mt-3" v-if="successMessage" style="color: green">{{ successMessage }}</div>
        <div class="mt-3" v-if="errorMessage" style="color: red">{{ errorMessage }}</div>
      </div>

      <!-- Right: Contact Info -->
      <div class="col-md-4">
        <p><i class="fas fa-map-marker-alt me-2"></i> Khu đô thị Nam La Khê, Hà Đông, Hà Nội</p>
        <p><i class="fas fa-phone me-2"></i> 0981890099</p>
        <p><i class="fas fa-envelope me-2"></i> thuthaoshoes1997@gmail.com</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/config';

const form = ref({
  name: '',
  email: '',
  message: ''
});

const successMessage = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);
const submitForm = async () => {
  successMessage.value = '';
  errorMessage.value = '';
    isSubmitting.value = true;

  try {
    const res = await axios.post('/contacts', form.value);
        successMessage.value = 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!';
    form.value = { name: '', email: '', message: '' };
    console.log(res.data);
  } catch (err) {
        errorMessage.value = err.response?.data?.message || 'Gửi liên hệ thất bại. Vui lòng thử lại.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
input, textarea {
  font-size: 1rem;
}
</style>