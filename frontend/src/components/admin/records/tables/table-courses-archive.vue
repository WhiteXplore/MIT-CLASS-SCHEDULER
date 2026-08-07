<template>
  <div v-if="isTable" class=" ">
    <div class="text-sm flex justify-between">
      <div class="text-[13px] text-text mt-4 font-regular">Pages / Courses</div>
    </div>

    <div class="text-[14px] bg-white rounded-xl">
      <div class="mt-4 overflow-x-auto border p-2 rounded-xl">
        <!-- Top controls -->
        <div class="text-gray-700 flex justify-between items-start mt-1">
          <!-- Items Per Page -->
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

          <!-- Search -->
          <div class="flex items-center">
            <input
              v-model="searchQuery"
              type="text"
              class="px-3 w-[300px] py-3 border rounded-md"
              placeholder="Search..."
              @input="changePage(1)"
            />
          </div>
        </div>

        <!-- Table -->
        <div class="w-full rounded-xl shadow-md overflow-hidden">
          <div
            class="overflow-y-auto transition-all duration-300"
            :class="tableHeightClass"
          >
            <!-- Table -->
            <div class="w-full rounded-xl shadow-md overflow-hidden">
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
                      <th
                        class="w-10 px-4 py-3 text-left rounded-tl-lg font-normal"
                      >
                        ID
                      </th>
                      <th class="px-4 py-3 text-left font-normal">
                        Curriculum
                      </th>
                      <th class="px-4 py-3 text-left font-normal">
                        Offer Code
                      </th>
                      <th class="px-4 py-3 text-left font-normal">
                        Course Code
                      </th>
                      <th class="px-4 py-3 text-left font-normal">
                        Course Description
                      </th>
                      <th class="px-4 py-3 text-center font-normal">
                        Semester
                      </th>
                      <th class="px-4 py-3 text-center font-normal">
                        Year Level
                      </th>
                      <th class="px-4 py-3 text-center font-normal">
                        Lecture<br /><span class="text-xs">(Unit)</span>
                      </th>
                      <th class="px-4 py-3 text-center font-normal">
                        Laboratory<br /><span class="text-xs">(Unit)</span>
                      </th>
                      <th class="px-4 py-3 text-center font-normal">
                        Credit<br /><span class="text-xs">(Unit)</span>
                      </th>
                      <th class="px-4 py-3 text-left font-normal">
                        Requisition
                      </th>
                      <th class="px-4 py-3 text-left rounded-tr-lg font-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(courses_data, index) in paginatedData"
                      :key="courses_data.course_id"
                      class="bg-white hover:bg-blue-50 transition-all border border-gray-200 rounded-md shadow-sm"
                    >
                      <td class="px-4 py-2 text-left">
                        {{ startIndex + index }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        {{ courses_data.curriculum?.curriculum_name }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        {{ courses_data.course_offer_code }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        {{ courses_data.course_code }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        {{ courses_data.course_description }}
                      </td>
                      <td class="px-4 py-2 text-center">
                        {{ courses_data.course_semester }}
                      </td>
                      <td class="px-4 py-2 text-center">
                        {{ courses_data.course_level }}
                      </td>
                      <td class="px-4 py-2 text-center">
                        {{ courses_data.course_lec }}
                      </td>
                      <td class="px-4 py-2 text-center">
                        {{ courses_data.course_lab }}
                      </td>
                      <td class="px-4 py-2 text-center">
                        {{
                          /internship/i.test(courses_data.course_description)
                            ? 6
                            : Number(courses_data.course_lec) +
                              Number(courses_data.course_lab)
                        }}
                      </td>

                      <td class="px-4 py-2 text-left">
                        {{ courses_data.course_requisite }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        <div class="flex gap-2">
                          <button
                            class="px-3 py-1 h-8 border border-blue-300 hover:bg-blue-200 text-blue-800 rounded-lg flex items-center gap-1"
                            @click="toggleEdit(courses_data)"
                          >
                            <icon name="edit" /> Edit
                          </button>
                          <button
                            class="px-3 py-1 h-8 border border-green-300 hover:bg-green-200 text-green-800 rounded-lg flex items-center gap-1"
                            @click="toggleRestore(courses_data)"
                          >
                            <icon name="undo" />
                            Return
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="paginatedData.length === 0">
                      <td colspan="12" class="text-center py-8 text-gray-400">
                        No records found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center mt-4">
          <div class="text-gray-700">
            <span>
              Showing {{ startIndex }} to {{ endIndex }} of
              {{ filteredData.length }} entries
            </span>
          </div>
          <div class="flex items-center">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400"
            >
              &lt;
            </button>
            <span v-for="page in pageNumbers" :key="'page-' + page">
              <button
                @click="changePage(page)"
                :class="{
                  'bg-green-900 text-white': currentPage === page,
                  'bg-gray-200 text-gray-700': currentPage !== page,
                }"
                class="px-3 py-1 mx-1 rounded-md hover:bg-green-300"
              >
                {{ page }}
              </button>
            </span>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <addCourses v-if="isAddCourses" @close="closeView" @refresh="loadCourses" />
  <editCourse
    v-if="showEditModal && selectedCourse"
    :courseData="selectedCourse"
    @close="closeModal"
    @refresh="loadCourses"
  />
  <!-- Archive Confirmation Modal -->
  <div
    v-if="showArchiveModal"
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50 w-min-screen"
  ></div>

  <div
    v-if="showArchiveModal"
    class="rounded-xl shadow-lg w-[300px] md:w-[400px] bg-white py-6 px-4 flex flex-col items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
  >
    <div
      class="rounded-full w-16 h-16 md:w-20 md:h-20 flex justify-center items-center bg-amber-100 animate-pulse"
    >
      <icon
        name="question"
        class="w-8 h-8 md:w-10 md:h-10 text-amber-600 flex justify-center items-center"
      />
    </div>

    <h1 class="text-[14px] md:text-[16px] font-semibold mt-4 text-gray-800">
      Restore Course
    </h1>

    <p
      class="mt-2 text-[12px] md:text-[13px] text-center px-8 text-gray-500 leading-6"
    >
      Are you sure you want to restore? This course will be return to the active
      list.
    </p>

    <div class="w-full h-[1px] rounded-md bg-gray-200 mt-5"></div>

    <div class="tracking-wide flex gap-2 mt-5">
      <button
        class="bg-gray-100 border border-gray-300 text-gray-700 p-2 px-4 text-[11px] md:text-[13px] rounded-md hover:bg-gray-200 transition"
        @click="
          showArchiveModal = false;
          recordToArchived = null;
        "
      >
        Cancel
      </button>

      <button
        class="bg-green-600 p-2 px-4 text-[11px] md:text-[13px] rounded-md text-white hover:bg-green-700 transition"
        @click="confirmRestore"
      >
        Yes, Return
      </button>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import { toast } from "vue3-toastify";
import addCourses from "../modals/add-courses.vue";
import editCourse from "../modals/edit-course.vue";
import { useFetchDataStore } from "../../../../store/fetch-data-store.js";
import { mapState } from "pinia";
import axios from "axios";
export default {
  name: "TableCourses",
  components: {
    icon,
    addCourses,
    editCourse,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
      isAddCourses: false,
      isEdit: false,
      isTable: true,
      isUploadData: false,
      showArchiveModal: false,
      recordToArchived: null,
      selectedServiceRecord: null,
      selectedCourse: null,
      showEditModal: false,
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["courses"]),

    filteredData() {
      const query = this.searchQuery.toLowerCase();

      return this.courses.filter((item) => {
        return (
          item.is_archive &&
          [
            item.course_code,
            item.course_description,
            item.course_offer_code,
            item.curriculum?.curriculum_name,
            item.course_requisite,
          ]
            .filter(Boolean) // skip null/undefined
            .some((field) => field.toString().toLowerCase().includes(query))
        );
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
      const end = this.currentPage * this.itemsPerPage;
      return end > this.filteredData.length ? this.filteredData.length : end;
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
    toggleRestore(item) {
      this.recordToArchived = item; // reuse existing variable
      this.showArchiveModal = true; // reuse existing modal
    },
    async confirmRestore() {
      if (!this.recordToArchived) return;

      try {
        await axios.patch(
          `${process.env.VUE_APP_API_BASE_URL}/courses/update-course/${this.recordToArchived.course_id}`,
          {
            is_archive: false,
          },
        );

        const store = useFetchDataStore();
        await store.fetchCourses();

        this.showArchiveModal = false;
        this.recordToArchived = null;

        toast.success("Courses restored successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to restored Courses");
      }
    },
    async loadCourses() {
      const store = useFetchDataStore();
      await store.fetchCourses();
    },
    toggleUploadData() {
      this.isUploadData = true;
      this.isTable = true;
    },
    toggleAdd() {
      this.isAddCourses = true;
      this.isTable = true;
    },
    toggleEdit(item) {
      this.selectedCourse = item;
      this.showEditModal = true;
    },

    changePage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    },
    // tableHeightClass() {
    //   const count = this.paginatedData.length;
    //   return count <= 20 ? "h-auto" : "h-[25vh]";
    // },
    closeView() {
      this.isAddCourses = false;
      this.isUploadData = false;
    },
    closeModal() {
      this.showEditModal = false;
      this.selectedCourse = null;
    },
    handleBackToTable() {
      this.isEdit = false;
      this.isAddCourses = false;
      this.isUploadData = false;
      this.selectedServiceRecord = null;
      this.isTable = true;
    },
  },
  mounted() {
    this.loadCourses();
  },
};
</script>
