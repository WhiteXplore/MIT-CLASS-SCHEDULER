<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="submitData"
        class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg"
        ref="coursesForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'add-students'" />
            <h1 class="font-bold tracking-wide text-lg">Edit Courses</h1>
          </div>
          <icon
            :name="'circle-close3'"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>

        <div class="p-5 w-[40vw] space-y-5">
          <!-- Curriculum & Offer Code -->
          <div class="w-full text-left gap-3 flex mt-2">
            <div class="w-full space-y-2 text-left">
              <label for="curriculum_id" class="font-bold">Curriculum:</label>
              <select
                v-model="form.curriculum_id"
                id="curriculum_id"
                required
                class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
              >
                <option value="" disabled>Select Curriculum:</option>
                <option
                  v-for="curriculum in filteredCurriculums"
                  :key="curriculum.curriculum_id"
                  :value="curriculum.curriculum_id"
                >
                  {{ curriculum.curriculum_name }} -
                  {{ curriculum.curriculum_since }} -
                  {{ curriculum.curriculum_effective }}
                </option>
              </select>
            </div>

            <div class="w-full space-y-2">
              <label for="course_offer_code" class="font-bold"
                >Offer Code:</label
              >
              <input
                v-model="form.course_offer_code"
                type="text"
                id="course_offer_code"
                required
                class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                placeholder="Enter offer code"
              />
            </div>
          </div>

          <!-- Course Code & Description -->
          <div class="w-full text-left gap-3 flex mt-2">
            <div class="w-full space-y-2">
              <label for="course_code" class="font-bold">Course Code:</label>
              <input
                v-model="form.course_code"
                type="text"
                id="course_code"
                required
                class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                placeholder="Enter course code"
              />
            </div>
            <div class="w-full space-y-2">
              <label for="course_description" class="font-bold"
                >Course Description:</label
              >
              <input
                v-model="form.course_description"
                type="text"
                id="course_description"
                required
                class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                placeholder="Enter course description"
              />
            </div>
          </div>

          <!-- Semester & Level -->
          <div class="w-full text-left gap-3 flex mt-2">
            <div class="w-full space-y-2">
              <label for="course_semester" class="font-bold">Semester:</label>
              <select
                v-model="form.course_semester"
                required
                class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
              >
                <option disabled value="">Select Semester</option>
                <option value="1">First Semester</option>
                <option value="2">Second Semester</option>
                <option value="3">Summer</option>
              </select>
            </div>

            <div class="w-full space-y-2">
              <label for="course_level" class="font-bold">Year Level:</label>
              <select
                v-model="form.course_level"
                required
                class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
              >
                <option disabled value="">Select Level</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
            </div>
          </div>

          <!-- Lec & Lab -->
          <div class="w-full text-left gap-3 flex mt-2">
            <div class="w-full space-y-2">
              <label for="course_lec" class="font-bold">Lecture:</label>
              <input
                v-model="form.course_lec"
                type="text"
                id="course_lec"
                required
                class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                placeholder="Enter course lecture"
              />
            </div>
            <div class="w-full space-y-2">
              <label for="course_lab" class="font-bold">Laboratory:</label>
              <input
                v-model="form.course_lab"
                type="text"
                id="course_lab"
                required
                class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                placeholder="Enter course laboratory"
              />
            </div>
          </div>

          <!-- Course Requisite -->
          <div class="w-full space-y-2">
            <label for="course_requisite" class="font-bold"
              >Course Requisition:</label
            >
            <div class="relative">
              <input
                type="text"
                id="course_requisite"
                v-model="searchCourseQuery"
                @focus="showCourseDropdown = true"
                @keydown.enter.prevent="addCustomRequisite"
                @blur="addCustomRequisite"
                class="w-full border px-3 py-3.5 border-gray-600 rounded-md text-md text-gray-800"
                placeholder="Search and select course requisites"
                :disabled="isRequisiteDisabled"
              />

              <!-- Dropdown -->
              <div
                v-if="showCourseDropdown && filteredCourseOptions.length"
                class="mt-2 absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto"
                @mouseleave="showCourseDropdown = false"
              >
                <div
                  v-for="course in filteredCourseOptions"
                  :key="course.course_id"
                  @mousedown.prevent="addRequisite(course)"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {{ course.course_code || "No Code" }} -
                  {{ course.course_description || "No Description" }}
                </div>
              </div>
            </div>

            <!-- Selected badges -->
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="(req, index) in selectedRequisites"
                :key="req.course_id"
                class="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-2"
              >
                {{ req.course_code }}
                <button
                  type="button"
                  @click="removeRequisite(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            </div>
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
  name: "EditCoursesPage",
  components: { icon },
  props: {
    courseData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        curriculum_id: "",
        course_code: "",
        course_offer_code: "",
        course_description: "",
        course_semester: "",
        course_lab: "",
        course_lec: "",
        course_level: "",
        course_requisite: "",
      },
      selectedRequisites: [], // ✅ keep actual requisite objects
      availableCourses: [],
      searchCourseQuery: "",
      showCourseDropdown: false,
    };
  },

  computed: {
    ...mapState(useFetchDataStore, ["curriculums", "courses"]),
    filteredCurriculums() {
      return this.curriculums.filter((curriculum) => !curriculum.is_archive);
    },
    filteredCourseOptions() {
      const query = this.searchCourseQuery.toLowerCase();

      return this.availableCourses.filter((course) => {
        return (
          !course.is_archive &&
          (!query ||
            course.course_code.toLowerCase().includes(query) ||
            course.course_description.toLowerCase().includes(query))
        );
      });
    },

    // ✅ disables requisites input if description contains internship
    isRequisiteDisabled() {
      return (
        this.form.course_description &&
        this.form.course_description.toLowerCase().includes("internship")
      );
    },
  },

  methods: {
    ...mapActions(useFetchDataStore, ["fetchCurriculums", "fetchCourses"]),

    addRequisite(course) {
      if (
        !this.selectedRequisites.some((c) => c.course_id === course.course_id)
      ) {
        this.selectedRequisites.push(course);
      }
      this.searchCourseQuery = "";
      this.showCourseDropdown = false;
    },

    addCustomRequisite() {
      const trimmed = this.searchCourseQuery.trim();
      if (!trimmed) return;

      if (this.selectedRequisites.some((c) => c.course_code === trimmed))
        return;

      this.selectedRequisites.push({
        course_id: "custom-" + Date.now(),
        course_code: trimmed,
        course_description: "Custom Input",
      });

      this.searchCourseQuery = "";
      this.showCourseDropdown = false;
    },

    removeRequisite(index) {
      this.selectedRequisites.splice(index, 1);
    },

    async submitData() {
      const formEl = this.$refs.coursesForm;
      if (!formEl.checkValidity()) {
        formEl.reportValidity();
        return;
      }

      this.form.course_requisite = this.selectedRequisites.length
        ? this.selectedRequisites.map((c) => c.course_code).join(", ")
        : "None";

      try {
        await axios.patch(
          `${process.env.VUE_APP_API_BASE_URL}/courses/update-course/${this.form.course_id}`,
          this.form,
        );

        toast.success("Course updated successfully!");
        const audio = new Audio(require("@/assets/add.mp3"));
        audio.play();

        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update course.");
      }
    },
    populateForm() {
      this.form = {
        course_id: this.courseData.course_id,
        curriculum_id: Number(
          this.courseData.curriculum_id ||
            this.courseData.curriculum?.curriculum_id,
        ),
        course_code: this.courseData.course_code,
        course_offer_code: this.courseData.course_offer_code,
        course_description: this.courseData.course_description,
        course_semester: this.courseData.course_semester,
        course_lab: this.courseData.course_lab,
        course_lec: this.courseData.course_lec,
        course_level: this.courseData.course_level,
        course_requisite: this.courseData.course_requisite,
      };

      if (this.form.course_requisite && this.form.course_requisite !== "None") {
        this.selectedRequisites = this.form.course_requisite
          .split(",")
          .map((code) => {
            const course = this.courses.find(
              (c) => c.course_code === code.trim(),
            );
            return (
              course || {
                course_id: code.trim(),
                course_code: code.trim(),
                course_description: "",
              }
            );
          });
      }
    },
  },

  watch: {
    // ✅ handle "Internship" auto behavior
    "form.course_description"(newVal) {
      if (newVal && newVal.toLowerCase().includes("internship")) {
        // clear other requisites
        this.selectedRequisites = [];
        // add "All Courses"
        if (
          !this.selectedRequisites.some(
            (req) => req.course_code === "ALL-COURSES",
          )
        ) {
          this.selectedRequisites.push({
            course_id: "all",
            course_code: "ALL-COURSES",
            course_description: "All Courses",
          });
        }
      } else {
        // remove "All Courses" when internship cleared
        this.selectedRequisites = this.selectedRequisites.filter(
          (req) => req.course_code !== "ALL-COURSES",
        );
      }
    },

    "form.curriculum_id"(newId) {
      this.availableCourses = this.courses.filter(
        (course) => course.curriculum_id === parseInt(newId),
      );
    },
  },

  mounted() {
    this.fetchCurriculums();
    this.fetchCourses().then(() => {
      this.populateForm();
    });
  },
};
</script>
