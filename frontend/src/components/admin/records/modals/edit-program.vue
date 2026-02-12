<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="submitData"
        class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg"
        ref="programsForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'add-students'" />
            <h1 class="font-bold tracking-wide text-lg">Edit Programs</h1>
          </div>
          <icon
            :name="'circle-close3'"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>

        <!-- Form body -->
        <div class="p-5 w-[30vw] space-y-3">
          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="program_name" class="font-bold">Program Name:</label>
            <input
              v-model.trim="form.program_name"
              type="text"
              id="program_name"
              required
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter program name"
            />
          </div>

          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="program_code" class="font-bold">Program Code:</label>
            <input
              v-model.trim="form.program_code"
              type="text"
              id="program_code"
              required
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter program code"
            />
          </div>

          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="program_major" class="font-bold">Program Major:</label>
            <input
              v-model.trim="form.program_major"
              type="text"
              id="program_major"
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter program major (optional)"
            />
          </div>

          <!-- Divider -->
          <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

          <!-- Buttons -->
          <div class="tracking-wide flex justify-end gap-2 mt-4">
            <button
              class="bg-red-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
              @click="$emit('close')"
              type="button"
            >
              Cancel
            </button>
            <button
              class="bg-green-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              :disabled="loading"
            >
              {{ loading ? "Saving..." : "Save Changes" }}
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
  name: "EditProgramsPage",
  components: {
    icon,
  },
  props: {
    programData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        program_name: "",
        program_code: "",
        program_major: "",
      },
      loading: false,
    };
  },
  methods: {
    async submitData() {
      const formEl = this.$refs.programsForm;
      if (!formEl.checkValidity()) {
        formEl.reportValidity();
        return;
      }

      // Set default major if empty
      if (!this.form.program_major || this.form.program_major.trim() === "") {
        this.form.program_major = "-";
      }

      this.loading = true;
      try {
        await axios.patch(
          `http://localhost:8000/programs/update-program/${this.programData.program_id}`,
          this.form
        );
        toast.success("Program updated successfully!");

        const audio = new Audio(require("@/assets/add.mp3"));
        audio.play();

        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        const errMsg =
          error.response?.data?.message ||
          "Failed to update program. Please try again.";
        console.error("Error updating program:", error.response?.data || error);
        toast.error(errMsg);
      } finally {
        this.loading = false;
      }
    },
    populateForm() {
      // safer clone to prevent mutating props directly
      this.form = structuredClone
        ? structuredClone(this.programData)
        : { ...this.programData };
    },
  },
  mounted() {
    this.populateForm();
  },
};
</script>
