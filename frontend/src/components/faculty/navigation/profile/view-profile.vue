<template>
  <div class="p-6 text-gray-800 w-full min-h-screen bg-[#F4F6F8] rounded-t-xl">
    <h1 class="text-2xl font-bold text-left mb-1">Account Settings</h1>
    <p class="text-sm text-gray-500 mb-5 text-left">
      Manage your personal details and security preferences here.
    </p>

    <div
      class="w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <!-- Gradient Header -->
      <div class="h-28 bg-gradient-to-r from-blue-200 to-blue-400"></div>

      <!-- Profile -->
      <div class="px-8 pb-8">
        <div class="flex justify-between items-start mt-2">
          <div class="flex items-center gap-4">
            <!-- Initial Avatar -->
            <div
              class="w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-semibold shadow-md border-4 border-white"
            >
              {{ user.first_name?.charAt(0) }}{{ user.last_name?.charAt(0) }}
            </div>

            <div>
              <h2 class="text-xl font-semibold text-gray-800">
                {{ user.first_name }} {{ user.last_name }}
              </h2>

              <p class="text-sm text-gray-500">
                {{ user.email }}
              </p>
            </div>
          </div>

          <button
            @click="editProfile"
            class="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-lg transition"
          >
            Edit
          </button>
        </div>

        <!-- Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div>
            <label class="text-sm text-gray-500 mb-2 block"> First Name </label>

            <div class="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
              {{ user.first_name }}
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-500 mb-2 block"> Last Name </label>

            <div class="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
              {{ user.last_name }}
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-500 mb-2 block"> Position </label>

            <div class="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
              {{ user.position || "No Position" }}
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-500 mb-2 block"> Office </label>

            <div class="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
              {{ user.office || "No Office" }}
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="text-sm text-gray-500 mb-2 block">
              Email Address
            </label>

            <div class="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
              {{ user.email }}
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="text-sm text-gray-500 mb-2 block">
              Contact Number
            </label>

            <div class="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
              {{ user.contact_number || "No Contact Number" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <addUser
    v-if="showEditModal"
    :userData="selectedUser"
    @close="showEditModal = false"
    @refresh="refreshUser"
  />
</template>

<script>
// import icon from "@/assets/icon.vue";
import axios from "axios";
import addUser from "@/components/admin/records/modals/add-user.vue";
export default {
  name: "ProfileContentPage",
  components: {
    // icon,
    addUser,
  },
  data() {
    return {
      isOpenProfile: false,
      user: {},
      showEditModal: false,
      selectedUser: null,
    };
  },
  methods: {
    editProfile() {
      this.selectedUser = {
        id: this.user.sub,
        employee_id: this.user.employee_id,
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        position: this.user.position,
        office: this.user.office,
        email: this.user.email,
        role: this.user.role,
      };

      this.showEditModal = true;
    },
    refreshUser() {
      this.fetchUser();
    },
    toggleOpenProfile() {
      this.isOpenProfile = !this.isOpenProfile;
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
          console.log("Authenticated User:", this.user);
        } else {
          this.$router.push("/");
          location.reload();
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        this.$router.push("/");
      }
    },
  },
  mounted() {
    this.fetchUser();
  },
};
</script>

<style></style>
