<template>
  <div class="min-h-screen bg-gray-50">
    <!-- FILTER & SEARCH -->
    <div class="text-[14px] bg-white rounded-lg">
      <div class="mt-4 overflow-x-auto border p-2 rounded-lg">
        <!-- Top controls -->
        <div class="text-gray-700 flex justify-between items-start mt-1">
          <div class="flex flex-wrap gap-3 items-center">
            <!-- Filter Type Dropdown -->
            <select
              v-model="selectedFilter"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              <option value="">Select Filter</option>
              <option value="instructor">Instructor</option>
              <option value="program">Program</option>
              <option value="course">Course</option>
              <option value="section">Section</option>
              <option value="semester">Semester</option>
              <option value="course_level">Year Level</option>
            </select>

            <!-- Program Dropdown -->
            <select
              v-if="selectedFilter === 'program'"
              v-model="selectedProgram"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              <option value="">All Programs</option>
              <option
                v-for="program in availablePrograms"
                :key="program"
                :value="program"
              >
                {{ program }}
              </option>
            </select>

            <!-- Instructor Search Input -->
            <input
              v-if="selectedFilter === 'instructor'"
              v-model="selectedInstructor"
              type="text"
              placeholder="Search instructor name"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm w-auto"
            />

            <!-- Course Dropdown -->
            <select
              v-if="selectedFilter === 'course'"
              v-model="selectedCourse"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              <option value="">All Courses</option>
              <option
                v-for="course in availableCourses"
                :key="course"
                :value="course"
              >
                {{ course }}
              </option>
            </select>

            <!-- Section Dropdown -->
            <select
              v-if="selectedFilter === 'section'"
              v-model="selectedSection"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              <option value="">All Sections</option>
              <option
                v-for="section in availableSections"
                :key="section"
                :value="section"
              >
                {{ section }}
              </option>
            </select>

            <!-- Semester Dropdown -->
            <select
              v-if="selectedFilter === 'semester'"
              v-model="selectedSemester"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              <option value="">All Semesters</option>
              <option v-for="sem in availableSemesters" :key="sem" :value="sem">
                {{ sem === 1 ? "First" : sem === 2 ? "Second" : sem }} Semester
              </option>
            </select>

            <!-- Course Level Dropdown -->
            <select
              v-if="selectedFilter === 'course_level'"
              v-model="selectedCourseLevel"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              <option value="">All Course Levels</option>
              <option
                v-for="level in availableCourseLevel"
                :key="level"
                :value="level"
              >
                {{
                  level === 1
                    ? "First"
                    : level === 2
                    ? "Second"
                    : level === 3
                    ? "Third"
                    : level === 4
                    ? "Fourth"
                    : level
                }}
                Year
              </option>
            </select>
          </div>

          <!-- Per Page Selection -->
          <div class="flex items-center">
            <select
              v-model="itemsPerPage"
              class="px-1 py-1 border rounded-md"
              @change="changePage(1)"
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
            <span class="ml-2">Per page</span>
          </div>
        </div>

        <!-- DATA TABLE -->
        <div class="w-full rounded-lg shadow-md overflow-hidden">
          <div
            class="overflow-y-auto transition-all duration-300"
            :class="tableHeightClass"
          >
            <!-- Table -->
            <div class="w-full mt-3 rounded-xl shadow-md overflow-hidden">
              <div
                class="overflow-y-auto max-h-[63vh] transition-all duration-300"
              >
                <table
                  class="min-w-full table-auto border-separate border-spacing-y-2 text-sm text-gray-700"
                >
                  <thead
                    class="bg-blue-800 text-white sticky top-0 z-10 tracking-wide"
                  >
                    <tr>
                      <th class="px-4 py-3 text-left font-normal">#</th>
                      <th class="px-4 py-3 text-left font-normal">
                        Instructors
                      </th>
                      <th class="px-4 py-3 text-left font-normal">Program</th>
                      <th class="px-4 py-3 text-left font-normal">Course</th>
                      <th class="px-4 py-3 text-left font-normal">Time</th>
                      <th class="px-4 py-3 text-left font-normal">Day</th>
                      <th class="px-4 py-3 text-left rounded-tr-lg font-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in paginatedData"
                      :key="item.id"
                      class="bg-white hover:bg-blue-50 transition-all border border-gray-200 rounded-md shadow-sm"
                    >
                      <td class="px-4 py-3 text-left">
                        {{ startIndex + index }}
                      </td>
                      <td class="px-4 py-3 text-left">
                        {{ item.instructor?.instructor_fname }}
                        {{ item.instructor?.instructor_lname }}
                      </td>
                      <td class="px-4 py-3 text-left">
                        {{ item.course?.curriculum?.program?.program_name }}
                      </td>
                      <td class="px-4 py-3 text-left">
                        {{ item.course?.course_code }}
                      </td>
                      <td class="px-4 py-3 text-left">
                        {{ formatTime(item.time_start) }} -
                        {{ formatTime(item.time_end) }}
                      </td>
                      <td class="px-4 py-3 text-left">
                        {{ item.schedule_days }}
                      </td>
                      <td class="px-4 py-3 text-left">
                        <div class="flex gap-2">
                          <button
                            class="px-3 py-1 h-8 border border-blue-300 hover:bg-blue-200 text-blue-800 rounded-lg flex items-center gap-1"
                            @click="toggleEdit(item)"
                          >
                            <icon name="edit" /> Edit
                          </button>
                          <button
                            class="px-3 py-1 h-8 border border-red-300 hover:bg-red-200 text-red-800 rounded-lg flex items-center gap-1"
                            @click="toggleDelete(item)"
                          >
                            <icon name="delete" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="paginatedData.length === 0">
                      <td colspan="7" class="p-4 text-center text-gray-500">
                        No schedules found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- PAGINATION -->
        <div class="flex justify-between items-center mt-4">
          <p class="text-sm">
            Showing {{ startIndex }} to {{ endIndex }} of
            {{ filteredData.length }} entries
          </p>
          <div class="flex items-center gap-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              v-for="page in pageNumbers"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-3 py-1 border rounded',
                { 'bg-blue-500 text-white': currentPage === page },
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <edit-class-schedule
      v-if="showEditModal"
      :schedule="selectedClassSchedule"
      @close="closeModal"
    />
  </div>
  <!-- Delete Confirmation Modal -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50 w-min-screen"
  ></div>
  <div
    v-if="showDeleteModal"
    class="rounded-xl shadow-lg w-[300px] md:w-[400px] bg-white py-6 px-4 flex flex-col items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
  >
    <div
      class="rounded-full w-16 h-16 md:w-20 md:h-20 flex justify-center items-center bg-red-300 animate-pulse"
    >
      <icon
        name="question"
        class="w-8 h-8 md:w-10 md:h-10 text-white flex justify-center items-center"
      />
    </div>

    <h1 class="text-[14px] md:text-[16px] font-semibold mt-4">
      Delete Confirmation
    </h1>
    <p class="mt-2 text-[12px] md:text-[13px] text-center px-8">
      Are you sure you want to delete this record? This action cannot be undone.
    </p>

    <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

    <div class="tracking-wide flex gap-2 mt-4">
      <button
        class="bg-red-400 p-2 px-3 text-[11px] md:text-[13px] rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
        @click="showDeleteModal = false"
      >
        No, Cancel
      </button>
      <button
        class="bg-green-400 p-2 px-3 text-[11px] md:text-[13px] rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md"
        @click="confirmDelete"
      >
        Yes, Delete
      </button>
    </div>
  </div>
