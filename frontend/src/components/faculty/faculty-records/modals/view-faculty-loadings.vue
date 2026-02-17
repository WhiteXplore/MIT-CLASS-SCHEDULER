<template>
  <div class="max-w-screen min-h-screen bg-gray-100 rounded-md">
    <div class="w-full h-auto justify-center items-center">
      <div class="bg-white w-full h-screen rounded-md">
        <div class="w-full h-auto">
          <!-- Semester Selection + Download Button -->
          <div class="flex justify-between mb-4 flex-wrap gap-2 items-center">
            <!-- Semester Buttons -->
            <div class="flex gap-2">
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
            </div>

            <!-- Download Button -->
            <router-link
              v-if="authenticatedEmployeeId"
              :to="{
                name: 'view-pdf-faculty-loadings',
                params: { id: authenticatedEmployeeId },
                query: { course_semester: selectedSemester },
              }"
              class="flex items-center gap-2 px-4 py-2 border text-blue-600 border-blue-600 rounded-xl hover:bg-blue-700 hover:text-white hover:shadow-lg cursor-pointer transition duration-200 w-auto"
            >
              <div
                class="p-1 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center"
              >
                <icon :name="'download'" class="w-4 h-4" />
              </div>
              <span class="font-medium text-sm">Show Download Previews</span>
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
              <p>
                {{ semesterName }} Semester/Term : School Year
                {{ schoolYears }}
              </p>
            </div>

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
                    <th class="px-4 py-2 border">Credet <br />(Units)</th>
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
                      {{ formatTime(load.time_end) }} | {{ load.room?.room_name
                      }}{{ load.room?.room_number }}
                    </td>
                  </tr>

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

              <div class="flex justify-between items-start w-full mt-8 px-10">
                <div
                  class="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-gray-500"
                >
                  <div>Total Preparation: 3</div>
                  <div>Overload Units: 3</div>
                  <div>Minor Subjects: 3</div>
                  <div>Major Subjects: 3</div>
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

            <div v-else class="text-center mt-20 text-gray-500 text-sm">
              No schedule data available for this instructor.
            </div>
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
import axios from "axios";

export default {
  name: "ViewFacultyLoads",
  components: { icon },
  data() {
    return {
      selectedSemester: 1,
      user: null,
      authenticatedEmployeeId: null,
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["schedulers"]),

    filteredFacultyLoads() {
      if (!this.authenticatedEmployeeId) return [];
      return this.schedulers.filter(
        (item) =>
          String(item.instructor?.employee_id) ===
            String(this.authenticatedEmployeeId) &&
          item.course?.course_semester === this.selectedSemester,
      );
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
      const instructor = this.filteredFacultyLoads[0]?.instructor;
      return instructor
        ? `${instructor.instructor_fname} ${instructor.instructor_mname} ${instructor.instructor_lname}`
        : this.user
        ? `${this.user.first_name} ${this.user.last_name}`
        : "Unknown Instructor";
    },

    semesterName() {
      return this.selectedSemester === 1
        ? "First"
        : this.selectedSemester === 2
        ? "Second"
        : "Unknown";
    },

    schoolYears() {
      const curriculum = this.filteredFacultyLoads[0]?.course?.curriculum;
      return curriculum
        ? `${curriculum.curriculum_since} - ${curriculum.curriculum_effective}`
        : "Unknown";
    },

    totalUnits() {
      return this.filteredFacultyLoads.reduce(
        (sum, item) => sum + (Number(item.course?.course_units) || 0),
        0,
      );
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
    async fetchUser() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/auth/me",
          {
            withCredentials: true,
          },
        );
        if (response.data) {
          this.user = response.data;
          this.authenticatedEmployeeId = response.data.employee_id;
        } else {
          this.$router.push("/");
        }
      } catch (error) {
        console.error("Fetch user error:", error);
        this.$router.push("/");
      }
    },
  },
  async mounted() {
    const store = useFetchDataStore();
    await store.fetchSchedulers();
    await this.fetchUser();
  },
};
</script>

<style scoped></style>
