<script setup>
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import VueHcaptcha from "@hcaptcha/vue3-hcaptcha";
// import ArgonAlert from "@/components/ArgonAlert.vue";
</script>

<template>
  <form role="form" @submit.prevent="handleSubmit">
    <div class="mb-3">
      <argon-input
        id="username"
        type="text"
        :placeholder="$t('app.signin.placeholder.username')"
        v-model="trimmedUserName"
        size="lg"
        @input="validateUserName"
        :isRequired="true"
      />
      <div class="error" v-if="errors.userName">
        {{ errors.userName }}
      </div>
    </div>
    <div class="mb-3">
      <argon-input
        id="password"
        type="password"
        :placeholder="$t('app.signin.placeholder.password')"
        v-model="passWord"
        icon="fa-solid fa-eye"
        iconDir="right"
        size="lg"
        :isRequired="true"
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
    <div class="mb">
      <div class="col2">
        <argon-switch
          class="remember"
          id="rememberMe"
          type="checkbox"
          name="remember-me"
          :checked="rememberMe"
          @input="rememberMeChange"
          >{{ $t("app.signin.remember") }}</argon-switch
        >
      </div>
      <div class="col">
        <router-link
          class="text-success text-gradient font-weight-bold link-forgot text-sm"
          to="/forgot"
          >{{ $t("app.signin.linkForgot") }}</router-link
        >
      </div>
    </div>
    <div class="text-center">
      <argon-button
        type="submit"
        class="mt-4"
        variant="gradient"
        color="success"
        fullWidth
        size="lg"
        >{{ $t("app.signin.button") }}</argon-button
      >
    </div>
  </form>
</template>

<script>
import AuthValidations from "../../configs/Auth/AuthValidations";
export default {
  name: "SignInForm",
  components: { VueHcaptcha },
  props: {
    onSubmit: {
      type: Function,
      required: true,
    },
    showCaptcha: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userName: "",
      passWord: "",
      errors: [],
      rememberMe: false,
      captchaToken: "",
      localShowCaptcha: false,
    };
  },
  created() {
    localStorage.removeItem("userid");
    localStorage.removeItem("accessToken");
    if (localStorage.getItem("rememberMe") === "true") {
      this.userName = localStorage.getItem("userName") || "";
      this.passWord = localStorage.getItem("passWord") || "";
      this.rememberMe = true;
    }
    console.log(this.localShowCaptcha);
  },
  computed: {
    trimmedUserName: {
      get() {
        return this.userName.trim();
      },
      set(value) {
        this.userName = value.trim();
      },
    },
  },
  watch: {
    showCaptcha(newVal) {
      this.localShowCaptcha = newVal;
    },
  },
  methods: {
    validateUserName() {
      if (this.userName.length > 20) {
        this.userName = this.userName.slice(0, 20);
      }
    },
    onCaptchaSuccess(token) {
      this.captchaToken = token;
    },
    async handleSubmit() {
      try {
        await this.onSubmit(
          this.userName,
          this.passWord,
          this.rememberMe,
          this.captchaToken
        );
      } catch (error) {
        let validations = new AuthValidations(this.userName, this.passWord);
        this.errors = validations.checkValidations();

        if (
          "userName" in this.errors ||
          "password" in this.errors ||
          "email" in this.errors
        ) {
          return false;
        }
      }
    },
    rememberMeChange() {
      this.rememberMe = !this.rememberMe;
    },
  },
};
</script>
