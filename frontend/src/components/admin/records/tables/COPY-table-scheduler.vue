<template>
  <div class=" ">
    <!-- Header with buttons -->
    <div
      class="text-sm flex justify-between items-center mb-4"
      v-if="!isDayView"
    >
      <div class="text-[13px] text-text font-regular">
        Pages / Class Schedules
      </div>
      <div class="flex gap-3">
        <!-- View Schedules Button -->
        <router-link
          to="/views"
          @click="toggleView"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-800 hover:shadow-lg transition duration-200"
        >
          <div
            class="p-1 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
          >
            <icon :name="'calendar1'" class="w-4 h-4" />
          </div>
          <span class="font-medium text-sm">View Schedules</span>
        </router-link>

        <!-- Add Schedules Button -->
        <div
          @click="toggleAdd"
          class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl over:bg-green-700 hover:shadow-lg cursor-pointer transition duration-200"
        >
          <div
            class="p-1 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
          >
            <icon :name="'add-account1.1'" class="w-4 h-4" />
          </div>
          <span class="font-medium text-sm">Add Schedule</span>
        </div>
      </div>
    </div>

    <!-- Week View Table -->
    <div class="w-full mt-4 rounded-xl border overflow-x-auto">
      <div class="overflow-y-auto h-[82vh] bg-white p-4 rounded-xl">
        <table
          v-if="!isDayView"
          class="w-full table-auto border-separate text-sm text-gray-700"
        >
          <thead>
            <tr class="bg-blue-800 text-white uppercase tracking-wide">
              <th
                v-for="day in weekDays"
                :key="day"
                class="p-3 text-center font-normal"
              >
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                v-for="day in weekDays"
                :key="day"
                class="align-top p-2 border border-gray-100"
              >
                <ul class="space-y-2 text-left">
                  <template v-if="getSlotsForDay(day).length > 0">
                    <li
                      v-for="(slot, idx) in getSlotsForDay(day)"
                      :key="idx"
                      class="bg-white rounded-lg p-3 border border-blue-200 shadow hover:shadow-md transition-all"
                      :title="`${slot.instructorName} (${formatTime(
                        slot.startTime
                      )} - ${formatTime(slot.endTime)})`"
                    >
                      <div
                        class="font-semibold text-blue-900 uppercase text-[13px]"
                      >
                        {{ slot.instructorName }}
                      </div>
                      <div class="text-gray-700 text-xs mt-1">
                        <div>
                          Room: <span class="font-medium">{{ slot.room }}</span>
                        </div>
                        <div>
                          {{ formatTime(slot.startTime) }} -
                          {{ formatTime(slot.endTime) }}
                        </div>
                      </div>
                      <div class="mt-2 text-xs flex gap-1">
                        <span class="font-semibold">Status:</span>
                        <span
                          :class="
                            slot.status === 'Available'
                              ? 'text-green-600'
                              : 'text-red-600'
                          "
                          class="font-medium"
                        >
                          {{ slot.status }}
                        </span>
                      </div>
                    </li>
                  </template>

                  <li
                    v-else
                    class="text-center text-sm text-green-600 italic bg-green-50 border border-green-100 rounded-md py-2"
                  >
                    Available
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Schedule Modal Placeholder -->
    <AddClassSchedules
      v-if="isAdd"
      :room-schedules="roomSchedules"
      @refresh="loadSchedulers"
      @close="closeView"
    />
    <tableViewAll
      v-if="isViewAll"
      @refresh="loadSchedulers"
      @close="closeView"
      @back-to-table-schedulers="handleBackToTable"
    />
  </div>
  <!-- Delete Confirmation Modal -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-30"
  >
    <div
      class="rounded-xl shadow-lg w-[300px] md:w-[400px] bg-white py-6 px-4 flex flex-col items-center"
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
        Are you sure you want to delete this record? This action cannot be
        undone.
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
  </div>
</template>

<script>
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useFetchDataStore } from "../../../../store/fetch-data-store";
import { mapState } from "pinia";
import AddClassSchedules from "../modals/add-schedulers.vue";
import tableViewAll from "./table-view-all.vue";
import icon from "@/assets/icon.vue";
import { toast } from "vue3-toastify";
import axios from "axios";
dayjs.extend(isoWeek);

export default {
  name: "TableSchedulers",
  components: { AddClassSchedules, icon, tableViewAll },
  data() {
    return {
      currentDate: dayjs(),
      roomSchedules: [],
      isAdd: false,
      isViewAll: false,
      isDayView: false,
      selectedDay: null,
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      schedules: [],
      weekDays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      recordToDelete: null,
      showDeleteModal: false,
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["schedulers"]),

    filteredData() {
      const data = this.schedulers || [];
      if (!this.searchQuery) return data;
      const q = this.searchQuery.toLowerCase();
      return data.filter(
        (item) =>
          (item.room?.room_name?.toLowerCase() || "").includes(q) ||
          (item.time_start || "").toLowerCase().includes(q) ||
          (item.time_end || "").toLowerCase().includes(q) ||
          "not available".includes(q) || //
          `${item.instructor?.instructor_fname || ""} ${
            item.instructor?.instructor_lname || ""
          }`
            .toLowerCase()
            .includes(q)
      );
    },

    filteredDaySlots() {
      if (!this.roomSchedules || !this.selectedDay) return [];

      const selected = dayjs(this.selectedDay).format("YYYY-MM-DD");

      let daySlots = this.roomSchedules.filter(
        (slot) => dayjs(slot.date).format("YYYY-MM-DD") === selected
      );

      if (!this.searchQuery) return daySlots;

      const q = this.searchQuery.toLowerCase();

      return daySlots.filter(
        (slot) =>
          slot.room.toLowerCase().includes(q) ||
          slot.status.toLowerCase().includes(q) ||
          (slot.instructorName && slot.instructorName.toLowerCase().includes(q))
      );
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage) || 1;
    },

    pageNumbers() {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
      return pages;
    },

    paginatedData() {
      const data = this.filteredData || [];
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return data.slice(start, end);
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

    // Get unique schedule_ids from filteredDaySlots
    uniqueScheduleIds() {
      const ids = new Set();
      this.filteredDaySlots.forEach((slot) => {
        if (slot.schedule_id !== undefined) ids.add(slot.schedule_id);
      });
      return Array.from(ids);
    },

    // Paginate unique schedule IDs
    paginatedScheduleIds() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.uniqueScheduleIds.slice(start, end);
    },

    // Filter slots that belong to current page schedule IDs
    paginatedSlots() {
      if (!this.filteredDaySlots) return [];

      const idsOnPage = new Set(this.paginatedScheduleIds);
      return this.filteredDaySlots.filter((slot) =>
        idsOnPage.has(slot.schedule_id)
      );
    },
  },
  methods: {
    changePage(page) {
      if (page < 1) page = 1;
      else if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },
    toggleAdd() {
      this.isAdd = true;
    },
    closeView() {
      this.isAdd = false;
    },
    handleBackToTable() {
      this.isAdd = false;
    },
    toggleView() {
      // Reset all views first
      this.isAdd = false;
      this.isDayView = true;

      // Then toggle viewAll
      this.isViewAll = !this.isViewAll;
    },

    // viewDay(date) {
    //   this.selectedDay = date;
    //   this.isDayView = true;
    //   this.currentPage = 1;
    //   this.searchQuery = "";
    // },
    backToWeek() {
      this.selectedDay = null;
      this.isDayView = false;
      this.currentPage = 1;
      this.searchQuery = "";
    },

    formatDayName(dateStr) {
      return dayjs(dateStr).format("dddd");
    },

    formatTime(time) {
      if (!time) return "";
      const [hour, minute] = time.split(":");
      const h = parseInt(hour);
      const ampm = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      return `${hour12}:${minute} ${ampm}`;
    },

    getDayIndex(dayName) {
      const map = {
        Monday: 0,
        Tuesday: 1,
        Wednesday: 2,
        Thursday: 3,
        Friday: 4,
        Saturday: 5,
        Sunday: 6,
      };
      return map[dayName];
    },

    getDateOfWeekDay(dayName) {
      const startOfWeek = this.currentDate.startOf("isoWeek");
      const dayIndex = this.getDayIndex(dayName);
      return startOfWeek.add(dayIndex, "day").format("YYYY-MM-DD");
    },
    getSlotsForDay(dayName) {
      const date = this.getDateOfWeekDay(dayName);
      return this.roomSchedules
        .filter((slot) => slot.date === date)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    },

    async loadSchedulers() {
      const store = useFetchDataStore();
      await store.fetchSchedulers();

      const schedulers = store.schedulers || [];
      const weekStart = this.currentDate.startOf("isoWeek");

      this.roomSchedules = schedulers.flatMap((entry) => {
        let days = [];

        if (Array.isArray(entry.schedule_days)) {
          days = entry.schedule_days;
        } else if (typeof entry.schedule_days === "string") {
          days = entry.schedule_days.split(",").map((d) => d.trim());
        }

        return days.map((dayName) => {
          const dayIndex = this.getDayIndex(dayName);
          const date = weekStart.add(dayIndex, "day").format("YYYY-MM-DD");

          return {
            schedule_id: entry.schedule_id,
            date,
            room: `${entry.room?.room_name || "N/A"}${
              entry.room?.room_number || ""
            }`.trim(),
            instructorName: `${entry.instructor?.instructor_fname || ""} ${
              entry.instructor?.instructor_lname || ""
            }`.trim(),
            startTime: entry.time_start,
            endTime: entry.time_end,
            status: "Scheduled",
          };
        });
      });
    },
    toggleDelete(item) {
      this.recordToDelete = item;
      this.showDeleteModal = true;
    },

    async confirmDelete() {
      if (!this.recordToDelete) return;
      try {
        // Assuming you want to delete a schedule by schedule_id
        await axios.delete(
          `http://localhost:8000/class-schedules/delete-id/${this.recordToDelete.schedule_id}`
        );

        // Play sound after successful delete
        const audio = new Audio(require("@/assets/delete.mp3"));
        audio.play();

        // Refresh schedulers list after deletion
        const store = useFetchDataStore();
        await store.fetchSchedulers();
        await this.loadSchedulers();

        this.recordToDelete = null;
        this.showDeleteModal = false;
        toast.success("Schedule deleted successfully");
      } catch (error) {
        toast.error("Failed to delete record");
        console.error("Delete error:", error);
      }
    },
  },
  mounted() {
    this.loadSchedulers();
  },
};
</script>
