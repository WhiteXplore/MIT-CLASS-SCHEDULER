<template>
  <div class="max-w-screen min-h-screen bg-gray-100 rounded-md">
    <!-- Main Content -->
    <div class="w-full h-auto justify-center items-center">
      <div class="bg-white w-full h-screen rounded-md p-4">
        <div class="w-full h-auto">
          <!-- Semester Selection + Download Button -->
          <div class="flex justify-between mb-4 flex-wrap gap-2 items-center">
            <!-- Semester Buttons -->
            <div class="flex gap-2">
              <!-- Curriculum Dropdown -->
              <select
                v-model="selectedCurriculum"
                class="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select Term</option>
                <option
                  v-for="curr in availableCurriculums"
                  :key="curr.curriculum_id"
                 :value="`${curr.curriculum_since}-${curr.curriculum_effective}`"
                >
                  {{ curr.curriculum_since }} - {{ curr.curriculum_effective }}
                </option>
              </select>
              <button
                @click="selectSemester(1)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition',
                  selectedSemester === 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white',
                ]"
              >
                First Semester
              </button>
              <button
                @click="selectSemester(2)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition',
                  selectedSemester === 2
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-600 border border-green-600 hover:bg-green-600 hover:text-white',
                ]"
              >
                Second Semester
              </button>
              <button
                @click="selectSemester(3)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition',
                  selectedSemester === 3
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-orange-600 border border-orange-600 hover:bg-orange-600 hover:text-white',
                ]"
              >
                Summer
              </button>
            </div>

            <!-- Download Button -->
            <router-link
  :to="{
    name: 'view-pdf-faculty-loads',
    params: { id: instructorId },
    query: {
      course_semester: selectedSemester,
      curriculum_year: selectedCurriculum, // ✅ renamed
    },
  }"
  class="flex items-center gap-2 px-4 py-2 border text-blue-600 border-blue-600 rounded-xl hover:bg-blue-700 hover:text-white hover:shadow-lg cursor-pointer transition duration-200 w-auto"
>
  <div
    class="p-1 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center"
  >
    <icon :name="'download'" class="w-4 h-4" />
  </div>
  <span class="font-medium text-sm">Show Download Preview</span>
</router-link>
          </div>

          <!-- Header -->
          <div
            class="flex flex-col items-center text-center border-b pb-4 mb-4"
          >
            <img
              src="@/assets/img/st-logo.png"
              alt="School Logo"
              class="w-20 h-20 object-contain mb-2"
            />
            <h1
              class="text-2xl font-extrabold text-gray-800 uppercase tracking-wide"
            >
              St. John Paul II College of Davao
            </h1>
            <p class="text-sm text-gray-600 mt-1">
              Ecoland Dr, Matina, Davao City, 8000 Davao del Sur
            </p>
          </div>

          <!-- Content -->
          <div class="w-full h-[75vh] overflow-y-auto">
            <div class="text-center mt-5">
              <h1 class="font-bold text-lg">TEACHER'S LOAD</h1>

              <!-- Message if no curriculum is selected -->
              <p v-if="!selectedCurriculum" class="text-gray-500 text-sm">
                Please select a school year/curriculum to view schedule.
              </p>

              <!-- Semester name & year when curriculum is selected -->
              <p v-else>
                {{ semesterName }} Semester/Term : School Year {{ schoolYears }}
              </p>
            </div>

            <!-- Show only if a curriculum is selected -->
            <template v-if="selectedCurriculum">
              <!-- Table or Message -->
              <div v-if="filteredFacultyLoads.length > 0">
                <table
                  class="min-w-full table-auto border border-gray-300 shadow-sm rounded-md overflow-hidden text-sm mt-5"
                >
                  <thead
                    class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold"
                  >
                    <tr>
                      <th class="px-4 py-3 border">Offer Code</th>
                      <th class="px-4 py-2 border">Code</th>
                      <th class="px-4 py-2 border">Description</th>
                      <th class="px-4 py-2 border">Lec</th>
                      <th class="px-4 py-2 border">Lab</th>
                      <th class="px-4 py-2 border">Credit <br />(Units)</th>
                      <th class="px-4 py-2 border">Requisition</th>
                      <th class="px-4 py-2 border">Schedule</th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-800">
                    <tr
                      class="hover:bg-gray-50"
                      v-for="load in groupedFacultyLoads"
                      :key="load.schedule_id"
                    >
                      <td class="px-4 py-3 border text-center">
                        {{ load.course?.course_offer_code }}
                      </td>
                      <td class="px-4 py-2 border">
                        {{ load.course?.course_code }}
                      </td>
                      <td class="px-4 py-2 border">
                        {{ load.course?.course_description }}
                      </td>
                      <td class="px-4 py-2 border text-center">
                        {{ load.course?.course_lec }}
                      </td>
                      <td class="px-4 py-2 border text-center">
                        {{ load.course?.course_lab }}
                      </td>
                      <td class="px-4 py-2 border text-center">
                        {{ load.course?.course_lec + load.course?.course_lab }}
                      </td>
                      <td class="px-4 py-2 border text-center">
                        {{ load.course?.course_requisite }}
                      </td>
                      <td class="px-4 py-2 border text-center">
                        {{ load.schedule_days }} |
                        {{ formatTime(load.time_start) }} -
                        {{ formatTime(load.time_end) }} |
                        {{ load.room?.room_name }}{{ load.room?.room_number }}
                      </td>
                    </tr>

                    <!-- Total Row -->
                    <tr class="font-semibold bg-gray-100 text-center">
                      <td colspan="5" class="px-4 py-2 border text-right">
                        TOTAL UNITS
                      </td>
                      <td class="px-4 py-2 border">{{ totalUnits }}</td>
                      <td class="px-4 py-2 border"></td>
                      <td class="px-4 py-2 border"></td>
                    </tr>
                  </tbody>
                </table>

                <!-- Footer -->
                <div class="flex justify-between items-start w-full mt-8 px-10">
                  <div
                    class="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-gray-500"
                  >
                    <div>Total Preparation: {{ totalPreparation }}</div>
                      <div>Total Units: {{ totalUnits }}</div>
                    <div>Overload Units: 0</div>
                    <!-- <div>Minor Subjects: 3</div>
                    <div>Major Subjects: 3</div> -->
                  </div>
                  <div class="text-center text-sm">
                    <p class="underline font-bold">{{ instructorName }}</p>
                    <p>Instructor</p>
                  </div>
                </div>

                <div class="mt-10 text-right px-10">
                  <p class="text-sm text-gray-500">Generated by: Admin</p>
                  <p class="text-sm text-gray-500">
                    Date: {{ new Date().toLocaleDateString() }}
                  </p>
                </div>
              </div>

              <!-- No Data Message -->
              <div v-else class="text-center mt-20 text-gray-500 text-sm">
                No schedule data available for this instructor.
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import { useFetchDataStore } from "@/store/fetch-data-store";
import { mapState } from "pinia";

