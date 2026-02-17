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
            <h1 class="font-bold tracking-wide text-lg">Add Programs</h1>
          </div>
          <icon
            :name="'circle-close3'"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>
        <div class="p-5 w-[30vw] space-y-3">
          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="program_name" class="font-bold">Program Name:</label>
            <input
              v-model="form.program_name"
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
              v-model="form.program_code"
              type="text"
              id="program_code"
              required
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter program"
            />
          </div>

          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="program_major" class="font-bold">Program Major:</label>
            <input
              v-model="form.program_major"
              type="text"
              id="program_major"
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter program major"
            />
          </div>

          <!-- Divider -->
          <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

          <!-- Buttons -->
          <div class="tracking-wide flex justify-end gap-2 mt-4">
            <button
              class="bg-red-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              class="bg-green-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md"
              type="submit"
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
  name: "AddProgramsPage",
  components: {
    icon,
  },
  data() {
    return {
      form: {
        program_name: "",
        program_code: "",
        program_major: "",
      },
    };
  },
  methods: {
    async submitData() {
      const form = this.$refs.programsForm;
      if (!form.checkValidity()) {
        form.reportValidity(); // triggers browser validation messages
        return;
      }

      // Set program_major to 'N/A' if empty
      if (!this.form.program_major || this.form.program_major.trim() === "") {
        this.form.program_major = "-";
      }

      try {
        const response = await axios.post(
          process.env.VUE_APP_API_BASE_URL + "/programs/add-programs",
          this.form,
        );
        console.log(response.data);
        console.log("Submitting form:", this.form);
        toast.success("Programs added successfully!");

        // Play sound after successful add
        const audio = new Audio(require("@/assets/add.mp3"));
        audio.play();

        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        toast.error("Failed to add program.");
      }
    },
  },
};
</script>
