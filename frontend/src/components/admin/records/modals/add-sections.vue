<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="submitData"
        class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg"
        ref="sectionForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'add-students'" />
            <h1 class="font-bold tracking-wide text-lg">Add Sections</h1>
          </div>
          <icon
            :name="'circle-close3'"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>
        <div class="p-5 w-[20vw] space-y-3">
          <!-- <div class="w-full space-y-2 text-left flex flex-col">
            <label for="project_id" class="font-bold">Projected:</label>
            <select
              v-model="form.project_id"
              id="project_id"
              required
              class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
            >
              <option value="" disabled>Select project</option>
              <option
                v-for="project in projects"
                :key="project.project_id"
                :value="project.project_id"
              >
                {{ project.project_level }}
              </option>
            </select>
          </div> -->
          <!-- <div class="w-full space-y-2 text-left flex flex-col">
            <label for="section_session" class="font-bold">Session:</label>
            <select
              v-model="form.section_session"
              id="section_session"
              required
              class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
            >
              <option value="" disabled>Select session</option>
              <option value="Morning">Morning</option>
              <option value="Afternon">Afternon</option>
              <option value="Evening">Evening</option>
            </select>
          </div> -->

          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="section_set" class="font-bold">Set:</label>
            <input
              v-model="form.section_set"
              type="text"
              id="section_set"
              required
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter set"
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
import { useFetchDataStore } from "@/store/fetch-data-store"; // Adjust path if needed
import { mapState, mapActions } from "pinia";
export default {
  name: "AddSectionsPage",
  components: {
    icon,
  },
  data() {
    return {
      form: {
        // project_id: "",
        // section_session: "",
        section_set: "",
      },
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["projects"]),
  },
  methods: {
    ...mapActions(useFetchDataStore, ["fetchProjects"]),
    async submitData() {
      const form = this.$refs.sectionForm;
      if (!form.checkValidity()) {
        form.reportValidity(); // triggers browser validation messages
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8000/sections/add-sections",
          this.form
        );
        console.log(response.data);
        console.log("Submitting form:", this.form);
        toast.success("Section added successfully!");
        // Play sound after successful delete
        const audio = new Audio(require("@/assets/add.mp3"));
        audio.play();

        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        toast.error("Failed to add section.");
      }
    },
  },
  mounted() {
    this.fetchProjects();
  },
};
</script>
