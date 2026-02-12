<template>
  <div v-if="isTable" class="">
    <!-- Header with title and download button -->
    <div class="text-sm flex justify-between">
      <div class="text-[13px] text-text mt-4 font-regular">
        Pages / Faculty Loads
      </div>
      <div
        @click="toggleDownloads"
        class="flex items-center gap-2 px-4 py-2 border text-blue-600 border-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg cursor-pointer transition duration-200"
      >
        <div
          class="p-1 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center"
        >
          <icon :name="'download'" class="w-4 h-4" />
        </div>
        <span class="font-medium text-sm">Downloads</span>
      </div>
    </div>

    <!-- Table controls -->
    <div class="text-[14px] bg-white rounded-xl">
      <div class="mt-4 overflow-x-auto border p-2 rounded-xl">
        <div class="text-gray-700 flex justify-between items-start mt-1">
          <div class="flex items-center">
            <select
              v-model.number="itemsPerPage"
              class="px-1 py-1 border rounded-md"
              @change="changePage(1)"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="20">20</option>
            </select>
            <span class="ml-2">Per page</span>
          </div>
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

        <!-- Main table -->
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
                  class="min-w-full table-fixed border-separate border-spacing-y-2 text-sm text-gray-700"
                >
                  <thead
                    class="bg-blue-800 text-white sticky top-0 z-10 tracking-wide"
                  >
                    <tr>
                      <th class="px-4 py-3 text-left rounded-tl-lg font-normal">
                        ID
                      </th>
                      <th class="px-4 py-3 w-1/2 text-left font-normal">
                        Curriculum Offered
                      </th>
                      <th class="px-4 py-3 w-1/3 text-left font-normal">
                        Curriculum Period
                      </th>
                      <th
                        class="px-4 py-3 w-1/4 text-left rounded-tr-lg font-normal"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in paginatedData"
                      :key="item.project_id"
                      class="bg-white hover:bg-blue-50 transition-all border border-gray-200 rounded-md shadow-sm"
                    >
                      <td class="px-4 py-3 text-left">
                        {{ startIndex + index }}
                      </td>
                      <td class="px-4 py-3 text-left w-1/2">
                        {{ item.program_name }}
                      </td>
                      <td class="px-4 py-3 text-left w-1/3">
                        {{ item.curriculum_since }} -
                        {{ item.curriculum_effective }}
                      </td>
                      <td class="px-4 py-3 text-left w-1/4">
                        <div class="flex gap-2">
                          <router-link
                            v-if="item.curriculum_id"
                            :to="`/view-course-offered/${item.curriculum_id}`"
                            class="px-3 py-1 h-8 border border-blue-300 hover:bg-blue-200 text-blue-800 rounded-lg flex items-center gap-1"
                          >
                            <icon name="edit" /> View
                          </router-link>
                          <span v-else class="text-gray-400 text-xs">
                            No course linked
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="paginatedData.length === 0">
                      <td colspan="4" class="text-center py-8 text-gray-400">
                        No records found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination controls -->
        <div class="flex justify-between items-center mt-4">
          <div class="text-gray-700">
            Showing {{ startIndex }} to {{ endIndex }} of
            {{ filteredData.length }} entries
          </div>
          <div class="flex items-center">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400"
            >
              &lt;
            </button>
            <span v-for="page in pageNumbers" :key="page">
              <button
                @click="changePage(page)"
                :class="
                  page === currentPage
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-200 text-gray-700'
                "
                class="px-3 py-1 mx-1 rounded-md hover:bg-blue-300"
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

  <EditInstructor
    v-if="showEditModal && selectedInstructor"
    :instructorData="selectedInstructor"
    @close="closeModal"
    @refresh="loadcurriculums"
  />

  <!-- Delete confirmation modal (optional if you still need delete) -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div
      class="rounded-xl shadow-lg w-[300px] md:w-[400px] bg-white py-6 px-4 flex flex-col items-center"
    >
      <div
        class="rounded-full w-16 h-16 md:w-20 md:h-20 flex justify-center items-center bg-red-300 animate-pulse"
      >
        <icon name="question" class="w-8 h-8 md:w-10 md:h-10 text-white" />
      </div>
      <h1 class="text-[14px] md:text-[16px] font-semibold mt-4">
        Delete Confirmation
      </h1>
      <p class="mt-2 text-[12px] md:text-[13px] text-center px-8">
        Are you sure you want to delete this record? This action cannot be
        undone.
      </p>
      <div class="w-full h-[1px] bg-gray-200 mt-4"></div>
      <div class="tracking-wide flex gap-2 mt-4">
        <button
          @click="showDeleteModal = false"
          class="bg-red-400 p-2 px-3 text-[11px] md:text-[13px] rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
        >
          No, Cancel
        </button>
        <button
          @click="confirmDelete"
          class="bg-blue-400 p-2 px-3 text-[11px] md:text-[13px] rounded-md text-white hover:bg-white border hover:border-blue-800 hover:text-blue-800 hover:shadow-md"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import EditInstructor from "../modals/edit-instructor.vue";
import { toast } from "vue3-toastify";
import { useFetchDataStore } from "../../../../store/fetch-data-store";
import { mapState } from "pinia";
import axios from "axios";

export default {
  name: "TableCourseOffered",
  components: { EditInstructor, icon },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
      isTable: true,
      showDeleteModal: false,
      recordToDelete: null,
      selectedInstructor: null,
      showEditModal: false,
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["curriculums"]),

    flattenedProjects() {
      const cur = this.curriculums || [];
      return cur.map((c) => {
        const program_name = c.program?.program_name || "";
        const curriculum_name = c.curriculum_name || "";
        const curriculum_since = c.curriculum_since || "";
        const curriculum_effective = c.curriculum_effective || "";
        const curriculum_id = c.curriculum_id;
        const projectedSections = (c.projected || [])
          .map((p) => p.project_section)
          .join(", ");
        return {
          curriculum_id,
          program_name,
          curriculum_name,
          curriculum_since,
          curriculum_effective,
          projectedSections,
        };
      });
    },
    filteredData() {
      const q = this.searchQuery.toLowerCase();
      return this.flattenedProjects.filter((item) =>
        `${item.program_name} ${item.curriculum_name}`.toLowerCase().includes(q)
      );
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

    tableHeightClass() {
      return this.paginatedData.length <= this.itemsPerPage
        ? "h-auto"
        : "h-[65vh]";
    },
  },
  methods: {
    async loadcurriculums() {
      const store = useFetchDataStore();
      await store.fetchCurriculums();
    },
    toggleDownloads() {
      /* implement download logic if needed */
    },
    toggleEdit(item) {
      this.selectedInstructor = item;
      this.showEditModal = true;
    },
    toggleDelete(item) {
      this.recordToDelete = item;
      this.showDeleteModal = true;
    },
    async confirmDelete() {
      if (!this.recordToDelete) return;
      try {
        await axios.delete(
          `http://localhost:8000/projected/delete-id/${this.recordToDelete.project_id}`
        );
        const store = useFetchDataStore();
        await store.fetchCurriculums();
        this.showDeleteModal = false;
        toast.success("Deleted successfully");
      } catch (err) {
        toast.error("Delete failed");
        console.error(err);
      }
    },
    changePage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    },
    closeModal() {
      this.showEditModal = false;
      this.selectedInstructor = null;
    },
  },
  mounted() {
    this.loadcurriculums();
  },
};
</script>

<style scoped>
/* optional styling adjustments */
</style>
