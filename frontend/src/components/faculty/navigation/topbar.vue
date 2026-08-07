<template>
  <div
    class="relative bg-white rounded-t-lg shadow px-3 sm:px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
  >
    <!-- Left Section -->
    <div
      class="flex items-center justify-end lg:justify-between w-full md:w-auto"
    >
      <div class="flex flex-col items-start">
        <h2 class="text-lg font-bold text-gray-900 hidden lg:block">
          Welcome back,
          <span class="text-green-700">
            {{ user.first_name || "Guest" }}
          </span>
        </h2>

        <p class="text-sm text-gray-500 hidden lg:block">
          Manage schedules and monitor classes efficiently.
        </p>
      </div>
      <!-- Mobile Date & Time -->
      <div
        class="absolute left-1/2 -translate-x-1/2 md:hidden text-center text-[11px] text-gray-600"
      >
        <div class="text-gray-800 font-bold">{{ formattedDate }}</div>
        <div>{{ formattedTime }}</div>
      </div>
      <!-- Mobile Profile -->
      <div
        class="md:hidden cursor-pointer"
        ref="mobileProfileIcon"
        @click.stop="toggleOpenProfile"
      >
        <img
          src="../../../assets/img/users.png"
          alt="Profile"
          class="w-9 h-9 rounded-xl object-cover border border-gray-300"
        />
      </div>
    </div>

    <!-- Date & Time -->
    <div
      class="hidden lg:block text-center text-[11px] sm:text-xs md:text-sm text-gray-600"
    >
      <div class="text-gray-800 font-bold">{{ formattedDate }}</div>
      <div>{{ formattedTime }}</div>
    </div>

    <!-- Desktop User -->
    <div class="hidden md:flex gap-4 items-center text-right">
      <div>
        <h1 class="text-[13px] font-semibold">
          {{ user.last_name }},
          {{ user.first_name || "Guest" }}
        </h1>

        <h2 class="text-[12px] text-gray-500">
          {{ user.role || "No Position" }}
        </h2>
      </div>

      <div
        ref="desktopProfileIcon"
        class="cursor-pointer"
        @click.stop="toggleOpenProfile"
      >
        <img
          src="../../../assets/img/users.png"
          alt="Profile"
          class="w-9 h-9 rounded-xl object-cover border border-gray-300"
        />
      </div>
    </div>

    <!-- Profile Dropdown -->
    <div
      v-if="isOpenProfile"
      ref="profileDropdown"
      class="fixed top-16 right-4 z-[9999]"
    >
      <Profile />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Profile from "./profile-setting.vue";

export default {
  name: "TopBarPage",

  components: {
    Profile,
  },

  data() {
    return {
      isOpenProfile: false,
      user: {},
      currentTime: new Date(),
      timer: null,
    };
  },

  computed: {
    formattedDate() {
      const options = {
        year: "numeric",
        month: "long",
        day: "2-digit",
        weekday: "long",
      };

      return this.currentTime.toLocaleDateString("en-US", options);
    },

    formattedTime() {
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };

      return this.currentTime.toLocaleTimeString("en-US", options);
    },
  },

  mounted() {
    this.fetchUser();

    document.addEventListener("click", this.handleClickOutside);

    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);

    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  methods: {
    toggleOpenProfile() {
      this.isOpenProfile = !this.isOpenProfile;
    },

    handleClickOutside(event) {
      const dropdown = this.$refs.profileDropdown;
      const mobileIcon = this.$refs.mobileProfileIcon;
      const desktopIcon = this.$refs.desktopProfileIcon;

      const clickedMobile = mobileIcon && mobileIcon.contains(event.target);

      const clickedDesktop = desktopIcon && desktopIcon.contains(event.target);

      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        !clickedMobile &&
        !clickedDesktop
      ) {
        this.isOpenProfile = false;
      }
    },

    async fetchUser() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/auth/me",
          {
            withCredentials: true,
          },
        );

        if (response.data) {
          this.user = response.data;
        } else {
          this.$router.push("/");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
@media (max-width: 768px) {
  .profile-dropdown {
    width: calc(100vw - 2rem);
    max-width: 350px;
  }
}
</style>
