<script setup>
import axios from '@/config';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonSwitch from '@/components/ArgonSwitch.vue';
import ArgonButton from '@/components/ArgonButton.vue';
// import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
</script>

<template>
      <ToastContainer v-if="showToastFlag" :action="toastAction" :message="toastMessage" />

  <form role="form" @submit.prevent="handleSubmit">
    <div class="mb-3">
      <argon-input
        id="username"
        type="text"
        placeholder="Nhập tên tài khoản"
        v-model="userName"
        size="lg"
        required
      />
      <div class="error" v-if="errors.userName">
        {{ errors.userName }}
      </div>
    </div>
    <div class="mb-3">
      <argon-input
        id="password"
        type="password"
        placeholder="Nhập mật khẩu"
        v-model="passWord"
        size="lg"
        required
      />
      <div class="error" v-if="errors.passWord">
        {{ errors.passWord }}
      </div>
    </div>
    <div v-if="localShowCaptcha" class="mb-3">
      <vue-hcaptcha
        sitekey="ea484d06-3cee-4c2a-a994-e1b266f0974a"
        @verify="onCaptchaSuccess"
      ></vue-hcaptcha>
    </div>
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <argon-switch
        id="rememberMe"
        type="checkbox"
        name="remember-me"
        :checked="rememberMe"
        @input="rememberMeChange"
      >Ghi nhớ đăng nhập</argon-switch>
    </div>
    <div class="text-center">
      <argon-button
        type="submit"
        class="mt-4"
        variant="gradient"
        color="success"
        fullWidth
        size="lg"
      >Đăng nhập</argon-button>
    </div>
  </form>
</template>

<script>
import ToastContainer from '../Toast.vue';
import { ref, nextTick } from 'vue';

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
export default {
  name: 'SignInForm',
  props: {
    showCaptcha: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userName: '',
      passWord: '',
      rememberMe: false,
      captchaToken: '',
      localShowCaptcha: false,
      errors: {},
    };
  },
  created() {
    if (localStorage.getItem('rememberMe') === 'true') {
      this.userName = localStorage.getItem('userName') || '';
      this.passWord = localStorage.getItem('passWord') || '';
      this.rememberMe = true;
    }
  },
  watch: {
    showCaptcha(newVal) {
      this.localShowCaptcha = newVal;
    },
  },
  methods: {
    rememberMeChange() {
      this.rememberMe = !this.rememberMe;
    },
    onCaptchaSuccess(token) {
      this.captchaToken = token;
    },
    async handleSubmit() {
      this.errors = {};
      if (!this.userName) this.errors.userName = 'Vui lòng nhập tên tài khoản';
      if (!this.passWord) this.errors.passWord = 'Vui lòng nhập mật khẩu';
      if (Object.keys(this.errors).length) return;

      try {
        const res = await axios.post('/login', {
          userName: this.userName,
          password: this.passWord,
        });

        const token = res.data.token.access_token;
        const user = res.data.user;

        console.log("hâhh",user);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userRole', JSON.stringify({
          id: 1,
          username: 'admin',
          role: user.roles.includes("admin") // hoặc 'user'
        }));
         showToast('success', 'Đăng nhập thành công!');
        if (this.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userName', this.userName);
          localStorage.setItem('passWord', this.passWord);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('userName');
          localStorage.removeItem('passWord');
        }

        this.$router.push({ name: 'Home' });
      } catch (err) {
        if (err.response) {
          const status = err.response.status;
          const msg = err.response.data?.message || 'Lỗi không xác định';

          if (status === 401) {
            this.errors.userName = 'Sai tài khoản hoặc mật khẩu.';
            showToast('danger', 'Sai tài khoản hoặc mật khẩu!');
          } else if (status === 422) {
            this.errors.userName = msg;
            showToast('danger', 'Đăng nhập thất bại!');
          } else {
            this.errors.userName = `Lỗi máy chủ (${status}): ${msg}`;
            showToast('danger', 'Lỗi máy chủ');
          }
        } else {
          this.errors.userName = 'Không thể kết nối tới máy chủ. Vui lòng thử lại sau.';
            showToast('danger', 'Không thể kết nối tới máy chủ. Vui lòng thử lại sau.');

        }
        console.error('Đăng nhập lỗi:', err);
      }
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>