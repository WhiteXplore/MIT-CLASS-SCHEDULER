<template>
  <div class="min-h-screen">
    <div class="flex gap-3 w-full justify-between items-center flex-wrap">
      <!-- LEFT: Filters + Search -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- School Year Dropdown -->
        <div class="flex flex-col">
          <select
            v-model="selectedSchoolYear"
            class="px-4 py-3 rounded-lg border border-gray-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="null">All Years</option>
            <option v-for="year in schoolYearOptions" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Semester Dropdown -->
        <div class="flex flex-col">
          <select
            v-model="selectedSemester"
            class="px-4 py-3 rounded-lg border border-gray-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="0">Select Semester</option>
            <option :value="1">1st Semester</option>
            <option :value="2">2nd Semester</option>
            <option :value="3">Summer</option>
          </select>
        </div>
      </div>

      <!-- RIGHT: Action Buttons -->
      <div class="flex gap-1 flex-wrap">
        <!-- Schedule By Rooms -->
        <div
          @click="toggleRoomView"
          class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 hover:shadow-lg cursor-pointer transition duration-200"
        >
          <div
            class="p-1 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
          >
            <icon :name="'calendar1'" class="w-4 h-4" />
          </div>
          <span class="font-medium text-sm">Schedule by Rooms</span>
        </div>

        <!-- View Schedules -->
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

        <!-- Add Schedule -->
        <div
          @click="toggleAdd"
          class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:shadow-lg cursor-pointer transition duration-200"
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

    <!-- Filter Toolbar -->
    <div class="flex flex-wrap gap-2 mt-4">
      <button
        v-for="(label, key) in filterOptions"
        :key="key"
        @click="activeFilter = key"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium border transition duration-200',
          activeFilter === key
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
        ]"
      >
        {{ label }}
      </button>
    </div>
    <template v-if="!isRoomView">
      <!-- Instructor Cards -->
      <div class="shrink-layout border border-gray-200 rounded-xl p-4 bg-gray-50">
        <div class="w-full h-[115vh] overflow-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
            <!-- Instructor Cards -->
            <template v-if="Object.keys(groupedByInstructor).length > 0">
              <div
                v-for="(facultyLoads, instructorId) in filteredGroupedByInstructor"
                :key="instructorId"
                class="w-full border border-gray-300 shadow rounded-2xl bg-white p-2"
              >
                <!-- Instructor Info -->
                <div class="text-center mb-4">
                  <h2 class="text-lg font-bold text-gray-800">Teacher's Loads</h2>
                  <p class="text-sm text-gray-700">
                    {{ semesterName(facultyLoads) }} Semester/Term • SY
                    {{ schoolYears(facultyLoads) }}
                  </p>
                  <p class="text-sm font-medium text-gray-800 mt-1">
                    {{
                      `${facultyLoads[0].instructor.instructor_fname} ${
                        facultyLoads[0].instructor.instructor_mname || ""
                      } ${facultyLoads[0].instructor.instructor_lname}`
                        .replace(/\s+/g, " ")
                        .trim()
                    }}
                  </p>
                </div>

                <!-- Schedule Table -->
                <div class="rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                  <table class="min-w-full border-separate border-spacing-0 text-sm">
                    <thead
                      class="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 top-0 z-10"
                    >
                      <tr>
                        <th
                          class="text-left px-4 py-3 bg-gray-100 font-semibold text-sm border sticky left-0 z-20"
                        >
                          TIME
                        </th>
                        <th
                          v-for="day in days"
                          :key="day"
                          class="text-center px-4 py-2 border font-semibold text-sm"
                        >
                          {{ day }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="facultyLoads.length === 0">
                        <td colspan="8" class="text-center text-gray-500 py-8">
                          No schedule found.
                        </td>
                      </tr>

                      <!-- Grouped Sections -->
                      <template v-for="group in groupedTimeSlots" :key="group.label">
                        <tr>
                          <td
                            colspan="8"
                            class="bg-blue-50 text-gray-800 font-bold px-4 py-2"
                          >
                            {{ group.label }}
                          </td>
                        </tr>

                        <tr
                          v-for="time in group.slots"
                          :key="time.start"
                          class="hover:bg-gray-50 transition-all duration-150"
                        >
                          <!-- Time Range Column -->
                          <td
                            class="sticky left-0 z-10 bg-white w-32 text-sm text-gray-600 px-4 py-2 border whitespace-nowrap"
                          >
                            {{ to12Hr(time.start) }} - {{ to12Hr(time.end) }}
                          </td>

                          <!-- Schedule Cells -->
                          <template
                            v-for="grouped in groupSubjectsByDay(
                              days,
                              time.start,
                              facultyLoads
                            )"
                            :key="grouped.day + time.start"
                          >
                            <td
                              v-if="grouped.type === 'empty'"
                              class="border h-[40px] px-1 z-0"
                            ></td>
                            <td
                              v-else
                              :colspan="grouped.colspan"
                              class="relative border h-[40px] px-1 z-0"
                            >
                              <div
                                class="absolute left-1 right-1 top-[2px] w-auto text-[11px] font-medium rounded-md shadow-md border border-gray-300 px-2 py-[6px] overflow-hidden transition-all duration-300"
                                :style="{
                                  height: getSpanningRows(grouped.sched) * 40 - 4 + 'px',
                                  backgroundColor: getColor(grouped.day, time.start),
                                  zIndex: 10,
                                }"
                              >
                                <p
                                  class="text-[13px] font-semibold text-gray-800 leading-snug break-words"
                                >
                                  {{ grouped.sched.project?.project_section || "N/A" }}
                                  /
                                  {{ grouped.sched.course?.course_code || "N/A" }}
                                  / Room - (
                                  {{ grouped.sched.room?.room_name || "N/A" }}
                                  {{ grouped.sched.room?.room_number || "N/A" }} -
                                  {{ grouped.sched.room?.room_type || "N/A" }})
                                </p>
                              </div>
                            </td>
                          </template>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>

            <!-- No Schedules Message -->
            <div
              v-else
              class="col-span-full text-center text-gray-600 py-12 bg-white rounded-xl shadow border border-gray-300"
            >
              <p class="text-lg font-semibold">No schedules available.</p>
              <p class="text-sm text-gray-500">
                Please add a schedule or adjust your filters.
              </p>
            </div>
          </div>
        </div>
      </div></template
    >

    <!-- ROOM VIEW -->

    <!-- ROOM VIEW (Weekly Grid ) -->
    <template v-if="isRoomView">
      <div class="shrink-layout border border-gray-200 rounded-xl p-4 bg-gray-50">
        <div class="w-full h-[115vh] overflow-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
            <div
              v-for="(roomLoads, roomName) in filteredGroupedByRoom"
              :key="roomName"
              class="w-full border border-gray-300 shadow rounded-2xl bg-white p-2"
            >
              <!-- Room Header -->
              <div class="text-center mb-4">
                <h1 class="text-xl font-bold text-gray-800">Room: {{ roomName }}</h1>

                <!-- <p class="text-base text-gray-500">
                  {{ getUniqueProjectCount(roomLoads) }} schedule(s)
                </p> -->
              </div>

              <!-- WEEKLY GRID TABLE -->
              <div class="rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                <table class="min-w-full border-separate border-spacing-0 text-sm">
                  <!-- HEADER -->
                  <thead class="bg-gray-100 text-gray-700">
                    <tr>
                      <th
                        class="px-3 py-3 border sticky left-0 bg-gray-100 text-sm w-[15%]"
                      >
                        TIME
                      </th>
                      <th
                        v-for="day in days"
                        :key="day"
                        class="px-3 py-3 border text-center text-sm"
                      >
                        {{ day }}
                      </th>
                    </tr>
                  </thead>

                  <!-- BODY -->
                  <tbody>
                    <tr
                      v-for="time in timeSlots"
                      :key="time.start"
                      class="hover:bg-gray-50 text-center"
                    >
                      <!-- TIME COLUMN -->
                      <td
                        class="sticky left-0 bg-white border px-3 py-3 whitespace-nowrap text-sm text-gray-700"
                      >
                        {{ to12Hr(time.start) }} - {{ to12Hr(time.end) }}
                      </td>

                      <!-- DAYS -->
                      <template
                        v-for="grouped in groupSubjectsByDay(days, time.start, roomLoads)"
                        :key="grouped.day + time.start"
                      >
                        <td v-if="grouped.type === 'empty'" class="border h-[45px]"></td>

                        <td
                          v-else
                          :colspan="grouped.colspan"
                          class="relative border h-[45px] text-left"
                        >
                          <div
                            class="absolute left-1 right-1 top-[2px] text-sm font-medium rounded-md border px-2 py-[6px] overflow-hidden"
                            :style="{
                              height: getSpanningRows(grouped.sched) * 45 - 4 + 'px',
                              backgroundColor: getColor(grouped.day, time.start),
                            }"
                          >
                            <p
                              class="text-sm font-semibold text-gray-800 flex items-center gap-2"
                            >
                              {{ grouped.sched.course?.course_code }} /
                              {{ grouped.sched.project?.project_section }}

                              <!-- 🚨 Conflict Badge -->
                              <span
                                v-if="grouped.sched.hasConflict"
                                @click.stop="openConflictModal(grouped.sched, roomLoads)"
                                class="text-[10px] px-2 py-1 rounded-full bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600"
                              >
                                CONFLICT
                              </span>
                            </p>

                            <p class="text-xs text-gray-600">
                              {{ grouped.sched.instructor?.instructor_fname }}
                            </p>
                          </div>
                        </td>
                      </template>
                    </tr>
                  </tbody>
                </table>
                <!-- 🔥 CONFLICT MODAL -->
                <div
                  v-if="showConflictModal"
                  class="fixed inset-0 flex items-center justify-center z-50"
                >
                  <div
                    class="bg-white w-[600px] max-h-[80vh] overflow-auto rounded-2xl shadow-xl p-6"
                  >
                    <!-- Header -->
                    <div class="flex justify-between items-center mb-4">
                      <h2 class="text-lg font-bold text-red-600">
                        Schedule Conflict Detected
                      </h2>
                      <button
                        @click="showConflictModal = false"
                        class="text-gray-500 hover:text-gray-800"
                      >
                        ✕
                      </button>
                    </div>

                    <p class="text-sm text-gray-600 mb-4">
                      Room: <strong>{{ selectedRoom }}</strong>
                    </p>

                    <!-- Conflict List -->
                    <div class="space-y-3">
                      <div
                        v-for="(sched, index) in conflictSchedules"
                        :key="index"
                        class="border border-red-300 bg-red-50 rounded-lg p-3"
                      >
                        <p class="font-semibold text-gray-800">
                          {{ sched.course?.course_code }} /
                          {{ sched.project?.project_section }}
                        </p>

                        <p class="text-sm text-gray-600">
                          {{ sched.instructor?.instructor_fname }}
                        </p>

                        <p class="text-xs text-gray-500">
                          {{ getShortDay(sched.schedule_days) }} |
                          {{ to12Hr(sched.time_start) }} - {{ to12Hr(sched.time_end) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modals -->
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
</template>

<script>
import { useFetchDataStore } from "@/store/fetch-data-store";
import { mapState } from "pinia";
import icon from "@/assets/icon.vue";
import AddClassSchedules from "../modals/add-schedulers.vue";
import tableViewAll from "./table-view-all.vue";

export default {
  name: "ModernFacultySchedule",
  components: { AddClassSchedules, icon, tableViewAll },
  data() {
    return {
      alreadyRendered: {},
      isAdd: false,
      isViewAll: false,
      selectedSemester: 1,
      selectedSchoolYear: null, // ➕ for filtering by curriculum years
      semesterOptions: {
        1: "1st Sem",
        2: "2nd Sem",
        3: "Summer",
      },

      isRoomView: false,
      showConflictModal: false,
      conflictSchedules: [],
      selectedRoom: null,
      roomSearch: "",
      instructorSearch: "",
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["schedulers"]),
    filteredGroupedByInstructor() {
      const search = this.instructorSearch.toLowerCase().trim();

      if (!search) return this.groupedByInstructor;

      const result = {};

      for (const [id, loads] of Object.entries(this.groupedByInstructor)) {
        const instructor = loads[0]?.instructor;

        const fullName = `${instructor?.instructor_fname || ""} ${
          instructor?.instructor_mname || ""
        } ${instructor?.instructor_lname || ""}`
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim();

        const matchName = fullName.includes(search);

        const matchSchedule = loads.some((sched) => {
          return (
            sched.course?.course_code?.toLowerCase().includes(search) ||
            sched.project?.project_section?.toLowerCase().includes(search) ||
            sched.room?.room_name?.toLowerCase().includes(search)
          );
        });

        if (matchName || matchSchedule) {
          result[id] = loads;
        }
      }

      return result;
    },
    filteredGroupedByRoom() {
      const search = this.roomSearch.toLowerCase().trim();

      if (!search) return this.groupedByRoom;

      const result = {};

      for (const [roomName, roomLoads] of Object.entries(this.groupedByRoom)) {
        const fullRoom = `${roomName}`.toLowerCase().replace(/\s+/g, "");
        const matchRoomName = fullRoom.includes(search.replace(/\s+/g, ""));
        const matchSchedule = roomLoads.some((sched) => {
          return (
            sched.course?.course_code?.toLowerCase().includes(search) ||
            sched.project?.project_section?.toLowerCase().includes(search) ||
            sched.instructor?.instructor_fname?.toLowerCase().includes(search)
          );
        });

        if (matchRoomName || matchSchedule) {
          result[roomName] = roomLoads;
        }
      }

      return result;
    },
    schoolYearOptions() {
      const years = new Set();

      for (const sched of this.schedulers) {
        const curriculum = sched.course?.curriculum;
        if (curriculum) {
          const since = curriculum.curriculum_since?.toString().slice(0, 4);
          const effective = curriculum.curriculum_effective?.toString().slice(0, 4);
          if (since && effective) {
            years.add(`${since} - ${effective}`);
          }
        }
      }

      const yearArray = Array.from(years);
      // Sort descending by starting year
      yearArray.sort((a, b) => {
        const aYear = parseInt(a.split(" - ")[0]);
        const bYear = parseInt(b.split(" - ")[0]);
        return bYear - aYear;
      });

      return yearArray;
    },
    days() {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    },
    timeSlots() {
      const slots = [];
      let hour = 7,
        minute = 0;
      while (hour < 22 || (hour === 22 && minute === 0)) {
        const start = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        minute += 30;
        if (minute === 60) {
          hour += 1;
          minute = 0;
        }
        const end = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push({ start, end });
      }
      return slots;
    },
    groupedTimeSlots() {
      return [
        {
          label: "Morning",
          slots: this.timeSlots.filter((t) => this.to24Hr(t.start) < "12:00"),
        },
        {
          label: "Afternoon",
          slots: this.timeSlots.filter(
            (t) => this.to24Hr(t.start) >= "12:00" && this.to24Hr(t.start) < "17:00"
          ),
        },
        {
          label: "Evening",
          slots: this.timeSlots.filter((t) => this.to24Hr(t.start) >= "17:00"),
        },
      ];
    },
    groupedByInstructor() {
      const result = {};

      for (const sched of this.schedulers) {
        // ✅ Filter by selected semester
        //         if (this.selectedSemester && sched.course?.course_semester !== this.selectedSemester) {
        //     continue;
        // }

        if (
          this.selectedSemester !== null &&
          sched.course?.course_semester !== this.selectedSemester
        ) {
          continue;
        }

        // ✅ Filter by selected school year
        const curriculum = sched.course?.curriculum;
        const yearRange = curriculum
          ? `${curriculum.curriculum_since} - ${curriculum.curriculum_effective}`
          : null;

        if (this.selectedSchoolYear && yearRange !== this.selectedSchoolYear) {
          continue;
        }

        const id = sched?.instructor?.instructor_id;
        if (!id) continue;

        if (!result[id]) result[id] = [];
        result[id].push(sched);
      }

      return result;
    },
    groupedByRoom() {
      const result = {};

      for (const sched of this.schedulers) {
        if (
          this.selectedSemester !== null &&
          sched.course?.course_semester !== this.selectedSemester
        )
          continue;

        const curriculum = sched.course?.curriculum;
        const yearRange = curriculum
          ? `${curriculum.curriculum_since} - ${curriculum.curriculum_effective}`
          : null;

        if (this.selectedSchoolYear && yearRange !== this.selectedSchoolYear) {
          continue;
        }

        const roomName = sched?.room
          ? `${sched.room.room_name}-${sched.room.room_number}`
          : "No Room";

        if (!result[roomName]) result[roomName] = [];

        // default conflict flag
        sched.hasConflict = false;

        result[roomName].push(sched);
      }

      // 🔥 Detect conflicts per room AFTER grouping
      for (const roomName in result) {
        const list = result[roomName];

        for (let i = 0; i < list.length; i++) {
          for (let j = i + 1; j < list.length; j++) {
            const a = list[i];
            const b = list[j];

            // same day check
            const sameDay =
              this.getShortDay(a.schedule_days) === this.getShortDay(b.schedule_days);

            if (!sameDay) continue;

            const overlap = this.checkTimeOverlap(
              a.time_start,
              a.time_end,
              b.time_start,
              b.time_end
            );

            if (overlap) {
              a.hasConflict = true;
              b.hasConflict = true;
            }
          }
        }
      }

      return result;
    },
  },
  methods: {
    // getUniqueProjectCount(roomLoads) {
    //   if (!roomLoads || roomLoads.length === 0) return 0;

    //   const unique = new Set();

    //   roomLoads.forEach((sched) => {
    //     const projectId = sched?.project?.project_id;

    //     if (projectId) {
    //       unique.add(projectId);
    //     }
    //   });

    //   return unique.size;
    // },
    openConflictModal(clickedSched, roomLoads) {
      const conflicts = [];

      for (const sched of roomLoads) {
        if (sched === clickedSched) continue;

        const sameDay =
          this.getShortDay(sched.schedule_days) ===
          this.getShortDay(clickedSched.schedule_days);

        if (!sameDay) continue;

        const overlap = this.checkTimeOverlap(
          sched.time_start,
          sched.time_end,
          clickedSched.time_start,
          clickedSched.time_end
        );

        if (overlap) {
          conflicts.push(sched);
        }
      }

      // include the clicked schedule itself
      this.conflictSchedules = [clickedSched, ...conflicts];
      this.selectedRoom = clickedSched.room?.room_name;
      this.showConflictModal = true;
    },
    checkTimeOverlap(aStart, aEnd, bStart, bEnd) {
      const aS = this.toMinutes(this.normalizeTime(aStart));
      const aE = this.toMinutes(this.normalizeTime(aEnd));
      const bS = this.toMinutes(this.normalizeTime(bStart));
      const bE = this.toMinutes(this.normalizeTime(bEnd));

      return aS < bE && bS < aE; // overlap condition
    },
    toggleRoomView() {
      this.isRoomView = !this.isRoomView;
      this.isAdd = false;
      this.isViewAll = false;
    },
    loadSchedulers() {
      const store = useFetchDataStore();
      store.fetchSchedulers();
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
      this.isAdd = false;
      this.isDayView = true;
      this.isViewAll = !this.isViewAll;
    },

    toMinutes(timeStr) {
      const [hour, minute] = timeStr.split(":").map(Number);
      return hour * 60 + minute;
    },
    to12Hr(time24) {
      const [hourStr, minuteStr] = time24.split(":");
      let hour = parseInt(hourStr);
      const minute = minuteStr;
      const ampm = hour >= 12 ? "PM" : "AM";

      hour = hour % 12;
      if (hour === 0) hour = 12;

      return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
    },
    to24Hr(time12) {
      const [time, modifier] = time12.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    },
    getShortDay(dayFull) {
      return dayFull.slice(0, 3);
    },
    getSpanningRows(item) {
      if (!item || !item.time_start || !item.time_end) return 1;
      return Math.max(
        (this.toMinutes(item.time_end) - this.toMinutes(item.time_start)) / 30,
        1
      );
    },
    getColor(day, time) {
      const time24 = this.to24Hr(time);
      const timeMinutes = this.toMinutes(time24);
      const isInRange = timeMinutes >= 480 && timeMinutes < 1320;
      const weekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day);
      const weekend = ["Sat", "Sun"].includes(day);
      if (isInRange && weekday) return "#FFD63A";
      if (isInRange && weekend) return "#91C8E4";
      return "#F0F0F0";
    },
    normalizeTime(timeStr) {
      return timeStr.slice(0, 5); // turns "08:00:00" into "08:00"
    },
    getScheduleFromList(list, day, slotStart) {
      return list.find(
        (item) =>
          item?.schedule_days &&
          this.getShortDay(item.schedule_days) === day &&
          this.normalizeTime(item.time_start) === slotStart
      );
    },
    groupSubjectsByDay(dayList, time, facultyLoads) {
      const groups = [];
      let i = 0;

      while (i < dayList.length) {
        const day = dayList[i];
        const sched = this.getScheduleFromList(facultyLoads, day, time);

        // Show schedule only at its time_start match
        if (
          sched &&
          this.normalizeTime(sched.time_start) === time // only at exact start time
        ) {
          // Count how many days share this exact same schedule
          let colspan = 1;
          for (let j = i + 1; j < dayList.length; j++) {
            const nextDay = dayList[j];
            const nextSched = this.getScheduleFromList(facultyLoads, nextDay, time);

            const isSame =
              nextSched &&
              this.normalizeTime(nextSched.time_start) === time &&
              nextSched.time_start === sched.time_start &&
              nextSched.time_end === sched.time_end &&
              nextSched.course?.course_code === sched.course?.course_code &&
              nextSched.project?.project_section === sched.project?.project_section &&
              nextSched.room?.room_name === sched.room?.room_name &&
              nextSched.room?.room_number === sched.room?.room_number;

            if (isSame) {
              colspan++;
            } else {
              break;
            }
          }

          groups.push({ type: "subject", sched, colspan, day });
          i += colspan;
        } else {
          groups.push({ type: "empty", day });
          i++;
        }
      }

      return groups;
    },
    semesterName(list) {
      if (this.selectedSemester) {
        return this.selectedSemester === 1
          ? "First"
          : this.selectedSemester === 2
          ? "Second"
          : "Midyear";
      }

      const semester = list[0]?.course?.course_semester;
      return semester === 1
        ? "First"
        : semester === 2
        ? "Second"
        : semester === 3
        ? "Midyear"
        : "Unknown";
    },
    schoolYears(list) {
      const curriculum = list[0]?.course?.curriculum;
      return curriculum
        ? `${curriculum.curriculum_since} - ${curriculum.curriculum_effective}`
        : "Unknown";
    },
    downloadPDF() {
      // your download logic here (e.g., using pdfMake or html2pdf)
      console.log("Download not yet implemented.");
    },
  },
  async mounted() {
    const store = useFetchDataStore();
    store.fetchSchedulers().then(() => {
      this.loadSchedulers();

      // ✅ Set default school year here (no ESLint complaint)
      if (!this.selectedSchoolYear && this.schoolYearOptions.length > 0) {
        this.selectedSchoolYear = this.schoolYearOptions[0];
      }
    });
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.shrink-layout {
  @apply transform scale-[0.7] origin-top-left w-[143%] mx-auto;
  margin-left: auto;
  margin-right: auto;
}
</style>