export default {
  name: "ViewFacultyLoads",
  components: { icon },
  data() {
    return {
      selectedSemester: 1, // Default selected semester
      selectedCurriculum: "", // New curriculum filter
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["schedulers"]),

    instructorId() {
      return this.$route.params.id;
    },totalPreparation() {
  const set = new Set();

  this.filteredFacultyLoads.forEach((item) => {
    const code = item.course?.course_code;
    if (code) set.add(code);
  });

  return set.size;
},
  availableCurriculums() {
  const map = new Map();

  this.schedulers.forEach((item) => {
    const curr = item.course?.curriculum;

    if (curr?.curriculum_since && curr?.curriculum_effective) {
      const key = `${curr.curriculum_since}-${curr.curriculum_effective}`; // ✅ group by year

      if (!map.has(key)) {
        map.set(key, curr);
      }
    }
  });

  return Array.from(map.values());
},
filteredFacultyLoads() {
  if (!this.selectedCurriculum) return [];

  return this.schedulers.filter((item) => {
    const matchesInstructor =
      String(item.instructor?.instructor_id) === String(this.instructorId);

    const matchesSemester =
      item.course?.course_semester === this.selectedSemester;

    const matchesCurriculum = (() => {
      const curr = item.course?.curriculum;
      if (!curr) return false;

      const key = `${curr.curriculum_since}-${curr.curriculum_effective}`;
      return key === this.selectedCurriculum;
    })();

    return matchesInstructor && matchesSemester && matchesCurriculum;
  });
},
    groupedFacultyLoads() {
      const grouped = {};
      for (const item of this.filteredFacultyLoads) {
        const key = `${item.course?.course_id}_${item.time_start}_${item.time_end}_${item.room?.room_id}`;
        if (!grouped[key]) {
          grouped[key] = { ...item, schedule_days: item.schedule_days || "" };
        } else {
          const existingDays = grouped[key].schedule_days.split(", ");
          const newDays = item.schedule_days?.split(", ") || [];
          const merged = Array.from(new Set([...existingDays, ...newDays]));
          grouped[key].schedule_days = merged.join(", ");
        }
      }
      return Object.values(grouped);
    },

    instructorName() {
      const first = this.filteredFacultyLoads[0]?.instructor;
      return first
        ? `${first.instructor_fname} ${first.instructor_mname} ${first.instructor_lname}`
        : "Unknown Instructor";
    },

    semesterName() {
      if (this.selectedSemester === 1) return "First";
      if (this.selectedSemester === 2) return "Second";
      if (this.selectedSemester === 3) return "Midyear";
      return "Unknown";
    },

    schoolYears() {
      const curriculum = this.filteredFacultyLoads[0]?.course?.curriculum;
      if (!curriculum) return "Unknown";
      return `${curriculum.curriculum_since} - ${curriculum.curriculum_effective}`;
    },

    totalUnits() {
      return this.filteredFacultyLoads.reduce((sum, item) => {
        const lec = Number(item.course?.course_lec) || 0;
        const lab = Number(item.course?.course_lab) || 0;
        return lec + lab;
      }, 0);
    },
  },
  methods: {
    selectSemester(sem) {
      this.selectedSemester = sem;
    },
    formatTime(time) {
      if (!time || !time.includes(":")) return "";
      const [hour, minute] = time.split(":");
      const h = parseInt(hour);
      const ampm = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      return `${hour12}:${minute} ${ampm}`;
    },
  },
  async mounted() {
    const store = useFetchDataStore();
    await store.fetchSchedulers();
  },
};
</script>

<style scoped></style>
