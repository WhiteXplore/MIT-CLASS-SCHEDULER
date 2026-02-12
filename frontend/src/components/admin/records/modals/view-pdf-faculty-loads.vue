<template>
  <div class="min-h-screen bg-gray-50 p-2">
    <!-- Download Button -->
    <div class="flex justify-end p-2 print:hidden">
      <button
        @click="downloadPDF"
        class="flex items-center gap-2 px-4 py-2 border text-blue-600 border-blue-600 rounded-xl hover:bg-blue-700 hover:text-white hover:shadow-lg transition duration-200"
      >
        <div
          class="p-1 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center"
        >
          <icon :name="'download'" class="w-4 h-4" />
        </div>
        <span class="font-medium text-sm">Download</span>
      </button>
    </div>

    <!-- Content Area -->
    <div class="w-full h-[85vh] overflow-y-auto">
      <div
        ref="pdfContent"
        class="max-w-full mx-auto bg-white shadow-xl rounded-2xl p-8 px-20"
      >
        <!-- Header -->
        <div class="flex flex-col items-center text-center border-b pb-4 mb-4">
          <img
            src="@/assets/img/st-logo.png"
            alt="School Logo"
            class="w-20 h-20 object-contain mb-2"
          />
          <h1 class="text-2xl font-extrabold text-gray-800 uppercase">
            St. John Paul II College of Davao
          </h1>
          <p class="text-sm text-gray-600">
            Ecoland Dr, Matina, Davao City, 8000 Davao del Sur
          </p>
        </div>

        <!-- Instructor Info -->
        <div class="text-center mb-4">
          <h2 class="text-lg font-bold text-gray-800">Teacher's Load</h2>
          <p class="text-sm text-gray-700">
            {{ semesterName }} Semester/Term • School Year {{ schoolYears }}
          </p>
          <p class="text-sm font-medium text-gray-800 mt-1">
            {{ instructorName }}
          </p>
        </div>

        <!-- Schedule Table -->
        <div
          class="mt-4 rounded-xl border border-gray-200 shadow-sm overflow-x-auto"
        >
          <table class="min-w-full border-collapse text-sm">
            <thead
              class="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
            >
              <tr>
                <th
                  colspan="2"
                  class="text-center px-4 py-3 border-r border-gray-300 bg-gray-100 font-semibold text-sm sticky left-0 z-20"
                >
                  Time
                </th>
                <th
                  v-for="day in days"
                  :key="day"
                  class="text-center px-4 py-2 border-b border-gray-300 font-semibold text-sm"
                >
                  {{ day }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-if="filteredFacultyLoads.length">
                <template v-for="group in groupedTimeSlots" :key="group.label">
                  <tr
                    v-for="(slot, rowIndex) in group.slots"
                    :key="slot.start"
                    class="hover:bg-gray-50"
                  >
                    <!-- Grouped Label -->
                    <template v-if="rowIndex === 0">
                      <td
                        :rowspan="group.slots.length"
                        class="text-center w-[100px] font-semibold text-xs px-2 py-2 bg-white border sticky left-0 z-10"
                      >
                        {{ group.label }}
                      </td>
                    </template>

                    <!-- Time Slot Label -->
                    <td
                      class="text-center text-xs text-gray-600 px-4 py-2 border sticky bg-white z-10 w-40"
                    >
                      {{ slot.label }}
                    </td>

                    <!-- Schedule Cells -->
                    <template
                      v-for="grouped in groupSubjectsByDay(
                        days,
                        slot.start,
                        filteredFacultyLoads
                      )"
                      :key="grouped.day + slot.start"
                    >
                      <td
                        v-if="grouped.type === 'empty'"
                        class="border border-gray-200 h-[40px] px-1"
                      ></td>
                      <td
                        v-else
                        :colspan="grouped.colspan"
                        class="relative border border-gray-200 h-[40px] px-1"
                      >
                        <div
                          class="absolute inset-x-1 top-[2px] text-[11px] font-medium rounded-md shadow-md border border-gray-300 px-2 py-[6px] overflow-hidden transition-all duration-300"
                          :style="{
                            height:
                              getSpanningRows(grouped.sched) * 40 - 4 + 'px',
                            backgroundColor: getColor(grouped.day, slot.start),
                            zIndex: 10,
                          }"
                        >
                          <p class="font-semibold text-gray-800 leading-snug">
                            {{
                              grouped.sched.project?.project_section || "N/A"
                            }}
                            /
                            {{ grouped.sched.course?.course_code || "N/A" }}
                          </p>
                          <p class="text-[10px] text-gray-700 truncate">
                            Room:
                            <span class="font-bold">
                              {{ grouped.sched.room?.room_name || "" }}
                              {{ grouped.sched.room?.room_number || "" }}
                            </span>
                            - {{ grouped.sched.room?.room_type || "" }}
                          </p>
                          <p class="text-[10px] italic text-gray-600 truncate">
                            {{ grouped.sched.course?.course_description || "" }}
                          </p>
                        </div>
                      </td>
                    </template>
                  </tr>
                </template>
              </template>
              <tr v-else>
                <td colspan="9" class="text-center text-gray-500 py-6">
                  No schedules found for this instructor and semester.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer Signature -->
        <div class="flex justify-end w-full mt-8 px-12">
          <div class="text-center text-sm">
            <p class="underline font-bold">{{ instructorName }}</p>
            <p>Instructor</p>
          </div>
        </div>

        <!-- Generated Info -->
        <div class="mt-6 text-sm text-gray-500 text-right">
          <p>Generated by: Admin</p>
          <p>Date: {{ new Date().toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useFetchDataStore } from "@/store/fetch-data-store";
import { mapState } from "pinia";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import icon from "@/assets/icon.vue";

pdfMake.vfs = pdfFonts.vfs;

export default {
  name: "ModernFacultySchedule",
  components: { icon },
  data() {
    return {
      selectedSemester: 1,
      selectedCurriculum: "",
      spanCache: {}, // ✅ renamed from _spanCache
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["schedulers"]),
    semesterName() {
      const s = this.filteredFacultyLoads[0]?.course?.course_semester;
      return s === 1
        ? "First"
        : s === 2
        ? "Second"
        : s === 3
        ? "Midyear"
        : "Unknown";
    },
    schoolYears() {
      const c = this.filteredFacultyLoads[0]?.course?.curriculum;
      return c
        ? `${c.curriculum_since} - ${c.curriculum_effective}`
        : "Unknown";
    },
    instructorName() {
      const i = this.filteredFacultyLoads[0]?.instructor;
      if (!i) return "Unknown";
      return `${i.instructor_fname} ${i.instructor_mname || ""} ${
        i.instructor_lname
      }`
        .replace(/\s+/g, " ")
        .trim();
    },
    instructorId() {
      return this.$route.params.id;
    },
    filteredFacultyLoads() {
      return this.schedulers.filter((i) => {
        const matchesInstructor =
          i?.instructor?.instructor_id?.toString() ===
          this.instructorId.toString();
        const matchesSemester =
          i?.course?.course_semester === this.selectedSemester;
        const matchesCurriculum =
          !this.selectedCurriculum ||
          String(i.course?.curriculum_id) === String(this.selectedCurriculum);

        return matchesInstructor && matchesSemester && matchesCurriculum;
      });
    },

    days() {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    },
    timeSlots() {
      const slots = [];
      for (let h = 7; h < 22; h++) {
        for (let m of [0, 30]) {
          const start = `${String(h).padStart(2, "0")}:${String(m).padStart(
            2,
            "0"
          )}`;
          let endHour = h;
          let endMin = m + 30;
          if (endMin === 60) {
            endHour += 1;
            endMin = 0;
          }
          const end = `${String(endHour).padStart(2, "0")}:${String(
            endMin
          ).padStart(2, "0")}`;
          const label = `${this.to12Hr(start)} - ${this.to12Hr(end)}`;
          slots.push({ start, end, label });
        }
      }
      return slots;
    },
    groupedTimeSlots() {
      return [
        {
          label: "Morning",
          slots: this.timeSlots.filter((t) => this.to24Hr(t.label) < "12:00"),
        },
        {
          label: "Afternoon",
          slots: this.timeSlots.filter(
            (t) =>
              this.to24Hr(t.label) >= "12:00" && this.to24Hr(t.label) < "17:00"
          ),
        },
        {
          label: "Evening",
          slots: this.timeSlots.filter((t) => this.to24Hr(t.label) >= "17:00"),
        },
      ];
    },
  },
  methods: {
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
    async downloadPDF() {
      // your existing implementation
    },
  },
  async mounted() {
    const store = useFetchDataStore();
    await store.fetchSchedulers();

    const sem = parseInt(this.$route.query.course_semester);
    if (!isNaN(sem)) this.selectedSemester = sem;

    const curriculum = this.$route.query.curriculum_id;
    if (curriculum) this.selectedCurriculum = curriculum; // store in data()
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
</style>
