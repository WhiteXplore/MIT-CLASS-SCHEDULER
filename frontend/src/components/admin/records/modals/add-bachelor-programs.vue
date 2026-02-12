<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="submitData"
        class="w-full bg-white text-[13px] rounded-[15px] shadow-lg"
        ref="bachelorprogramsForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'add-students'" />
            <h1 class="font-bold tracking-wide text-lg">
              Add Bachelor Program
            </h1>
          </div>
          <icon
            :name="'circle-close3'"
            class="cursor-pointer"
            @click="$emit('close')"
            aria-label="Close modal"
          />
        </div>

        <!-- Form Body -->
        <div class="p-5 w-[25vw] space-y-3">
          <!-- Program Category -->
          <div class="w-full space-y-2 text-left">
            <label for="bachelor_category" class="font-bold"
              >Program Category:</label
            >
            <input
              type="text"
              id="bachelor_type"
              v-model="form.bachelor_category"
              required
              class="w-full border px-4 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter bachelor category"
            />
          </div>

          <!-- Bachelor Type -->
          <div class="w-full space-y-2 text-left">
            <label for="bachelor_type" class="font-bold">Bachelor Type:</label>
            <input
              type="text"
              id="bachelor_type"
              v-model="form.bachelor_type"
              required
              class="w-full border px-4 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter bachelor type"
            />
          </div>

          <!-- Divider -->
          <div class="w-full h-[1px] bg-gray-200 mt-4 rounded-md"></div>

          <!-- Buttons -->
          <div class="flex justify-end gap-2 mt-4">
            <button
              type="button"
              class="bg-red-600 px-3 py-2 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-green-600 px-3 py-2 rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md"
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
  name: "AddBachelorProgramsPage",
  components: { icon },
  data() {
    return {
      form: {
        bachelor_category: "",
        bachelor_type: "",
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
          "http://localhost:8000/bachelor/add-bachelor",
          this.form
        );
        this.$emit("close");
        toast.success("Bachelor program added successfully!");
      } catch (error) {
        toast.error("Failed to add bachelor program. Please try again.");
      }
    },
  },
};
</script>
