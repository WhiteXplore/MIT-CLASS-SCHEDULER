<template>
  <div class="relative w-full min-h-screen flex flex-col">
    <!-- Background Image -->
    <img
      src="@/assets/img/class-bg.png"
      alt="Background"
      class="absolute inset-0 object-cover w-full h-full z-0 opacity-95"
    />

    <!-- Form Container -->
    <div class="flex items-center justify-center min-h-screen relative z-20 px-4 py-6">
      <div
        class="form-wrapper rounded-xl shadow-lg overflow-hidden relative p-3 bg-opacity-90 backdrop-blur-[15px]"
      >
        <div class="form-inner flex flex-col lg:flex-row justify-between gap-4">
          <!-- Left Info Section -->
          <div
            class="info-section w-full lg:w-1/2 flex justify-center items-center text-white p-4"
          >
            <div class="flex flex-col justify-center items-center text-center">
              <img src="@/assets/img/st-logo.png" alt="" class="w-20 md:w-24" />

              <h1 class="font-bold text-lg md:text-2xl mt-2">
                St. John Paul II College of Davao
              </h1>

              <p
                class="text-xs md:text-sm text-center md:text-justify mt-4 leading-relaxed"
              >
                St. John Paul II College of Davao (SJPIICD) is a private, non-sectarian
                institution in Matina, Davao City. It was founded by the Evangelista
                family in 2000 as the Philippine College of Innovative Education
                (PHILCIE).

                <a href="#" class="block mt-4 font-bold underline">
                  Click here for more information!
                </a>
              </p>
            </div>
          </div>

          <!-- Login Section -->
          <div
            class="login-section w-full lg:w-[420px] bg-white rounded-xl p-5 md:p-6 flex flex-col justify-center"
          >
            <div class="flex flex-col text-left w-full">
              <h2 class="text-xl md:text-2xl font-semibold text-gray-800">
                Sign in to Your Account
              </h2>

              <p class="text-xs md:text-sm text-gray-600 tracking-wide">
                Welcome back! Please enter your details
              </p>
            </div>

            <form @submit.prevent="login" class="space-y-4 text-[14px] w-full pt-5">
              <div>
                <label class="block text-sm font-medium text-gray-700"> Email </label>

                <input
                  v-model="email"
                  type="email"
                  class="mt-1 block w-full px-3 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"> Password </label>

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
                class="flex flex-col items-center justify-center text-[12px] text-gray-600"
              >
                <router-link to="/register">
                  <p class="text-center">
                    Don't have an account yet?

                    <span class="text-green-900 font-semibold underline">
                      Register here!
                    </span>
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
/* KEEP THIS EXACTLY AS IT IS */
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

/* Desktop (>1440px) */
.form-wrapper {
  width: 40%;
  min-width: 850px;
}

/* Tablet */
@media (max-width: 1023px) {
  .form-wrapper {
    width: 90%;
    min-width: unset;
  }

  .form-inner {
    flex-direction: column;
  }

  .info-section,
  .login-section {
    width: 100% !important;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .form-wrapper {
    width: 95%;
    padding: 1rem;
  }

  .form-inner {
    flex-direction: column;
    gap: 1rem;
  }

  .info-section {
    width: 100% !important;
    padding: 1rem;
  }

  .login-section {
    width: 100% !important;
    padding: 1.25rem;
  }

  .info-section img {
    width: 70px;
  }

  .info-section h1 {
    font-size: 1.2rem;
    line-height: 1.4;
  }

  .info-section p {
    font-size: 0.8rem;
    line-height: 1.5;
    text-align: center;
  }
}

/* Small Phones */
@media (max-width: 480px) {
  .form-wrapper {
    width: 100%;
    margin: 0 10px;
    padding: 0.75rem;
  }

  .info-section {
    padding: 0.5rem;
  }

  .info-section img {
    width: 60px;
  }

  .info-section h1 {
    font-size: 1rem;
  }

  .info-section p {
    display: none;
  }

  .login-section {
    padding: 1rem;
  }

  .login-section h2 {
    font-size: 1.25rem;
  }

  .login-section p {
    font-size: 0.75rem;
  }

  input,
  button {
    font-size: 14px;
  }
}
</style>
