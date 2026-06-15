<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="submitData"
        class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg"
        ref="curriculumnForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'add-students'" />
            <h1 class="font-bold tracking-wide text-lg">Add Curriculum</h1>
          </div>
          <icon
            :name="'circle-close3'"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>

        <!-- Form Body -->
        <div class="p-5 w-[35vw] space-y-3">
          <!-- Program Search Input -->
          <div class="w-full space-y-2 text-left relative">
            <label for="program_id" class="font-bold">Program:</label>
            <input
              v-model="searchProgramQuery"
              type="text"
              placeholder="Search program..."
              class="px-3 py-3 border w-full border-gray-600 rounded-md text-md text-gray-800"
              @focus="showProgramDropdown = true"
            />
            <div
              v-if="showProgramDropdown"
              class="absolute left-0 top-full w-full bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto z-10"
            >
              <div v-if="filteredPograms.length > 0">
                <div
                  v-for="program in filteredPograms"
                  :key="program.program_id"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  @mousedown="selectProgram(program)"
                >
                  {{ program.program_name }} <br />
                  <span class="italic">
                    Major in {{ program.program_major }}</span
                  >
                </div>
              </div>
              <div v-else class="px-3 py-2 text-gray-500 italic">
                No results found
              </div>
            </div>
          </div>

          <!-- Curriculum Name -->
          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="curriculum_name" class="font-bold"
              >Curriculum Name:</label
            >
            <input
              v-model="form.curriculum_name"
              type="text"
              id="curriculum_name"
              required
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter curriculum"
            />
          </div>

          <!-- Years -->
          <div class="flex gap-3">
            <div class="w-full space-y-2 text-left flex flex-col">
              <label for="curriculum_since" class="font-bold"
                >Year Introduced:</label
              >
              <input
                v-model="form.curriculum_since"
                type="text"
                id="curriculum_since"
                required
                class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                placeholder="Enter year introduced"
              />
            </div>
            <div class="w-full space-y-2 text-left flex flex-col">
              <label for="curriculum_effective" class="font-bold"
                >Effective Year:</label
              >
              <input
                v-model="form.curriculum_effective"
                type="text"
                id="curriculum_effective"
                required
                class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                placeholder="Enter effective year"
              />
            </div>
          </div>

          <!-- Consortium & CMO -->
          <div class="flex gap-3">
            <div class="w-full space-y-2 text-left flex flex-col">
              <label for="curriculum_consortium" class="font-bold"
                >Consortium:</label
              >
              <input
                v-model="form.curriculum_consortium"
                type="text"
                id="curriculum_consortium"
                required
                class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                placeholder="Enter consortium"
              />
            </div>
            <div class="w-full space-y-2 text-left flex flex-col">
              <label for="curriculum_cmo" class="font-bold">CMO Series:</label>
              <input
                v-model="form.curriculum_cmo"
                type="text"
                id="curriculum_cmo"
                required
                class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                placeholder="Enter CMO series"
              />
            </div>
          </div>

          <!-- Curriculum Status -->
          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="curriculum_status" class="font-bold">
              Curriculum Status:
            </label>
            <select
              v-model="form.curriculum_status"
              id="curriculum_status"
              required
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
            >
              <option disabled value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Not Active">Not Active</option>
            </select>
          </div>

          <!-- Divider -->
          <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

          <!-- Buttons -->
          <div class="tracking-wide flex justify-end gap-2 mt-4">
            <button
              class="bg-red-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md cursor-pointer"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              class="bg-green-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md cursor-pointer"
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
import { useFetchDataStore } from "@/store/fetch-data-store";
import { mapState, mapActions } from "pinia";
export default {
  name: "AddCurriculumPage",
  components: {
    icon,
  },
  data() {
    return {
      form: {
        program_id: "",
        curriculum_name: "",
        curriculum_effective: "",
        curriculum_since: "",
        curriculum_cmo: "",
        curriculum_consortium: "",
        curriculum_status: "",
      },
      searchProgramQuery: "",
      showProgramDropdown: false,
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["programs"]),

    filteredPograms() {
      if (!this.searchProgramQuery) return this.programs;
      const query = this.searchProgramQuery.toLowerCase();
      return this.programs.filter(
        (program) =>
          program.program_name.toLowerCase().includes(query) ||
          program.program_major.toLowerCase().includes(query),
      );
    },
  },
  methods: {
    ...mapActions(useFetchDataStore, ["fetchPrograms"]),
    selectProgram(program) {
      this.form.program_id = program.program_id;
      this.searchProgramQuery = `${program.program_name}, ${program.program_major}`;
      this.showProgramDropdown = false;
    },
    async submitData() {
      const form = this.$refs.curriculumnForm;
      if (!form.checkValidity()) {
        form.reportValidity(); // triggers browser validation messages
        return;
      }

      try {
        const response = await axios.post(
          process.env.VUE_APP_API_BASE_URL + "/curriculums/add-curriculums",
          this.form,
        );
        console.log(response.data),
          // All fields are valid
          console.log("Submitting form:", this.form);
        toast.success("Curriculum added successfully!");
        // Play sound after successful delete
        const audio = new Audio(require("@/assets/add.mp3"));
        audio.play();

        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        toast.error("Failed to add curriculum");
      }
    },
  },
  mounted() {
    this.fetchPrograms();
  },
};
</script>
