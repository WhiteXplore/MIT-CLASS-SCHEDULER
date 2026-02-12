<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="submitData"
        class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg"
        ref="masterprogramsForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'add-students'" />
            <h1 class="font-bold tracking-wide text-lg">Edit Master Program</h1>
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
            <label for="master_category" class="font-bold"
              >Master Category:</label
            >
            <input
              type="text"
              id="master_category"
              v-model="form.master_category"
              required
              class="w-full border px-4 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter master category"
            />
          </div>

          <!-- Master Type -->
          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="master_type" class="font-bold">Master Type:</label>
            <input
              type="text"
              id="master_type"
              v-model="form.master_type"
              required
              class="w-full border px-4 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter master type"
            />
          </div>

          <!-- Divider -->
          <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

          <!-- Buttons -->
          <div class="tracking-wide flex justify-end gap-2 mt-4">
            <button
              type="button"
              class="bg-red-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-green-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md"
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
  name: "EditMasterProgramPage",
  components: {
    icon,
  },
  props: {
    masterProgram: {
      type: Object,
      required: true,
      default: () => ({
        master_category: "",
        master_type: "",
      }),
    },
  },
  data() {
    return {
      form: {
        master_category: "",
        master_type: "",
      },
    };
  },
  watch: {
    masterProgram: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = { ...newVal };
        }
      },
    },
  },
  methods: {
    async submitData() {
      const formElement = this.$refs.masterprogramsForm;
      if (!formElement.checkValidity()) {
        formElement.reportValidity();
        return;
      }

      try {
        // Use PUT to update existing record by ID
        await axios.patch(
          `http://localhost:8000/master/${this.masterProgram.masterprogram_id}`,
          this.form
        );

        this.$emit("close");
        toast.success("Master program updated successfully!");
      } catch (error) {
        toast.error("Failed to update Master program. Please try again.");
      }
    },
  },
};
</script>
