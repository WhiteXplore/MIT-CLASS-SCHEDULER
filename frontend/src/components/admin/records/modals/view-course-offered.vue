<template>
  <div class="max-w-screen min-h-screen bg-gray-100 rounded-md">
    <div class="w-full h-auto justify-center items-center p-2">
      <div class="bg-white w-full h-screen rounded-md">
        <div class="w-full h-auto p-5">
          <!-- Header -->
          <div class="w-full flex justify-center items-start gap-4">
            <img src="@/assets/img/st-logo.png" alt="Logo" class="w-24" />
            <div class="flex flex-col text-center">
              <h1 class="uppercase text-xl font-bold">
                St. John Paul II College of Davao
              </h1>
              <p class="text-sm">2978755 / 297 / 2033</p>
              <p>
                Graduates Attributes: Inquisitive, Ingenious, Innovative, and
                Inspiring
              </p>
              <p class="font-bold">{{ programName }}</p>
              <p class="font-bold">{{ programMajor }}</p>
              <p v-if="filteredCourses.length" class="text-md">
                {{ filteredCourses[0].curriculum?.curriculum_consortium }}
              </p>
              <p v-if="filteredCourses.length" class="text-md">
                Curriculum Checklist Year:
                {{ filteredCourses[0].curriculum?.curriculum_since }} -
                {{ filteredCourses[0].curriculum?.curriculum_effective }}
              </p>
            </div>
          </div>

          <!-- Content -->
          <div
            v-if="groupedFacultyLoadsArray.length"
            class="bg-white rounded-lg p-6 space-y-6 overflow-x-auto h-[85vh] border shadow mt-4"
          >
            <!-- Course Group -->
            <div
              v-for="(group, index) in groupedFacultyLoadsArray"
              :key="index"
              class="text-[14px]"
            >
              <h3 class="text-md font-semibold text-gray-800 mb-2 px-4">
                {{ formatYearLevel(group.level) }} -
                {{ formatSemester(group.semester) }}
              </h3>

              <table
                class="min-w-full table-fixed text-sm text-gray-700 border-collapse"
              >
                <thead class="text-gray-700 sticky top-0 z-10 bg-white">
                  <tr>
                    <th class="w-[10%] px-4 py-2 text-left font-bold">Code</th>
                    <th class="w-[25%] px-4 py-2 text-left font-bold">
                      Description
                    </th>
                    <th class="w-[10%] px-4 py-2 text-center font-bold">
                      Semester
                    </th>
                    <th class="w-[10%] px-4 py-2 text-center font-bold">
                      Level
                    </th>
                    <th class="w-[10%] px-4 py-2 text-center font-bold">
                      Lec<br />Hours
                    </th>
                    <th class="w-[10%] px-4 py-2 text-center font-bold">
                      Lab<br />Hours
                    </th>
                    <th class="w-[10%] px-4 py-2 text-center font-bold">
                      Credit<br />Units
                    </th>
                    <th class="w-[15%] px-4 py-2 text-left font-bold">
                      Requisite
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="course in group.items"
                    :key="course.course_id"
                    class="bg-white hover:bg-green-50"
                  >
                    <td class="px-4 py-2">{{ course.course_code }}</td>
                    <td class="px-4 py-2">{{ course.course_description }}</td>
                    <td class="px-4 py-2 text-center">
                      {{ course.course_semester }}
                    </td>
                    <td class="px-4 py-2 text-center">
                      {{ course.course_level }}
                    </td>
                    <td class="px-4 py-2 text-center">
                      {{ course.course_lec }}
                    </td>
                    <td class="px-4 py-2 text-center">
                      {{ course.course_lab }}
                    </td>
                    <td class="px-4 py-2 text-center">
                      {{
                        /internship/i.test(course.course_description)
                          ? 6
                          : Number(course.course_lec) +
                            Number(course.course_lab)
                      }}
                    </td>

                    <td class="px-4 py-2">{{ course.course_requisite }}</td>
                  </tr>

                  <!-- TOTAL CREDIT UNITS ROW -->
                  <tr class="bg-gray-100 border-t font-bold text-gray-800">
                    <td colspan="6" class="px-4 py-2 text-right">
                      Total Credit Units:
                    </td>
                    <td class="px-4 py-2 text-center">
                      {{
                        group.items.reduce((sum, course) => {
                          return (
                            sum +
                            (/internship/i.test(course.course_description)
                              ? 6
                              : Number(course.course_lec) +
                                Number(course.course_lab))
                          );
                        }, 0)
                      }}
                    </td>

                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useFetchDataStore } from "@/store/fetch-data-store";
import { mapState } from "pinia";

export default {
  name: "ViewFacultyLoads",
  computed: {
    ...mapState(useFetchDataStore, ["courses"]),

    curriculumId() {
      return this.$route.params.id;
    },

    filteredCourses() {
      return this.courses.filter(
        (item) => String(item.curriculum_id) === String(this.curriculumId)
      );
    },

    groupedFacultyLoadsArray() {
      const grouped = {};
      const levelMap = {
        1: "First Year",
        2: "2nd",
        3: "3rd",
        4: "4th",
      };
      const semesterMap = {
        1: "First Semester",
        2: "2nd",
      };

      this.filteredCourses.forEach((item) => {
        const level = levelMap[item.course_level] || "Unknown";
        const semester = semesterMap[item.course_semester] || "Unknown";
        const key = `${level}-${semester}`;

        if (!grouped[key]) {
          grouped[key] = {
            level: item.course_level,
            semester: item.course_semester,
            items: [],
          };
        }

        grouped[key].items.push(item);
      });

      return Object.values(grouped);
    },

    programName() {
      if (!this.filteredCourses.length) return "No Program Found";
      return (
        this.filteredCourses[0].curriculum?.program?.program_name || "Unknown"
      );
    },
    programMajor() {
      if (!this.filteredCourses.length) return "";
      return this.filteredCourses[0].curriculum?.program?.program_major || "";
    },
    selectedProgram() {
      return (
        this.programName + (this.programMajor ? ` - ${this.programMajor}` : "")
      );
    },
  },
  methods: {
    formatYearLevel(level) {
      const map = {
        1: "1st Year",
        2: "2nd Year",
        3: "3rd Year",
        4: "4th Year",
      };
      return map[level] || "Unknown Level";
    },
    formatSemester(sem) {
      const map = {
        1: "1st Sem",
        2: "2nd Sem",
      };
      return map[sem] || "Unknown Semester";
    },
  },
  async mounted() {
    const store = useFetchDataStore();
    await store.fetchCourses();
  },
};
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