</template>

<script>
import { useFetchDataStore } from "../../../../store/fetch-data-store";
import { mapState } from "pinia";
import editClassSchedule from "../modals/edit-class-schedule.vue";
import icon from "@/assets/icon.vue";
import { toast } from "vue3-toastify";
export default {
  name: "TableViews",
  components: {
    editClassSchedule,
    icon,
  },
  data() {
    return {
      selectedFilter: "",
      selectedProgram: "",
      availablePrograms: [],
      selectedInstructor: "",
      availableInstructors: [],
      selectedCourse: "", // ✅ NEW
      availableCourses: [], // ✅ NEW
      selectedSection: "", // ✅ NEW
      availableSections: [], // ✅ NEW
      selectedSemester: "", // ✅ NEW
      availableSemesters: [],
      selectedCourseLevel: "",
      availableCourseLevel: [],
      searchQuery: "",
      itemsPerPage: 10,
      currentPage: 1,
      showEditModal: false,
      selectedClassSchedule: null,
      showDeleteModal: false,
      scheduleToDelete: null,
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["schedulers"]),

    filteredData() {
      const query = this.searchQuery.toLowerCase();

      return this.schedulers.filter((item) => {
        const instructorName = `${item.instructor?.instructor_fname || ""} ${
          item.instructor?.instructor_lname || ""
        }`.toLowerCase();
        const programName =
          item.course?.curriculum?.program?.program_name || "";
        const courseCode = item.course?.course_code || "";
        const sectionName = item.project?.project_section || "";
        const semesterNum = item.course?.course_semester || ""; // ✅ NEW
        const courseLevelNum = item.course?.course_level || "";

        const matchesSearch = instructorName.includes(query);

        if (this.selectedFilter === "program" && this.selectedProgram) {
          return matchesSearch && programName === this.selectedProgram;
        }

        if (this.selectedFilter === "instructor" && this.selectedInstructor) {
          return (
            matchesSearch &&
            instructorName.includes(this.selectedInstructor.toLowerCase())
          );
        }

        if (this.selectedFilter === "course" && this.selectedCourse) {
          return matchesSearch && courseCode === this.selectedCourse;
        }
        if (this.selectedFilter === "section" && this.selectedSection) {
          return matchesSearch && sectionName === this.selectedSection;
        }
        if (this.selectedFilter === "semester" && this.selectedSemester) {
          return matchesSearch && semesterNum === this.selectedSemester;
        }
        if (
          this.selectedFilter === "course_level" &&
          this.selectedCourseLevel
        ) {
          return matchesSearch && courseLevelNum === this.selectedCourseLevel;
        }

        return matchesSearch;
      });
    },

    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage) || 1;
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredData.slice(start, start + this.itemsPerPage);
    },
    startIndex() {
      return this.filteredData.length === 0
        ? 0
        : (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    endIndex() {
      return Math.min(
        this.currentPage * this.itemsPerPage,
        this.filteredData.length
      );
    },
    pageNumbers() {
      const total = this.totalPages;
      const current = this.currentPage;
      const delta = 1; // number of pages before/after current
      const range = [];

      for (
        let i = Math.max(1, current - delta);
        i <= Math.min(total, current + delta);
        i++
      ) {
        range.push(i);
      }

      return range;
    },
  },
  methods: {
    async loadSchedulers() {
      const store = useFetchDataStore();
      await store.fetchSchedulers();

      const programSet = new Set();
      const instructorSet = new Set();
      const courseSet = new Set();
      const sectionSet = new Set(); // ✅ NEW
      const semesterSet = new Set(); // ✅ NEW
      const courseLevelSet = new Set(); // ✅ NEW

      this.schedulers.forEach((s) => {
        const program = s.course?.curriculum?.program?.program_name;
        const instructor = `${s.instructor?.instructor_fname || ""} ${
          s.instructor?.instructor_lname || ""
        }`.trim();
        const course = s.course?.course_code;
        const section = s.project?.project_section;
        const semester = s.course?.course_semester; // ✅ NEW
        const courseLevel = s.course?.course_level; // ✅ NEW

        if (program) programSet.add(program);
        if (instructor) instructorSet.add(instructor);
        if (course) courseSet.add(course);
        if (section) sectionSet.add(section);
        if (semester) semesterSet.add(semester); // ✅ NEW
        if (courseLevel) courseLevelSet.add(courseLevel);
      });

      this.availablePrograms = Array.from(programSet);
      this.availableInstructors = Array.from(instructorSet);
      this.availableCourses = Array.from(courseSet);
      this.availableSections = Array.from(sectionSet);
      this.availableSemesters = Array.from(semesterSet).sort(); // ✅ NEW
      this.availableCourseLevel = Array.from(courseLevelSet).sort();
    },

    formatTime(time) {
      if (!time) return "";
      const [hour, minute] = time.split(":");
      const h = parseInt(hour, 10);
      const ampm = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      return `${hour12}:${minute} ${ampm}`;
    },

    changePage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    },

    // tableHeightClass() {
    //   const count = this.paginatedData.length;
    //   return count <= 20 ? "h-auto" : "h-[25vh]";
    // },

    toggleEdit(item) {
      this.selectedClassSchedule = item;
      this.showEditModal = true;
    },

    toggleDelete(schedule) {
      this.scheduleToDelete = schedule;
      this.showDeleteModal = true;
    },

    async confirmDelete() {
      const id = this.scheduleToDelete?.schedule_id;
      if (!id) return;

      try {
        const response = await fetch(
          `http://localhost:8000/class-schedules/delete-id/${id}`,
          {
            method: "DELETE",
          }
        );
        toast.success("Record successfully deleted!");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await this.loadSchedulers();

        this.showDeleteModal = false;
        this.scheduleToDelete = null;
      } catch (error) {
        console.error("Failed to delete schedule:", error);
        alert("An error occurred while deleting the schedule.");
      }
    },

    closeModal() {
      this.showEditModal = false;
      this.selectedClassSchedule = null;
    },
  },
  watch: {
    selectedFilter() {
      this.selectedProgram = "";
      this.selectedInstructor = "";
      this.selectedCourse = "";
      this.selectedSection = "";
      this.selectedSemester = ""; // ✅ NEW
      this.selectedCourseLevel = ""; // ✅ NEW
      this.currentPage = 1;
    },
    searchQuery() {
      this.currentPage = 1;
    },
  },

  mounted() {
    this.loadSchedulers();
  },
};
</script>
