<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="submitData"
        class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg"
        ref="bachelorprogramsForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'add-students'" />
            <h1 class="font-bold tracking-wide text-lg">
              Add Doctorate Program
            </h1>
          </div>
          <icon
            :name="'circle-close3'"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>

        <!-- Form Body -->
        <div class="p-5 w-[25vw] space-y-3">
          <!-- Program Category -->
          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="doctorate_category" class="font-bold"
              >Doctorate Category:</label
            >
            <input
              type="text"
              id="doctorate_category"
              v-model="form.doctorate_category"
              required
              class="w-full border px-4 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter bachelor category"
            />
          </div>

          <!-- Program Bachelor -->
          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="doctorate_type" class="font-bold"
              >Doctorate Type:</label
            >
            <input
              type="text"
              id="doctorate_type"
              v-model="form.doctorate_type"
              required
              class="w-full border px-4 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter bachelor type"
            />
          </div>

          <!-- Divider -->
          <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

          <!-- Buttons -->
          <div class="tracking-wide flex justify-end gap-2 mt-4">
            <button
              type="button"
              class="bg-red-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md cursor-pointer"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-green-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import { toast } from "vue3-toastify";
import axios from "axios";
export default {
  name: "AddDoctorateProgramsPage",
  components: {
    icon,
  },
  data() {
    return {
      form: {
        doctorate_category: "",
        doctorate_type: "",
      },
    };
  },
  methods: {
    async submitData() {
      const formElement = this.$refs.bachelorprogramsForm;
      if (!formElement.checkValidity()) {
        formElement.reportValidity();
        return;
      }

      try {
        await axios.post(
          process.env.VUE_APP_API_BASE_URL + "/doctorate/add-doctorate",
          this.form,
        );
        this.$emit("close");
        toast.success("Doctorate program added successfully!");
      } catch (error) {
        toast.error("Failed to add doctorate program. Please try again.");
      }
    },
  },
};
</script>
