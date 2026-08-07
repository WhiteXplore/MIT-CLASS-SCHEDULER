<template>
  <div v-if="isTable" class=" ">
    <div class="text-sm flex justify-between">
      <div class="text-[13px] text-text mt-4 font-regular">
        Pages / Curriculum
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
                        Curriculum Name
                      </th>
                      <th class="px-4 py-3 text-left font-normal">
                        Year Introduced
                      </th>
                      <th class="px-4 py-3 text-left font-normal">
                        Effective Year
                      </th>
                      <th class="px-4 py-3 text-left font-normal">
                        Consortium
                      </th>
                      <th class="px-4 py-3 text-left font-normal">
                        CMO Series
                      </th>
                      <th class="px-4 py-3 text-left font-normal">Status</th>
                      <th class="px-4 py-3 text-left rounded-tr-lg font-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(curriculum_data, index) in paginatedData"
                      :key="curriculum_data.curriculum_id"
                      class="bg-white hover:bg-blue-50 transition-all border border-gray-200 rounded-md shadow-sm"
                    >
                      <td class="px-4 py-2 text-left">
                        {{ startIndex + index }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        {{ curriculum_data.program?.program_name }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        {{ curriculum_data.curriculum_name }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        {{ curriculum_data.curriculum_since }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        {{ curriculum_data.curriculum_effective }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        {{ curriculum_data.curriculum_consortium }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        {{ curriculum_data.curriculum_cmo }}
                      </td>
                      <td class="px-4 py-2 text-left">
                        <span
                          v-if="curriculum_data.curriculum_status === 'Active'"
                          class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full"
                        >
                          Active
                        </span>
                        <span
                          v-else
                          class="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full"
                        >
                          Inactive
                        </span>
                      </td>
                      <td class="px-4 py-2 text-left">
                        <div class="flex gap-2">
                          <button
                            class="px-3 py-1 h-8 border border-blue-300 hover:bg-blue-200 text-blue-800 rounded-lg flex items-center gap-1"
                            @click="toggleEdit(curriculum_data)"
                          >
                            <icon name="edit" /> Edit
                          </button>
                          <button
                            class="px-3 py-1 h-8 border border-green-300 hover:bg-green-200 text-green-800 rounded-lg flex items-center gap-1"
                            @click="toggleRestore(curriculum_data)"
                          >
                            <icon name="undo" />
                            Return
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="paginatedData.length === 0">
                      <td colspan="9" class="text-center py-8 text-gray-400">
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
  <addCurriculum v-if="isAdd" @close="closeView" @refresh="loadCurriculums" />

  <editCurriculum
    v-if="showEditModal && selectedCurriculum"
    :curriculumData="selectedCurriculum"
    @close="closeModal"
    @refresh="loadCurriculums"
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
      Restore Curriculum
    </h1>

    <p
      class="mt-2 text-[12px] md:text-[13px] text-center px-8 text-gray-500 leading-6"
    >
      Are you sure you want to restore? This curriculum will be return to the
      active list.
    </p>

    <div class="w-full h-[1px] rounded-md bg-gray-200 mt-5"></div>

    <div class="tracking-wide flex gap-2 mt-5">
      <button
        class="bg-gray-100 border border-gray-300 text-gray-700 p-2 px-4 text-[11px] md:text-[13px] rounded-md hover:bg-gray-200 transition"
        @click="
          showArchiveModal = false;
          recordToDelete = null;
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
import addCurriculum from "../modals/add-curriculum.vue";
import editCurriculum from "../modals/edit-curriculum.vue";
import { toast } from "vue3-toastify";
import { useFetchDataStore } from "../../../../store/fetch-data-store.js";
import { mapState } from "pinia";
import axios from "axios";
export default {
  name: "TableCurriculum",
  components: {
    icon,
    addCurriculum,
    editCurriculum,
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
      showArchiveModal: false,
      recordToArchived: null,
      selectedCurriculum: null,
      showEditModal: false,
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["curriculums"]),

    filteredData() {
      const query = this.searchQuery.toLowerCase();

      return this.curriculums.filter((item) => {
        return (
          item.is_archive &&
          [
            item.curriculum_name,
            item.curriculum_since,
            item.curriculum_effective,
            item.curriculum_consortium,
            item.curriculum_cmo,
            item.curriculum_status,
            item.program?.program_name,
          ]
            .filter(Boolean)
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
          `${process.env.VUE_APP_API_BASE_URL}/curriculums/update-curriculum/${this.recordToArchived.curriculum_id}`,
          {
            is_archive: false,
            curriculum_status: "Active",
          },
        );

        const store = useFetchDataStore();
        await store.fetchCurriculums();

        this.showArchiveModal = false;
        this.recordToArchived = null;

        toast.success("Curriculum archived successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to archive Curriculum");
      }
    },
    async loadCurriculums() {
      const store = useFetchDataStore();
      await store.fetchCurriculums();
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
      this.selectedCurriculum = item;
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
      this.isAdd = false;
      this.isUploadData = false;
    },
    closeModal() {
      this.showEditModal = false;
      this.selectedCurriculum = null;
    },
    handleBackToTable() {
      this.isEdit = false;
      this.isAdd = false;
      this.isUploadData = false;

      this.isTable = true;
    },
  },
  mounted() {
    this.loadCurriculums();
  },
};
</script>
