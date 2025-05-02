<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";

// import Navbar from "@/examples/PageLayout/Navbar.vue";
// import AppFooter from "@/examples/PageLayout/Footer.vue";

const body = document.getElementsByTagName("body")[0];

const store = useStore();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});
</script>
<script>
import SignUpForm from "../components/Auth/SignUpForm.vue";
import axios from "../config";

export default {
  name: "Signup",
  data() {
    return {
      responseData: null,
      error: null,
      accessToken: localStorage.getItem("accessToken"),
    };
  },
  components: {
    SignUpForm,
  },
  props: {
    showToast: Function,
  },
  methods: {
    async Register(userData) {
      await axios
        .post("/signup", userData, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
        .then((response) => {
          // console.log("cc");
          this.responseData = response.data;
          this.error = null;
          this.showToast("success", this.$t("app.message.signup.success"));
          this.$router.push("/Signin");
        })
        .catch((error) => {
          if (error.response.data.message) {
            this.error = error.response.data.message;
            this.showToast("danger", this.error);
          } else if (error.response) {
            this.error = error.response.data.error.userName;
            this.showToast("warning", this.$t("app.message.signup.error"));
          } else if (error.code == -"ERR_NETWORK") {
            alert(this.$t("error.tokenExpire"));
            this.$router.push({ name: "Signin" });
          } else {
            // console.log(error);
            this.showToast(
              "danger",
              this.$t("errors.serverError")
            );
          }
          this.responseData = null;
        });
    },
    async handleRegister(userName, passWord, email) {
      const userData = {
        userName,
        passWord,
        email,
      };
      try {
        await this.Register(userData);
      } catch (error) {
        // console.error("Error creating account:", error);
      }
    },
    // async handleRegister({ userName, email, passWord }) {
    //   try {
    //     const response = await axios.post('/Users/Register', { userName, email, passWord });
    //     console.log('Registration successful:', response.data);
    //     this.$router.push('/Signin');
    //   } catch (error) {
    //     console.error('Registration error:', error.response ? error.response.data : error.message);
    //   }
    // }
  },
};
</script>
<style src="../assets/css/sign.css"></style>
<template>
  <!-- <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBtn="bg-gradient-light" />
      </div>
    </div>
  </div> -->
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
      style="
        background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg&quot;);
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">
              {{ $t("app.signup.register") }}
            </h1>
            <p class="text-lead text-white">
              {{ $t("app.signup.registerDesc") }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <h5>{{ $t("app.signup.title") }}</h5>
            </div>
            <div class="row px-xl-5 px-sm-4 px-3">
              <img class="logo" src="../assets/img/logos/logo.jpg" alt="" />
            </div>
            <div class="card-body">
              <SignUpForm :onSubmit="handleRegister" />
              <!-- <form role="form">
                <argon-input id="name" type="text" :placeholder="$t('app.signup.placeholder.username')"
                  aria-label="Name" v-model="userName" required />
                <argon-input id="email" type="email" :placeholder="$t('app.signup.placeholder.email')"
                  aria-label="Email" v-model="email" required />
                <argon-input id="passWord" type="passWord" :placeholder="$t('app.signup.placeholder.passWord')"
                  aria-label="passWord" v-model="passWord" required />
                <argon-checkbox checked>
                  <label class="form-check-label" for="flexCheckDefault">
                    {{ $t('app.signup.agree') }}
                    <a href="javascript:;" class="text-dark font-weight-bolder">{{ $t('app.signup.conditions') }}</a>
                  </label>
                </argon-checkbox>
                <div class="text-center">
                  <argon-button fullWidth color="dark" variant="gradient" class="my-4 mb-2">{{ $t('app.signup.button')
                    }}</argon-button>
                </div>
                <p class="text-sm mt-3 mb-0">
                  {{ $t('app.signup.alreadyAccount') }}
                  <router-link class="text-dark font-weight-bolder" to="/signin">{{
                    $t('app.signup.linkSignIn') }}</router-link>
                </p>
              </form> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <!-- <app-footer /> -->
</template>
