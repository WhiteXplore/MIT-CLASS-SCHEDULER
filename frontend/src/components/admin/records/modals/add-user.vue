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

          <icon
            name="circle-close3"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>

        <!-- Body -->
        <div class="p-5 w-[35vw] min-w-[500px]">
          <!-- Step Indicator -->
          <div class="flex items-center justify-center mb-8">
            <!-- Step 1 -->
            <div class="flex items-center">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
                  step === 1
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-600',
                ]"
              >
                1
              </div>

              <span
                :class="[
                  'ml-3 font-semibold',
                  step === 1 ? 'text-green-600' : 'text-gray-500',
                ]"
              >
                User Information
              </span>
            </div>

            <div class="w-16 h-[2px] bg-gray-300 mx-5"></div>

            <!-- Step 2 -->
            <div class="flex items-center">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
                  step === 2
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-500',
                ]"
              >
                2
              </div>

              <span
                :class="[
                  'ml-3 font-semibold',
                  step === 2 ? 'text-green-600' : 'text-gray-500',
                ]"
              >
                Account Information
              </span>
            </div>
          </div>

          <!-- STEP 1 -->
          <div v-if="step === 1" class="grid grid-cols-2 gap-4">
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
            <div class="col-span-2">
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
          </div>

          <!-- STEP 2 -->
          <div v-if="step === 2" class="grid grid-cols-2 gap-4">
            <!-- Role -->
            <div>
              <label class="block mb-2 font-semibold text-sm text-gray-700">
                Role
              </label>

              <select
                v-model="form.role"
                required
                class="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" disabled>Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Faculty">Faculty</option>
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
            <div class="col-span-2">
              <label class="block mb-2 font-semibold text-sm text-gray-700">
                {{ isEditMode ? "New Password (Optional)" : "Password" }}
              </label>

              <input
                v-model="form.password"
                type="password"
                :required="!isEditMode"
                :placeholder="
                  isEditMode
                    ? 'Leave blank to keep current password'
                    : 'Enter password'
                "
                class="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div class="border-t border-gray-200 mt-6"></div>

          <!-- Buttons -->
          <div class="flex justify-between mt-6">
            <button
              v-if="step === 2"
              type="button"
              @click="step--"
              class="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Previous
            </button>

            <div v-else></div>

            <div class="flex gap-3">
              <button
                type="button"
                @click="$emit('close')"
                class="px-5 py-2.5 rounded-lg border border-red-600 bg-red-600 text-white hover:bg-white hover:text-red-600"
              >
                Cancel
              </button>

              <button
                v-if="step === 1"
                type="button"
                @click="nextStep"
                class="px-5 py-2.5 rounded-lg border border-green-600 bg-green-600 text-white hover:bg-white hover:text-green-600"
              >
                Next
              </button>

              <button
                v-else
                type="submit"
                class="px-5 py-2.5 rounded-lg border border-green-600 bg-green-600 text-white hover:bg-white hover:text-green-600"
              >
                {{ isEditMode ? "Update User" : "Save User" }}
              </button>
            </div>
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
      step: 1,
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
    nextStep() {
      if (
        !this.form.employee_id ||
        !this.form.first_name ||
        !this.form.last_name ||
        !this.form.position ||
        !this.form.office
      ) {
        toast.warning("Please complete all user information.");
        return;
      }

      this.step = 2;
    },
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
            ...(this.form.password.trim() && {
              password: this.form.password,
            }),
          };

          await axios.patch(
            `${process.env.VUE_APP_API_BASE_URL}/user/update-user/${this.userData.id}`,
            payload,
          );
          toast.success("User updated successfully");
        } else {
          await axios.post(
            `${process.env.VUE_APP_API_BASE_URL}/user`,
            this.form,
          );

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
