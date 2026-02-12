<template>
  <div class="text-[14px] bg-white rounded-xl">
    <div class="mt-2 overflow-x-auto border p-2 rounded-xl">
      <!-- Top controls -->
      <div class="text-gray-700 flex justify-between items-start mt-1">
        <!-- Items Per Page -->
        <div class="flex items-center">
          <select
            v-model="itemsPerPage"
            class="px-1 py-1 border rounded-md"
            @change="changePage(1)"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <span class="ml-2">Per page</span>
        </div>

        <!-- Search -->
        <div class="flex items-center gap-2">
          <input
            v-model="searchQuery"
            type="text"
            class="px-3 w-[300px] py-3 border rounded-md"
            placeholder="Search..."
            @input="changePage(1)"
          />
        </div>
      </div>
      <div class="w-full mt-3 rounded-xl shadow-md overflow-hidden">
        <div class="overflow-y-auto max-h-[550px]">
          <table
            class="min-w-full table-auto border-separate border-spacing-y-2 text-sm text-gray-700"
          >
            <thead
              class="bg-blue-800 text-white sticky top-0 z-10 tracking-wide"
            >
              <tr>
                <th class="px-4 py-3 text-center rounded-tl-xl font-normal">
                  #
                </th>
                <th class="px-4 py-3 text-left font-normal">Program</th>
                <th class="px-4 py-3 text-left font-normal">Program Code</th>
                <th class="px-4 py-3 text-left font-normal">Program Major</th>
                <th class="px-4 py-3 text-left font-normal">Day</th>
                <th class="px-4 py-3 text-left font-normal">Time</th>
                <th class="px-4 py-3 text-left rounded-tr-xl font-normal">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(view_all_data, index) in paginatedData"
                :key="view_all_data.schedule_id"
                class="bg-white hover:bg-blue-50 transition-all border border-gray-200 rounded-md shadow-sm"
              >
                <td class="px-4 py-3 text-center">
                  {{ startIndex + index }}
                </td>
                <td class="px-4 py-3 text-left">
                  {{ view_all_data.program_name || "-" }}
                </td>
                <td class="px-4 py-3 text-left">
                  {{ view_all_data.program_code || "-" }}
                </td>
                <td class="px-4 py-3 text-left">
                  {{ view_all_data.program_major || "-" }}
                </td>
                <td class="px-4 py-3 text-left">
                  {{ view_all_data.schedule_days || "-" }}
                </td>
                <td class="px-4 py-3 text-left">
                  {{
                    formatTime(view_all_data.time_start) +
                    " - " +
                    formatTime(view_all_data.time_end)
                  }}
                </td>
                <td class="px-4 py-3 text-left">
                  {{ view_all_data.status || "Not Available" }}
                </td>
              </tr>
              <tr v-if="paginatedData.length === 0">
                <td colspan="7" class="text-center py-8 text-gray-400">
                  No records found
                </td>
              </tr>
            </tbody>
          </table>
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
            class="px-3 py-1 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-200"
          >
            &lt;
          </button>
          <span v-for="page in pageNumbers" :key="'page-' + page">
            <button
              @click="changePage(page)"
              :class="{
                'bg-blue-800 text-white': currentPage === page,
                'bg-gray-200 text-gray-700': currentPage !== page,
              }"
              class="px-3 py-1 mx-1 rounded-md hover:bg-blue-300"
            >
              {{ page }}
            </button>
          </span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-200"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useFetchDataStore } from "../../../../../store/fetch-data-store";
import { mapState } from "pinia";
export default {
  name: "TableViewPrograms",

  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",

      isEdit: false,
      isTable: true,
      isUploadData: false,
      showDeleteModal: false,
      recordToDelete: null,
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["detailedPrograms"]),

    filteredData() {
      const query = this.searchQuery.toLowerCase();
      return this.detailedPrograms.filter((item) => {
        const instructorName = `${item.instructor_fname || ""} ${
          item.instructor_lname || ""
        }`.toLowerCase();
        const jobType = (item.instructor_jobtype || "").toLowerCase();
        const bachelorCategory = (item.bachelor_category || "").toLowerCase();
        const bachelorType = (item.bachelor_type || "").toLowerCase();
        const masterCategory = (item.master_category || "").toLowerCase();
        const masterType = (item.master_type || "").toLowerCase();
        const doctorateCategory = (item.doctorate_category || "").toLowerCase();
        const doctorateType = (item.doctorate_type || "").toLowerCase();
        const roomName = (item.room_name || "").toLowerCase();
        const roomNumber = (item.room_number || "").toString().toLowerCase();
        const roomType = (item.room_type || "").toLowerCase();
        const status = (item.status || "Not Available").toLowerCase();

        return (
          instructorName.includes(query) ||
          jobType.includes(query) ||
          bachelorCategory.includes(query) ||
          bachelorType.includes(query) ||
          masterCategory.includes(query) ||
          masterType.includes(query) ||
          doctorateCategory.includes(query) ||
          doctorateType.includes(query) ||
          roomName.includes(query) ||
          roomNumber.includes(query) ||
          roomType.includes(query) ||
          status.includes(query)
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
    formatTime(time) {
      if (!time) return "";
      const [hour, minute] = time.split(":");
      const h = parseInt(hour);
      const ampm = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      return `${hour12}:${minute} ${ampm}`;
    },

    async loadViews() {
      const store = useFetchDataStore();
      await store.fetchDetailedPrograms();
    },
    toggleUploadData() {
      this.isUploadData = true;
      this.isTable = true;
    },

    changePage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    },
    // tableHeightClass() {
    //   const count = this.paginatedData.length;
    //   return count <= 20 ? "h-auto" : "h-[25vh]";
    // },
    closeView() {
      this.isUploadData = false;
    },
  },
  mounted() {
    this.loadViews();
  },
};
</script>
<style lang=""></style>
