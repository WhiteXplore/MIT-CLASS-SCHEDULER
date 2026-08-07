<template>
  <div v-if="isTable" class=" ">
    <div class="text-sm flex justify-between">
      <div class="text-[13px] text-text mt-4 font-regular">
        Pages / Instructor Information
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
                        class="px-4 py-3 w-10 text-left rounded-tl-lg font-normal w-[10%]"
                      >
                        ID
                      </th>
                      <th class="px-4 py-3 text-left font-normal">Full Name</th>
                      <th class="px-4 py-3 text-left font-normal">
                        Job Status
                      </th>
                      <th class="px-4 py-3 text-left font-normal">Status</th>
                      <th class="px-4 py-3 text-left font-normal">
                        Archive Status
                      </th>
                      <th class="px-4 py-3 text-left rounded-tr-lg font-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="instructor_data in paginatedData"
                      :key="instructor_data.instructor_id"
                      class="bg-white hover:bg-slate-50 transition-all duration-200 border border-slate-200 rounded-2xl"
                    >
                      <!-- ID -->
                      <td
                        class="px-4 py-3 text-left text-slate-600 font-medium"
                      >
                        {{ instructor_data.employee_id || "N/A" }}
                      </td>

                      <!-- Full Name -->
                      <td class="px-4 py-3 text-left">
                        <div class="flex items-center gap-3">
                          <!-- Avatar -->
                          <!-- <div
                            class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-semibold"
                          >
                            {{ instructor_data.instructor_fname?.charAt(0) }}
                          </div> -->

                          <div>
                            <h1
                              class="text-[14px] font-semibold text-slate-800 leading-none"
                            >
                              {{ instructor_data.instructor_fname }}
                              {{ instructor_data.instructor_lname }}
                            </h1>

                            <!-- <p class="text-xs text-slate-400 mt-1">
                              {{ instructor_data.employee_id || "No Employee ID" }}
                            </p> -->
                          </div>
                        </div>
                      </td>

                      <!-- Job Type -->
                      <td class="px-4 py-3 text-left">
                        <span
                          class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                        >
                          {{ instructor_data.instructor_jobtype }}
                        </span>
                      </td>

                      <!-- Active Status -->
                      <td class="px-4 py-3 text-left">
                        <span
                          class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                          :class="
                            instructor_data.is_active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          "
                        >
                          <span
                            class="w-2 h-2 rounded-full"
                            :class="
                              instructor_data.is_active
                                ? 'bg-emerald-500'
                                : 'bg-red-500'
                            "
                          ></span>

                          {{
                            instructor_data.is_active ? "Active" : "Inactive"
                          }}
                        </span>
                      </td>

                      <td class="px-4 py-3 text-left">
                        <span
                          class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                          :class="
                            instructor_data.is_archive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          "
                        >
                          <span
                            class="w-2 h-2 rounded-full"
                            :class="
                              instructor_data.is_archive
                                ? 'bg-emerald-500'
                                : 'bg-red-500'
                            "
                          ></span>

                          {{
                            instructor_data.is_archive ? "Archived" : "Return"
                          }}
                        </span>
                      </td>

                      <!-- Actions -->
                      <td class="px-4 py-3 text-left">
                        <div class="flex items-center gap-2">
                          <!-- View -->
                          <button
                            class="px-3 py-1 h-8 border border-gray-300 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center gap-1"
                            @click="toggleView(instructor_data)"
                          >
                            <icon name="eye" />
                            View
                          </button>

                          <!-- Edit -->
                          <button
                            class="px-3 py-1 h-8 border border-blue-300 hover:bg-blue-200 text-blue-800 rounded-lg flex items-center gap-1"
                            @click="toggleEdit(instructor_data)"
                          >
                            <icon name="edit" /> Edit
                          </button>

                          <!-- Delete -->
                          <!-- <button
                            class="px-3 py-1 h-8 border border-red-300 hover:bg-red-200 text-red-800 rounded-lg flex items-center gap-1"
                            @click="toggleDelete(instructor_data)"
                          >
                            <icon name="delete" /> Delete
                          </button> -->

                          <!-- Return  -->
                          <button
                            class="px-3 py-1 h-8 border border-green-300 hover:bg-green-200 text-green-800 rounded-lg flex items-center gap-1"
                            @click="toggleRestore(instructor_data)"
                          >
                            <icon name="undo" />
                            Return
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="paginatedData.length === 0">
                      <td colspan="4" class="text-center py-2 text-gray-400">
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

  <AddInstructor
    v-if="isAddFacultyLoad"
    @close="closeView"
    @refresh="loadInstructors"
  />
  <EditInstructor
    v-if="showEditModal && selectedInstructor"
    :instructorData="selectedInstructor"
    @close="closeModal"
    @refresh="loadInstructors"
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
      Restore Instructor
    </h1>

    <p
      class="mt-2 text-[12px] md:text-[13px] text-center px-8 text-gray-500 leading-6"
    >
      Are you sure you want to restore
      <span class="font-semibold text-gray-700">
        {{ recordToDelete?.instructor_fname }}
        {{ recordToDelete?.instructor_lname }} </span
      >?
      <br />
      This instructor will be removed from the active list but can be restored
      later.
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

  <UploadInstructorExcel
    v-if="isUploadData"
    @close="closeView"
    @refresh="loadInstructors"
  />
  <!-- View Instructor Modal -->
  <!-- PREMIUM VIEW MODAL -->
  <!-- PREMIUM MODERN VIEW MODAL -->
  <!-- MODERN MINIMAL VIEW MODAL -->
  <div
    v-if="showViewModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-2.5"
  >
    <div
      class="w-full max-w-2xl bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden"
    >
      <!-- Header -->
      <div class="p-4 px-6 border-b border-slate-100">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-4">
            <!-- Avatar -->
            <div
              class="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg font-semibold"
            >
              {{ selectedInstructor.instructor_fname?.charAt(0) }}
            </div>

            <!-- Name -->
            <div>
              <h1
                class="text-[24px] font-semibold text-slate-900 leading-tight"
              >
                {{ selectedInstructor.instructor_fname }}
                {{ selectedInstructor.instructor_lname }}
              </h1>

              <div class="flex items-center gap-2 mt-2">
                <!-- Job Type -->
                <span
                  class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  {{ selectedInstructor.instructor_jobtype }}
                </span>

                <!-- Status -->
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="
                    selectedInstructor.is_active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                  "
                >
                  {{ selectedInstructor.is_active ? "Active" : "Inactive" }}
                </span>
              </div>
            </div>
          </div>

          <!-- Close -->
          <button
            @click="closeViewModal"
            class="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-all"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-4 px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Employee ID -->
          <div class="space-y-1">
            <p
              class="text-xs font-medium uppercase tracking-wider text-slate-400"
            >
              Employee ID
            </p>

            <h2 class="text-[15px] font-medium text-slate-800">
              {{ selectedInstructor.employee_id || "N/A" }}
            </h2>
          </div>

          <!-- Gender -->
          <div class="space-y-1">
            <p
              class="text-xs font-medium uppercase tracking-wider text-slate-400"
            >
              Gender
            </p>

            <h2 class="text-[15px] font-medium text-slate-800">
              {{ selectedInstructor.instructor_gender || "N/A" }}
            </h2>
          </div>

          <!-- Bachelor -->
          <div class="space-y-1">
            <p
              class="text-xs font-medium uppercase tracking-wider text-slate-400"
            >
              Bachelor Program
            </p>

            <h2 class="text-[15px] font-medium text-slate-800">
              {{
                selectedInstructor.bachelor?.bachelor_category || "Not Assigned"
              }}
            </h2>
          </div>

          <!-- Master -->
          <div class="space-y-1">
            <p
              class="text-xs font-medium uppercase tracking-wider text-slate-400"
            >
              Master Program
            </p>

            <h2 class="text-[15px] font-medium text-slate-800">
              {{ selectedInstructor.master?.master_category || "Not Assigned" }}
            </h2>
          </div>

          <!-- Doctorate -->
          <div class="space-y-1 md:col-span-2">
            <p
              class="text-xs font-medium uppercase tracking-wider text-slate-400"
            >
              Doctorate Program
            </p>

            <h2 class="text-[15px] font-medium text-slate-800">
              {{
                selectedInstructor.doctorate?.doctorate_category ||
                "Not Assigned"
              }}
            </h2>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="flex items-center justify-between mt-10 pt-5 border-t border-slate-100"
        >
          <div>
            <p class="text-xs uppercase tracking-wider text-slate-400">
              Created
            </p>

            <p class="text-sm text-slate-600 mt-1">
              {{ new Date(selectedInstructor.created_at).toLocaleDateString() }}
            </p>
          </div>

          <button
            @click="closeViewModal"
            class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import AddInstructor from "../modals/add-instructor.vue";
