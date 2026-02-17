<template>
  <div v-if="isTable" class="">
    <div class="text-sm flex justify-between">
      <div class="text-[13px] text-text mt-4 font-regular">
        Pages / Programs
      </div>

      <div
        @click="toggleAdd"
        class="flex items-center gap-2 px-2.5 py-1.5 border text-green-600 border-green-600 rounded-xl over:bg-green-700 hover:shadow-lg cursor-pointer transition duration-200"
      >
        <div
          class="p-1 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center"
        >
          <icon :name="'add-account1.1'" class="w-4 h-4" />
        </div>
        <span class="font-medium text-sm">Add Program</span>
      </div>
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
                        Program Name
                      </th>
                      <th class="px-4 py-3 text-left font-normal">
                        Program Code
                      </th>
                      <th class="px-4 py-3 text-left font-normal">
                        Program Major
                      </th>
                      <th class="px-4 py-3 text-left rounded-tr-lg font-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(programs_data, index) in paginatedData"
                      :key="programs_data.programs_id"
                      class="bg-white hover:bg-blue-50 transition-all border border-gray-200 rounded-md shadow-sm"
                    >
                      <td class="px-4 py-2 text-left">
                        {{ startIndex + index }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        {{ programs_data.program_name }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        {{ programs_data.program_code }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        {{ programs_data.program_major }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        <div class="flex gap-2">
                          <button
                            class="px-3 py-1 h-8 border border-blue-300 hover:bg-blue-200 text-blue-800 rounded-lg flex items-center gap-1"
                            @click="toggleEdit(programs_data)"
                          >
                            <icon name="edit" /> Edit
                          </button>
                          <button
                            class="px-3 py-1 h-8 border border-red-300 hover:bg-red-200 text-red-800 rounded-lg flex items-center gap-1"
                            @click="toggleDelete(programs_data)"
                          >
                            <icon name="delete" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="paginatedData.length === 0">
                      <td colspan="5" class="text-center py-8 text-gray-400">
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
  <addProgram v-if="isAdd" @close="closeView" @refresh="loadPrograms" />

  <editProgram
    v-if="showEditModal && selectedPrograms"
    :programData="selectedPrograms"
    @close="closeModal"
    @refresh="loadPrograms"
  />
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
import icon from "@/assets/icon.vue";
import addProgram from "../modals/add-programs.vue";
import editProgram from "../modals/edit-program.vue";
import { toast } from "vue3-toastify";
import { useFetchDataStore } from "../../../../store/fetch-data-store";
import { mapState } from "pinia";
import axios from "axios";
export default {
  name: "TablePrograms",
  components: {
    icon,
    addProgram,
    editProgram,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
      isAdd: false,
      isEdit: false,
      isTable: true,
      isUploadData: false,
      showDeleteModal: false,
      recordToDelete: null,
      selectedPrograms: null,
      showEditModal: false,
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["programs"]),

    filteredData() {
      const query = this.searchQuery.toLowerCase();
      return this.programs.filter((item) =>
        `${item.program_name} ${item.program_code} ${item.program_major}`
          .toLowerCase()
          .includes(query),
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
  },
  methods: {
    async loadPrograms() {
      const store = useFetchDataStore();
      await store.fetchPrograms();
    },
    toggleUploadData() {
      this.isUploadData = true;
      this.isTable = true;
    },
    toggleAdd() {
      this.isAdd = true;
      this.isTable = true;
    },

    toggleEdit(item) {
      this.selectedPrograms = item;
      this.showEditModal = true;
    },
    toggleDelete(item) {
      this.recordToDelete = item;
      this.showDeleteModal = true;
    },
    confirmDelete() {
      if (!this.recordToDelete || isNaN(this.recordToDelete.program_id)) {
        toast.error("Invalid program ID.");
        return;
      }

      const programId = this.recordToDelete.program_id;

      axios
        .delete(
          `${process.env.VUE_APP_API_BASE_URL}/programs/delete-id/${programId}`,
        )
        .then(() => {
          this.recordToDelete = null;
          this.showDeleteModal = false;
          // Play sound after successful delete
          const audio = new Audio(require("@/assets/delete.mp3"));
          audio.play();

          this.loadPrograms();
          toast.success("Record deleted successfully");
        })
        .catch((error) => {
          console.error("Delete failed:", error);
          toast.error("Failed to delete record.");
        });
    },
    changePage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    },
    // tableHeightClass() {
    //   const count = this.paginatedData.length;
    //   return count <= 20 ? "h-auto" : "h-[10vh]";
    // },
    closeView() {
      this.isAdd = false;
      this.isUploadData = false;
    },
    closeModal() {
      this.showEditModal = false;
      this.selectedPrograms = null;
    },
    handleBackToTable() {
      this.isEdit = false;
      this.isAdd = false;
      this.isUploadData = false;
      this.isTable = true;
    },
  },
  mounted() {
    this.loadPrograms();
  },
};
</script>
