<template>
  <!-- Profile Menu -->
  <div
    v-if="isProfileMenuOpen"
    @mouseenter="isProfileMenuOpen = true"
    @mouseleave="isProfileMenuOpen = false"
    class="bg-white shadow-lg w-full h-full p-3 text-[13px] cursor-pointer rounded-md inset-0 z-50 mt-5 border"
    @click.stop
  >
    <div class="space-y-2 w-[150px]">
      <div
        class="flex items-center hover:bg-blue-500 hover:text-white rounded-md w-auto p-2 py-1 ml-2 gap-2 cursor-pointer"
        @click="goToProfile"
      >
        <icon name="users" />
        <div>Profile</div>
      </div>

      <div
        class="flex items-center hover:bg-blue-500 hover:text-white rounded-md w-auto p-2 py-1 ml-2 gap-2"
        @click="toggleOpenLogout"
      >
        <icon name="logout" />
        <div>Logouts</div>
      </div>
    </div>
  </div>
  <!-- 
  <ViewProfile :isOpen="isOpenProfile" @close="isOpenProfile = false" /> -->
  <!-- Logout Modal -->
  <Logout :isOpen="isOpenLogout" @close="isOpenLogout = false" />
</template>

<script>
import Logout from "./alert/logout.vue";
import icon from "@/assets/icon.vue";
// import ViewProfile from "../navigation/profile/view-profile.vue";
export default {
  name: "ProfilePage",
  components: {
    Logout,
    icon,
    // ViewProfile,
  },
  data() {
    return {
      isOpenLogout: false,
      isProfileMenuOpen: true,
      isOpenProfile: false,
    };
  },
  methods: {
    goToProfile() {
      this.$router.push("/profile"); // Change '/profile' to your actual route
    },
    toggleCloseProfile() {
      this.isProfileMenuOpen = false;
    },
    toggleOpenLogout() {
      this.isOpenLogout = true; // Show the logout modal
    },
  },
  watch: {
    $route(to) {
      if (to.path === "/profile-view") {
        this.isProfileMenuOpen = false;
      }
    },
  },
  mounted() {
    if (this.$route.path === "/profile-view") {
      this.isProfileMenuOpen = false;
    }
  },
};
</script>