import EditInstructor from "../modals/edit-instructor.vue";
import UploadInstructorExcel from "../modals/upload-instructor.vue";
import { toast } from "vue3-toastify";
import { useFetchDataStore } from "../../../../store/fetch-data-store.js";
import { mapState } from "pinia";
import axios from "axios";

export default {
  name: "TableFacultyArchive",
  components: {
    AddInstructor,
    EditInstructor,
    UploadInstructorExcel,
    icon,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
      isAddFacultyLoad: false,
      isRecordVisible: false,
      isEdit: false,
      isTable: true,
      showArchiveModal: false,
      recordToDelete: null,
      selectedInstructor: null, // 🔁 Renamed for clarity
      showEditModal: false, // ✅ Needed to show/hide modal
      isUploadData: false,
      showViewModal: false,
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["instructors"]),

    filteredData() {
      const query = this.searchQuery.toLowerCase();

      return this.instructors.filter((item) => {
        return (
          item.is_archive &&
          `${item.instructor_fname} ${item.instructor_mname} ${item.instructor_lname}`
            .toLowerCase()
            .includes(query)
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
      this.recordToDelete = item;
      this.showArchiveModal = true;
    },

    async confirmRestore() {
      if (!this.recordToDelete) return;

      try {
        await axios.patch(
          `${process.env.VUE_APP_API_BASE_URL}/instructors/update-instructor/${this.recordToDelete.instructor_id}`,
          {
            is_archive: false,
            is_active: true,
          },
        );

        const store = useFetchDataStore();
        await store.fetchInstructors();

        this.showArchiveModal = false;
        this.recordToDelete = null;

        toast.success("Instructor restored successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to restored instructor");
      }
    },
    toggleView(item) {
      this.selectedInstructor = item;
      this.showViewModal = true;
    },

    closeViewModal() {
      this.showViewModal = false;
    },
    toggleUpload() {
      this.isUploadData = true;
    },
    async loadInstructors() {
      const store = useFetchDataStore();
      await store.fetchInstructors();
    },
    toggleAdd() {
      this.isAddFacultyLoad = true;
      this.isTable = true;
    },
    toggleEdit(item) {
      this.selectedInstructor = item; // 🔁 Updated name
      this.showEditModal = true;
    },

    toggleDelete(item) {
      this.recordToDelete = item;
      this.showArchiveModal = true;
    },
    async confirmDelete() {
      if (!this.recordToDelete) return;
      try {
        await axios.delete(
          `${process.env.VUE_APP_API_BASE_URL}/instructors/delete-id/${this.recordToDelete.instructor_id}`,
        );

        // Play sound after successful delete
        const audio = new Audio(require("@/assets/delete.mp3"));
        audio.play();

        // Refresh store
        const store = useFetchDataStore();
        await store.fetchInstructors();

        this.recordToDelete = null;
        this.showArchiveModal = false;
        toast.success("Instructor deleted successfully");
      } catch (error) {
        toast.error("Failed to delete record");
        console.error("Delete error:", error);
      }
    },
    changePage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    },
    // tableHeightClass() {
    //   const count = this.paginatedData.length;
    //   return count <= 20 ? "h-auto" : "h-[25vh]";
    // },
    closeView() {
      this.isAddFacultyLoad = false;
      this.isUploadData = false;
    },
    closeModal() {
      this.showEditModal = false;
      this.selectedInstructor = null;
    },
    handleBackToTable() {
      this.isRecordVisible = false;
      this.isEdit = false;
      this.isAddFacultyLoad = false;
      this.isUploadData = false;
      this.isTable = true;
    },
  },
  mounted() {
    this.loadInstructors();
  },
};
</script>
