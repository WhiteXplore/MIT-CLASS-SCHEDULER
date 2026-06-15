<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="submitData"
        class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg"
        ref="userForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="isEditMode ? 'edit' : 'add-account1.1'" />

            <h1 class="font-bold tracking-wide text-lg">
              {{ isEditMode ? "Edit User Account" : "Add User Account" }}
            </h1>
          </div>

          <icon name="circle-close3" @click="$emit('close')" class="cursor-pointer" />
        </div>

        <!-- Body -->
        <div class="p-5 w-[35vw] min-w-[500px]">
          <div class="grid grid-cols-2 gap-x-4 gap-y-4 w-full">
            <!-- Employee ID -->
            <div>
              <label class="block mb-2 font-semibold text-sm text-gray-700">
                Employee ID
              </label>
              <input
                v-model="form.employee_id"
                type="text"
                required
                placeholder="2025-001"
                class="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <!-- Position -->
            <div>
              <label class="block mb-2 font-semibold text-sm text-gray-700">
                Position
              </label>
              <input
                v-model="form.position"
                type="text"
                required
                placeholder="Instructor"
                class="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <!-- First Name -->
            <div>
              <label class="block mb-2 font-semibold text-sm text-gray-700">
                First Name
              </label>
              <input
                v-model="form.first_name"
                type="text"
                required
                placeholder="Enter first name"
                class="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label class="block mb-2 font-semibold text-sm text-gray-700">
                Last Name
              </label>
              <input
                v-model="form.last_name"
                type="text"
                required
                placeholder="Enter last name"
                class="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <!-- Office -->
            <div>
              <label class="block mb-2 font-semibold text-sm text-gray-700">
                Office
              </label>
              <input
                v-model="form.office"
                type="text"
                required
                placeholder="Registrar"
                class="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <!-- Role -->
            <div>
              <label class="block mb-2 font-semibold text-sm text-gray-700"> Role </label>
              <select
                v-model="form.role"
                required
                class="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" disabled>Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Faculty">Faculty</option>
                <!-- <option value="Staff">Staff</option> -->
              </select>
            </div>

            <!-- Email -->
            <div>
              <label class="block mb-2 font-semibold text-sm text-gray-700">
                Email Address
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="Enter email address"
                class="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <!-- Password -->
            <div v-if="!isEditMode">
              <label class="block mb-2 font-semibold text-sm text-gray-700">
                Password
              </label>
              <input
                v-model="form.password"
                type="password"
                required
                placeholder="Enter password"
                class="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-gray-200 mt-6"></div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="px-5 py-2.5 rounded-lg border border-red-600 bg-red-600 text-white font-medium transition-all duration-200 hover:bg-white hover:text-red-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="px-5 py-2.5 rounded-lg border border-green-600 bg-green-600 text-white font-medium transition-all duration-200 hover:bg-white hover:text-green-600"
            >
              {{ isEditMode ? "Update User" : "Submit" }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import icon from "@/assets/icon.vue";
import { toast } from "vue3-toastify";

export default {
  name: "UserForm",

  components: {
    icon,
  },

  props: {
    userData: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      form: {
        employee_id: "",
        first_name: "",
        last_name: "",
        position: "",
        office: "",
        email: "",
        password: "",
        role: "",
      },
    };
  },

  computed: {
    isEditMode() {
      return !!this.userData;
    },
  },

  mounted() {
    if (this.userData) {
      this.form = {
        employee_id: this.userData.employee_id,
        first_name: this.userData.first_name,
        last_name: this.userData.last_name,
        position: this.userData.position,
        office: this.userData.office,
        email: this.userData.email,
        password: "",
        role: this.userData.role,
      };
    }
  },

  methods: {
    async submitData() {
      try {
        if (this.isEditMode) {
          const payload = {
            employee_id: this.form.employee_id,
            first_name: this.form.first_name,
            last_name: this.form.last_name,
            position: this.form.position,
            office: this.form.office,
            email: this.form.email,
            role: this.form.role,
          };

          await axios.patch(
            `${process.env.VUE_APP_API_BASE_URL}/user/${this.userData.id}`,
            payload
          );
          toast.success("User updated successfully");
        } else {
          await axios.post(`${process.env.VUE_APP_API_BASE_URL}/user`, this.form);

          toast.success("User created successfully");
        }

        const audio = new Audio(require("@/assets/add.mp3"));

        audio.play();

        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        console.error(error);

        toast.error(error.response?.data?.message || "Operation failed");
      }
    },
  },
};
</script>
