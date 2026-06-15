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
            <h1 class="font-bold tracking-wide text-lg">Add Projects</h1>
          </div>
          <icon :name="'circle-close3'" @click="$emit('close')" class="cursor-pointer" />
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
                v-for="curriculum in curriculums"
                :key="curriculum.curriculum_id"
                :value="curriculum.curriculum_id"
              >
                {{ curriculum.curriculum_name }} - ({{ curriculum.curriculum_since }} -
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

          <!-- Project Section -->
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
                {{ course.course_offer_code }} - {{ course.course_code }}
              </option>
            </select>
          </div>

          <!-- Section Set with Assigned Badge -->
          <div class="w-full space-y-2 text-left flex flex-col">
            <label for="section_id" class="font-bold">Section Set:</label>
            <div class="relative" ref="sectionDropdown">
              <!-- Dropdown button -->
              <div
                class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800 flex justify-between items-center cursor-pointer"
                @click="showSectionDropdown = !showSectionDropdown"
              >
                <span>
                  {{
                    form.section_id
                      ? sections.find((s) => s.section_id === form.section_id)
                          ?.section_set
                      : "Select Set"
                  }}
                </span>
                <svg
                  class="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <!-- Dropdown list -->
              <div
                v-if="showSectionDropdown"
                class="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto z-50"
              >
                <div
                  v-for="section in sections"
                  :key="section.section_id"
                  @click="
                    !isAssigned(form.course_id, section.section_id)
                      ? ((form.section_id = section.section_id),
                        (showSectionDropdown = false))
                      : null
                  "
                  class="px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  :class="{
                    'opacity-50 cursor-not-allowed': isAssigned(
                      form.course_id,
                      section.section_id
                    ),
                  }"
                >
                  <span>{{ section.section_set }}</span>
                  <span
                    v-if="isAssigned(form.course_id, section.section_id)"
                    class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold"
                  >
                    Assigned
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

          <!-- Buttons -->
          <div class="tracking-wide flex justify-end gap-2 mt-4">
            <button
              class="bg-red-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md cursor-pointer"
              type="button"
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
  name: "AddProjectPage",
  components: { icon },
  data() {
    return {
      form: {
        curriculum_id: "",
        course_id: "",
        section_id: "",
        project_level: "",
        project_section: "",
      },
      showSectionDropdown: false,
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["curriculums", "courses", "sections", "projects"]),
    filteredCourses() {
      if (!this.form.curriculum_id || !this.form.project_level) return [];
      return this.courses.filter(
        (course) =>
          course.curriculum_id === this.form.curriculum_id &&
          String(course.course_level) === String(this.form.project_level)
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
      "fetchProjects",
    ]),
    updateProjectSection() {
      const course = this.courses.find((c) => c.course_id === this.form.course_id);
      const section = this.sections.find((s) => s.section_id === this.form.section_id);

      this.form.project_section =
        course && section ? `${course.course_offer_code} - ${section.section_set}` : "";
    },
    isAssigned(courseId, sectionId) {
      if (!courseId || !sectionId) return false;

      const selectedCourse = this.courses.find((c) => c.course_id === courseId);

      if (!selectedCourse) return false;

      return this.projects.some((p) => {
        const projectCourse = this.courses.find((c) => c.course_id === p.course_id);

        return (
          projectCourse?.course_offer_code === selectedCourse.course_offer_code &&
          p.section_id === sectionId
        );
      });
    },
    async submitData() {
      if (this.isAssigned(this.form.course_id, this.form.section_id)) {
        toast.error("This project is already assigned!");
        return;
      }
      try {
        await axios.post(
          process.env.VUE_APP_API_BASE_URL + "/projected/add-projected",
          this.form
        );
        toast.success("Project added successfully!");
        new Audio(require("@/assets/add.mp3")).play();
        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        console.error(error);
        toast.error("Failed to add project.");
      } finally {
        this.fetchProjects();
      }
    },
    handleClickOutside(e) {
      if (
        this.showSectionDropdown &&
        this.$refs.sectionDropdown &&
        !this.$refs.sectionDropdown.contains(e.target)
      ) {
        this.showSectionDropdown = false;
      }
    },
  },
  mounted() {
    this.fetchCurriculums();
    this.fetchCourses();
    this.fetchSections();
    this.fetchProjects();
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>
