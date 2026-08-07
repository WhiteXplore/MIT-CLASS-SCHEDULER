<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="submitData"
        class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg"
        ref="projectsForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'add-students'" />
            <h1 class="font-bold tracking-wide text-lg">Edit Projects</h1>
          </div>
          <icon
            :name="'circle-close3'"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>
        <div class="p-5 w-[30vw] space-y-3">
          <!-- Curriculum -->
          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="curriculum_id" class="font-bold">Curriculum:</label>
            <select
              v-model="form.curriculum_id"
              required
              class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
            >
              <option disabled value="">Select Curriculum</option>
              <option
                v-for="curriculum in filteredCurriculums"
                :key="curriculum.curriculum_id"
                :value="curriculum.curriculum_id"
              >
                {{ curriculum.curriculum_name }} - (
                {{ curriculum.curriculum_since }} -
                {{ curriculum.curriculum_effective }})
              </option>
            </select>
          </div>

          <!-- Project Level -->
          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="project_level" class="font-bold">Project Level:</label>
            <select
              v-model="form.project_level"
              required
              class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
            >
              <option disabled value="">Select Project Level</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
            </select>
          </div>

          <!-- Course -->
          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="course_id" class="font-bold">Project Section:</label>
            <select
              v-model="form.course_id"
              required
              class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
            >
              <option disabled value="">Select Offer Code</option>
              <option
                v-for="course in filteredCourses"
                :key="course.course_id"
                :value="course.course_id"
              >
                {{ course.course_offer_code }}
              </option>
            </select>
          </div>

          <!-- Section -->
          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="section_id" class="font-bold">Section Set:</label>
            <select
              v-model="form.section_id"
              required
              class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
            >
              <option disabled value="">Select Set</option>
              <option
                v-for="section in sections"
                :key="section.section_id"
                :value="section.section_id"
              >
                {{ section.section_set }}
              </option>
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
              Save Changes
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
  name: "EditProjectPage",
  components: { icon },
  props: {
    projectData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        curriculum_id: "",
        course_id: "",
        section_id: "",
        project_level: "",
        project_section: "",
      },
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["curriculums", "courses", "sections"]),
    filteredCurriculums() {
      return this.curriculums.filter((curriculum) => !curriculum.is_archive);
    },
    filteredCourses() {
      if (!this.form.curriculum_id || !this.form.project_level) return [];
      return this.courses.filter(
        (course) =>
          course.curriculum_id === this.form.curriculum_id &&
          String(course.course_level) === String(this.form.project_level),
      );
    },
  },
  watch: {
    "form.course_id": "updateProjectSection",
    "form.section_id": "updateProjectSection",
  },
  methods: {
    ...mapActions(useFetchDataStore, [
      "fetchCurriculums",
      "fetchCourses",
      "fetchSections",
    ]),

    updateProjectSection() {
      const course = this.courses.find(
        (c) => c.course_id === this.form.course_id,
      );
      const section = this.sections.find(
        (s) => s.section_id === this.form.section_id,
      );
      if (course && section) {
        this.form.project_section = `${course.course_offer_code} - ${section.section_set}`;
      } else {
        this.form.project_section = "";
      }
    },

    async submitData() {
      const form = this.$refs.projectsForm;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      try {
        await axios.patch(
          `${process.env.VUE_APP_API_BASE_URL}/projected/update-project/${this.projectData.project_id}`,
          this.form,
        );
        toast.success("Project updated successfully!");

        const audio = new Audio(require("@/assets/add.mp3"));
        audio.play();

        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        console.error("Error updating project:", error.response?.data || error);
        toast.error("Failed to update project.");
      }
    },

    populateForm() {
      this.form = { ...this.projectData };
    },
  },
  mounted() {
    this.fetchCurriculums();
    this.fetchCourses();
    this.fetchSections();
    this.populateForm();
  },
};
</script>
