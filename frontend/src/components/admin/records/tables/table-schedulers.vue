<template>
  <div class="min-h-screen">
    <div class="flex gap-3 w-full justify-between items-center">
      <!-- Semester Filter Buttons -->
      <!-- Modern Filter Controls -->
      <div class="flex flex-wrap items-center gap-4">
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

      <div class="flex gap-1">
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

    <!-- Instructor Cards -->
    <div class="shrink-layout border border-gray-200 rounded-xl p-4 bg-gray-50">
      <div class="w-full h-[115vh] overflow-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <!-- Instructor Cards -->
          <template v-if="Object.keys(groupedByInstructor).length > 0">
            <div
              v-for="(facultyLoads, instructorId) in groupedByInstructor"
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
              <div
                class="rounded-xl border border-gray-200 shadow-sm overflow-x-auto"
              >
                <table
                  class="min-w-full border-separate border-spacing-0 text-sm"
                >
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
                    <template
                      v-for="group in groupedTimeSlots"
                      :key="group.label"
                    >
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
                          class="sticky left-0 z-10 bg-white w-32 text-xs text-gray-600 px-4 py-2 border whitespace-nowrap"
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
                                height:
                                  getSpanningRows(grouped.sched) * 40 -
                                  4 +
                                  'px',
                                backgroundColor: getColor(
                                  grouped.day,
                                  time.start
                                ),
                                zIndex: 10,
                              }"
                            >
                              <p
                                class="text-[11px] font-semibold text-gray-800 leading-snug break-words"
                              >
                                {{
                                  grouped.sched.project?.project_section ||
                                  "N/A"
                                }}
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
    </div>

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
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["schedulers"]),
    schoolYearOptions() {
      const years = new Set();

      for (const sched of this.schedulers) {
        const curriculum = sched.course?.curriculum;
        if (curriculum) {
          const since = curriculum.curriculum_since?.toString().slice(0, 4);
          const effective = curriculum.curriculum_effective
            ?.toString()
            .slice(0, 4);
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
            (t) =>
              this.to24Hr(t.start) >= "12:00" && this.to24Hr(t.start) < "17:00"
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
  },
  methods: {
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
            const nextSched = this.getScheduleFromList(
              facultyLoads,
              nextDay,
              time
            );

            const isSame =
              nextSched &&
              this.normalizeTime(nextSched.time_start) === time &&
              nextSched.time_start === sched.time_start &&
              nextSched.time_end === sched.time_end &&
              nextSched.course?.course_code === sched.course?.course_code &&
              nextSched.project?.project_section ===
                sched.project?.project_section &&
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
