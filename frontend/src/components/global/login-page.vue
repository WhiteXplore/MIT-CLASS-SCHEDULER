<template>
  <div class="relative w-full min-h-screen flex flex-col">
    <!-- Background Image -->
    <img
      src="@/assets/img/class-bg.png"
      alt="Background"
      class="absolute inset-0 object-cover w-full h-full z-0 opacity-95"
    />

    <!-- Form Container -->
    <div class="flex items-center justify-center min-h-screen relative z-20">
      <div
        class="form-wrapper w-auto h-auto rounded-xl shadow-lg flex overflow-hidden relative p-3 bg-opacity-90 backdrop-blur-[15px]"
        style="background-color: rgba(255, 255, 255, 0.1)"
      >
        <div class="form-inner flex justify-between gap-2 h-[41vh]">
          <!-- Left Info Section -->
          <div
            class="info-section z-10 w-[20vw] flex justify-center items-start text-white p-3"
          >
            <div class="flex flex-col justify-center items-center text-center">
              <img src="@/assets/img/st-logo.png" alt="" class="w-24" />
              <h1 class="font-bold text-[20px]">
                St. John Paul II College of Davao
              </h1>
              <p class="text-sm text-justify mt-5">
                St. John Paul II College of Davao (SJPIICD) is a private,
                non-sectarian institution in Matina, Davao City. It was founded
                by the Evangelista family in 2000 as the Philippine College of
                Innovative Education (PHILCIE), which initially offered 12
                undergraduate courses. As devout Catholics, the family was
                granted the permission by the Holy Father himself to rename the
                school with his name; thus, PHILCIE became John Paul II College
                of Davao in 2004.
                <a href="#" class="text-left flex mt-5 font-bold"
                  >Click here for more information!</a
                >
              </p>
            </div>
          </div>

          <!-- Right Login Form Section -->
          <div
            class="login-section z-10 w-[20vw] flex text-left bg-white rounded-xl p-4 flex-col justify-start items-center space-y-3"
          >
            <div class="flex flex-col text-left w-full pt-3">
              <h2 class="text-xl font-semibold text-gray-800">
                Sign in to Your Account
              </h2>
              <p class="text-[13px] text-gray-600 tracking-wider">
                Welcome back! Please enter your details
              </p>
            </div>

            <form
              @submit.prevent="login"
              class="space-y-4 text-[14px] w-full pt-4"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Email</label
                >
                <input
                  v-model="email"
                  type="email"
                  class="mt-1 block w-full px-3 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Password</label
                >
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="mt-1 block w-full px-3 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    @click="togglePassword"
                    class="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    <icon :name="showPassword ? 'eye-close' : 'eye-open'" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
              >
                Sign in
              </button>
              <div
                class="flex flex-col items-center gap-4 justify-center text-[12px] text-gray-600"
              >
                <router-link to="/register">
                  <p>
                    Don't have an account yet?
                    <span class="text-green-900 font-semibold underline"
                      >Register here!</span
                    >
                  </p>
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import authMixin from "../../mixin/authMixin";

export default {
  name: "LoginRegisterPage",
  mixins: [authMixin],
  components: {
    icon,
  },
  data() {
    return {
      showLogin: true,
      registrationStep: 1,
    };
  },
  methods: {
    toggleForm() {
      this.showLogin = !this.showLogin;
      this.registrationStep = 1;
      this.errorMessage = "";
    },
  },
};
</script>

<style scoped>
/* Responsive for Laptop Screens */
@media (min-width: 1024px) and (max-width: 1440px) {
  .form-wrapper {
    max-width: 70vw;
    padding: 2rem;
  }
  .form-inner {
    gap: 1.5rem;
    height: auto;
  }
  .info-section,
  .login-section {
    width: 30vw !important;
  }
  .info-section p {
    font-size: 0.85rem;
    line-height: 1.4;
  }
  .login-section {
    padding: 2rem;
  }
}
</style>
