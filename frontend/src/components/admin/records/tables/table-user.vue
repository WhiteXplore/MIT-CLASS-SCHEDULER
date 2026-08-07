<template>
  <div v-if="isTable" class=" ">
    <div class="text-sm flex justify-between">
      <div class="text-[13px] text-text mt-4 font-regular">
        User Account Management
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
        <span class="font-medium text-sm">Add User</span>
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
                        #
                      </th>

                      <th class="px-4 py-3 text-left font-normal">
                        Employee ID
                      </th>

                      <th class="px-4 py-3 text-left font-normal">
                        First Name
                      </th>

                      <th class="px-4 py-3 text-left font-normal">Last Name</th>

                      <th class="px-4 py-3 text-left font-normal">Position</th>

                      <th class="px-4 py-3 text-left font-normal">Office</th>

                      <th class="px-4 py-3 text-left font-normal">Email</th>

                      <th class="px-4 py-3 text-left font-normal">Role</th>

                      <th class="px-4 py-3 text-left rounded-tr-lg font-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(user, index) in paginatedData"
                      :key="user.id"
                      class="bg-white hover:bg-blue-50 transition-all border border-gray-200 rounded-md shadow-sm"
                    >
                      <td class="px-4 py-3">
                        {{ startIndex + index }}
                      </td>

                      <td class="px-4 py-3 font-medium">
                        {{ user.employee_id }}
                      </td>

                      <td class="px-4 py-3">
                        {{ user.first_name }}
                      </td>

                      <td class="px-4 py-3">
                        {{ user.last_name }}
                      </td>

                      <td class="px-4 py-3">
                        {{ user.position }}
                      </td>

                      <td class="px-4 py-3">
                        {{ user.office }}
                      </td>

                      <td class="px-4 py-3">
                        {{ user.email }}
                      </td>

                      <td class="px-4 py-3">
                        <span
                          class="px-3 py-1 rounded-full text-xs font-semibold"
                          :class="
                            user.role === 'Admin'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          "
                        >
                          {{ user.role }}
                        </span>
                      </td>

                      <td class="px-4 py-3">
                        <div class="flex gap-2">
                          <button
                            class="px-3 py-1 h-8 border border-blue-300 hover:bg-blue-200 text-blue-800 rounded-lg flex items-center gap-1"
                            @click="toggleEdit(user)"
                          >
                            <icon name="edit" />
                            Edit
                          </button>

                          <!-- <button
                            class="px-3 py-1 h-8 border border-red-300 hover:bg-red-200 text-red-800 rounded-lg flex items-center gap-1"
                            @click="toggleDelete(user)"
                          >
                            <icon name="delete" />
                            Delete
                          </button> -->

                          <button
                            class="px-3 py-1 h-8 border border-amber-300 hover:bg-amber-200 text-amber-800 rounded-lg flex items-center gap-1"
                            @click="toggleArchive(user)"
                          >
                            <icon name="circle-down" /> Archive
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr v-if="paginatedData.length === 0">
                      <td colspan="9" class="text-center py-8 text-gray-400">
                        No users found
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
  <addUser v-if="isAdd" @close="closeView" @refresh="loadUsers" />

  <addUser
    v-if="showEditModal"
    :userData="selectedUser"
    @close="closeModal"
    @refresh="loadUsers"
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
      Archive Confirmation
    </h1>

    <p
      class="mt-2 text-[12px] md:text-[13px] text-center px-8 text-gray-500 leading-6"
    >
      Are you sure you want to archive? This program will be removed from the
      active list but can be restored later.
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
        class="bg-amber-600 p-2 px-4 text-[11px] md:text-[13px] rounded-md text-white hover:bg-amber-700 transition"
        @click="confirmArchive"
      >
        Yes, Archive
      </button>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import { toast } from "vue3-toastify";
import { useFetchDataStore } from "../../../../store/fetch-data-store";
import addUser from "../modals/add-user.vue";
import { mapState } from "pinia";
import axios from "axios";

export default {
  name: "TableUsers",

  components: {
    icon,
    addUser,
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
      showArchiveModal: false,
      recordToArchived: null,
      selectedUser: null,
      showEditModal: false,
    };
  },

  computed: {
    ...mapState(useFetchDataStore, ["user_accounts"]),

    filteredData() {
      const query = this.searchQuery.toLowerCase();

      return (this.user_accounts || []).filter((item) => {
        return (
          !item.is_archive &&
          [
            item.employee_id,
            item.first_name,
            item.last_name,
            item.position,
            item.office,
            item.email,
            item.role,
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

      return this.filteredData.slice(start, start + Number(this.itemsPerPage));
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
      const delta = 1;
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
    toggleArchive(item) {
      this.recordToArchived = item; // reuse existing variable
      this.showArchiveModal = true; // reuse existing modal
    },
    async confirmArchive() {
      if (!this.recordToArchived) return;

      try {
        await axios.patch(
          `${process.env.VUE_APP_API_BASE_URL}/user/update-user/${this.recordToArchived.id}`,
          {
            is_archive: true,
          },
        );

        const store = useFetchDataStore();
        await store.fetchUserAccounts();

        this.showArchiveModal = false;
        this.recordToArchived = null;

        toast.success("User archived successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to archive User");
      }
    },
    async loadUsers() {
      try {
        const store = useFetchDataStore();
        await store.fetchUserAccounts();
      } catch (error) {
        console.error(error);
        toast.error("Failed to load users");
      }
    },

    toggleUploadData() {
      this.isUploadData = true;
      this.isTable = true;
    },

    toggleAdd() {
      this.isAdd = true;
      this.isTable = true;
    },

    toggleEdit(user) {
      this.selectedUser = user;
      this.showEditModal = true;
    },

    toggleDelete(user) {
      this.recordToDelete = user;
      this.showDeleteModal = true;
    },

    async confirmDelete() {
      if (!this.recordToDelete || !this.recordToDelete.id) {
        toast.error("Invalid User ID");
        return;
      }

      try {
        await axios.delete(
          `${process.env.VUE_APP_API_BASE_URL}/user/${this.recordToDelete.id}`,
        );

        const audio = new Audio(require("@/assets/delete.mp3"));
        audio.play();

        toast.success("User deleted successfully");

        this.showDeleteModal = false;
        this.recordToDelete = null;

        await this.loadUsers();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete user");
      }
    },

    changePage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    },

    closeView() {
      this.isAdd = false;
      this.isUploadData = false;
    },

    closeModal() {
      this.showEditModal = false;
      this.selectedUser = null;
    },

    handleBackToTable() {
      this.isEdit = false;
      this.isAdd = false;
      this.isUploadData = false;
      this.isTable = true;
    },
  },

  async mounted() {
    await this.loadUsers();
  },
};
</script>
