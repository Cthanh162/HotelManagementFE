<script setup>
import ArgonInput from "../ArgonInput.vue";
import ArgonCheckbox from "../ArgonCheckbox.vue";
import ArgonButton from "../ArgonButton.vue";
// import ArgonAlert from "../ArgonAlert.vue";
</script>
<template>
  <form role="form" @submit.prevent="handleSubmit">
    <!-- <argon-alert v-if="showAlert" color ="success">
           <p>{{ $t('app.message.signup.success')}}</p>
        </argon-alert> -->
    <argon-input
      id="name"
      type="text"
      :placeholder="$t('app.signup.placeholder.username')"
      aria-label="Name"
      v-model="trimmedUserName"
      @input="validateUserName"
      :isRequired="true"
    />
    <div class="error" v-if="errors.userName">
      {{ errors.userName }}
    </div>
    <argon-input
      id="email"
      type="email"
      :placeholder="$t('app.signup.placeholder.email')"
      aria-label="Email"
      v-model="email"
      :isRequired="true"
      @input="validateEmail"
    />
    <div class="error" v-if="errors.email">
      {{ errors.email }}
    </div>
    <argon-input
      id="password"
      type="password"
      :placeholder="$t('app.signup.placeholder.password')"
      aria-label="Password"
      icon="fa-solid fa-eye"
      iconDir="right"
      v-model="passWord"
      required
    />
    <div class="error" v-if="errors.passWord">
      {{ errors.passWord }}
    </div>
    <argon-checkbox checked>
      <label class="form-check-label" for="flexCheckDefault">
        {{ $t("app.signup.agree") }}
        <a href="javascript:;" class="text-dark font-weight-bolder">{{
          $t("app.signup.conditions")
        }}</a>
      </label>
    </argon-checkbox>
    <div class="text-center">
      <argon-button
        fullWidth
        color="dark"
        variant="gradient"
        class="my-4 mb-2"
        >{{ $t("app.signup.button") }}</argon-button
      >
    </div>
    <div class="px-1 pt-0 text-center card-footer px-lg-2">
      <p class="text-sm mt-3 mb-0 text-center">
        {{ $t("app.signup.alreadyAccount") }}
        <router-link class="text-dark font-weight-bolder" to="/signin">{{
          $t("app.signup.linkSignIn")
        }}</router-link>
      </p>
    </div>
  </form>
</template>
<style src="../../assets/css/signup.css"></style>
<script>
import AuthValidations from "../../configs/Auth/AuthValidations";
export default {
  name: "SignUpForm",
  components: {
    // ArgonAlert,
  },
  props: {
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      userName: "",
      email: "",
      passWord: "",
      errors: [],
      showAlert: false,
    };
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
  methods: {
    validateUserName() {
      if (this.userName.length > 20) {
        this.userName = this.userName.slice(0, 20);
      }
    },
    validateEmail() {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(this.email)) {
        this.errors.email = "Email không đúng định dạng";
        console.log("haha");
        return;
      } else {
        delete this.errors.email;
      }
    },
    handleSubmit() {
      let validations = new AuthValidations(
        this.email,
        this.trimmedUserName,
        this.passWord
      );
      this.errors = validations.checkValidations();
      if (
        "email" in this.errors ||
        "password" in this.errors ||
        "userName" in this.errors
      ) {
        return false;
      }

      // If any errors are found, return false
      if (this.errors.userName || this.errors.email) {
        return false;
      }
      this.onSubmit(this.trimmedUserName, this.passWord, this.email);
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 1000);
    },
  },
};
</script>
