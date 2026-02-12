<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        v-if="
          !showConflictModal &&
          !showConflictLectureModal &&
          !showConflictLaboratoryModal
        "
        @submit.prevent="submitData"
        class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg"
        ref="schedulesForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'add-students'" />
            <h1 class="font-bold tracking-wide text-lg">Add Class Schedule</h1>
          </div>
          <icon
            :name="'circle-close3'"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>

        <div class="p-5 w-[32vw] text-left">
          <div class="w-full flex justify-end items-center gap-3 mb-2">
            <!-- Semester Select -->
            <div class="w-full">
              <select
                v-model="form.selectedSemester"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              >
                <option disabled value="">Select Semester</option>
                <option :value="1">1st Semester</option>
                <option :value="2">2nd Semester</option>
                <option :value="3">Summer</option>
              </select>
            </div>

            <!-- Program Select -->
            <div class="w-full">
              <select
                v-model="selectedProgram"
                id="program"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              >
                <option value="" disabled>Select a program</option>
                <option
                  v-for="program in uniquePrograms"
                  :key="program"
                  :value="program"
                >
                  {{ program }}
                </option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <!-- Instructor -->
            <div class="flex flex-col space-y-2 w-full relative">
              <label class="font-bold">Instructor :</label>
              <input
                v-model="searchInstructorQuery"
                type="text"
                placeholder="Search instructor..."
                class="px-3 py-3 border w-full border-gray-600 rounded-md text-md text-gray-800"
                @focus="showInstructorDropdown = true"
              />
              <div
                v-if="showInstructorDropdown && filteredInstructors.length"
                class="absolute top-[70px] w-full bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto z-10"
                @mouseleave="showInstructorDropdown = false"
              >
                <div
                  v-for="instructor in filteredInstructors"
                  :key="instructor.instructor_id"
                  class="px-3 py-3 hover:bg-gray-100 cursor-pointer"
                  @mousedown="selectInstructor(instructor)"
                >
                  {{ instructor.instructor_lname }},
                  {{ instructor.instructor_fname }}
                </div>
              </div>
            </div>

            <!-- Course -->
            <div class="flex flex-col space-y-2 w-full relative">
              <label class="font-bold">Course :</label>
              <input
                v-model="searchCourseQuery"
                type="text"
                placeholder="Search course..."
                class="px-3 py-3 border w-full border-gray-600 rounded-md text-md text-gray-800"
                @focus="showCourseDropdown = true"
              />
              <div
                v-if="showCourseDropdown && filteredCourses.length"
                class="absolute top-[70px] w-full bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto z-10"
                @mouseleave="showCourseDropdown = false"
              >
                <div
                  v-for="course in filteredCourses"
                  :key="course.course_id"
                  class="px-3 py-3 hover:bg-gray-100 cursor-pointer"
                  @click="selectCourse(course)"
                >
                  {{ course.course_code }} - {{ course.course_description }}
                </div>
              </div>
            </div>

            <!-- Room -->
            <div class="flex flex-col space-y-2 w-full relative">
              <label class="font-bold">Room :</label>
              <input
                v-model="searchRoomQuery"
                type="text"
                placeholder="Search room..."
                class="px-3 py-3 border w-full border-gray-600 rounded-md text-md text-gray-800"
                @focus="showRoomDropdown = true"
              />
              <div
                v-if="showRoomDropdown && filteredRooms.length"
                class="absolute top-[70px] w-full bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto z-10"
                @mouseleave="showRoomDropdown = false"
              >
                <div
                  v-for="room in filteredRooms"
                  :key="room.room_id"
                  class="px-3 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  @mousedown="selectRoom(room)"
                >
                  <div>{{ room.room_name }}{{ room.room_number }}</div>
                  -
                  <span
                    :class="[
                      'inline-block text-xs font-semibold px-3 py-1 rounded-full',
                      room.room_type === 'Laboratory'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800',
                    ]"
                  >
                    {{ room.room_type }}
                  </span>
                </div>
              </div>
              <!-- ✅ Show selected room type -->
              <p v-if="form.room_id" class="text-xs text-gray-600 mt-1">
                Room Type:
                {{
                  rooms.find((r) => r.room_id === form.room_id)?.room_type ||
                  "N/A"
                }}
              </p>
            </div>

            <!-- Project Section -->
            <div class="flex flex-col space-y-2 w-full relative">
              <label class="font-bold">Project Section :</label>
              <input
                v-model="searchProjectQuery"
                type="text"
                placeholder="Search project section..."
                class="px-3 py-3 border w-full border-gray-600 rounded-md text-md text-gray-800"
                @focus="showProjectDropdown = true"
              />

              <div
                v-if="showProjectDropdown"
                class="absolute top-[70px] w-full bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto z-10 shadow-md"
                role="listbox"
              >
                <div
                  v-for="(project, index) in filteredProjects"
                  :key="index"
                  :class="[
                    'p-2 text-sm rounded-md flex justify-between items-center',
                    project.assigned
                      ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                      : project.partiallyAssigned
                      ? 'text-yellow-700 bg-yellow-50 cursor-pointer'
                      : 'hover:bg-blue-100 cursor-pointer text-gray-800',
                  ]"
                  @click="!project.assigned && selectProject(project)"
                  :aria-disabled="project.assigned"
                  tabindex="0"
                >
                  <span>{{ project.project_section }}</span>

                  <span
                    v-if="project.partiallyAssigned"
                    class="text-yellow-600 text-xs font-semibold"
                  >
                    Partially Assigned to {{ project.assignedInstructorName }}
                  </span>

                  <span
                    v-else-if="project.assigned"
                    class="text-red-500 text-xs font-semibold"
                  >
                    Assigned
                  </span>
                </div>
              </div>
            </div>

            <!-- Days -->
            <div class="w-full space-y-2 text-left">
              <label class="font-bold">Days:</label>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="day in schedule_days"
                  :key="day"
                  @click="toggleDay(day)"
                  :class="[
                    'cursor-pointer px-4 py-2 rounded-full border transition-all duration-200 text-sm',
                    form.schedule_days.includes(day)
                      ? 'bg-green-600 text-white border-green01 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
                  ]"
                >
                  {{ day }}
                </div>
              </div>
            </div>

            <!-- Time -->
            <div class="w-full text-left gap-3 flex mt-2">
              <div class="w-full space-y-2">
                <label class="font-bold">Start Time:</label>
                <select
                  v-model="form.time_start"
                  required
                  class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
                >
                  <option value="" disabled>Select Time Start:</option>
                  <option
                    v-for="time in time"
                    :key="time.time_id"
                    :value="time.time"
                  >
                    {{ formatTime12Hour(time.time) }}
                  </option>
                </select>
              </div>
              <div class="w-full space-y-2">
                <label class="font-bold">End Time:</label>
                <select
                  v-model="form.time_end"
                  required
                  class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
                >
                  <option value="" disabled>Select Time End:</option>
                  <option
                    v-for="time in time"
                    :key="time.time_id"
                    :value="time.time"
                  >
                    {{ formatTime12Hour(time.time) }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

          <!-- Buttons -->
          <div class="tracking-wide flex justify-end gap-2 mt-4">
            <button
              class="bg-red-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              class="bg-green-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Conflict Modal -->
    <div
      v-if="showConflictModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-xs flex justify-center items-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 transition-all"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-red-100 p-2 rounded-full">
            <icon name="exclamationmark" class="text-red-600 w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-red-700">
            Schedule Conflict Detected
          </h2>
        </div>

        <!-- Conflict Reason -->
        <div
          v-if="conflictSchedule.reason"
          class="text-sm bg-red-50 border border-red-200 text-red-900 p-4 rounded-lg mb-4"
        >
          {{ conflictSchedule.reason }}
        </div>

        <!-- Conflict Details -->
        <ul v-if="conflictSchedule" class="text-sm text-gray-800 space-y-2">
          <li>
            <strong>Instructor:</strong>
            {{
              (conflictSchedule.instructor_fname ||
                conflictSchedule.instructor?.instructor_fname ||
                "") +
              " " +
              (conflictSchedule.instructor_lname ||
                conflictSchedule.instructor?.instructor_lname ||
                "")
            }}
          </li>
          <li>
            <strong>Course:</strong>
            {{
              conflictSchedule.course_code ||
              (conflictSchedule.course?.course_code
                ? conflictSchedule.course.course_code +
                  " - " +
                  conflictSchedule.course.course_description
                : "")
            }}
          </li>

          <li>
            <strong>Room:</strong>
            {{ conflictSchedule.room_name || conflictSchedule.room?.room_name }}
          </li>
          <li>
            <strong>Project Section:</strong>
            {{
              conflictSchedule.project_section ||
              conflictSchedule.project?.project_section
            }}
          </li>
          <li>
            <strong>Days:</strong>
            {{
              Array.isArray(conflictSchedule.schedule_days)
                ? conflictSchedule.schedule_days.join(", ")
                : typeof conflictSchedule.schedule_days === "string"
                ? conflictSchedule.schedule_days
                : "N/A"
            }}
          </li>
          <li>
            <strong>Time:</strong>
            {{ formatTime12Hour(conflictSchedule.time_start) }} –
            {{ formatTime12Hour(conflictSchedule.time_end) }}
          </li>
        </ul>

        <!-- Close Button -->
        <div class="flex justify-end mt-6">
          <button
            @click="showConflictModal = false"
            class="px-4 py-3 text-sm font-medium rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Lecture Limit Conflict Modal -->
    <div
      v-if="showConflictLectureModal && !showConflictModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-xs flex justify-center items-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 transition-all"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-red-100 p-2 rounded-full">
            <icon name="exclamationmark" class="text-red-600 w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-red-700">
            Lecture Hour Limit Reached
          </h2>
        </div>

        <!-- Message -->
        <div
          class="text-sm bg-red-50 border border-red-200 text-red-900 p-4 rounded-lg space-y-2"
        >
          <p>
            Instructor
            <strong>{{ lectureLimitDetails.instructor_name }}</strong>
            already has
            <strong>{{ lectureLimitDetails.currentMinutes }} mins</strong>
            assigned for
            <strong>{{ lectureLimitDetails.course_code }}</strong
            >.
          </p>
          <p>
            This schedule would add
            <strong>{{ lectureLimitDetails.addedMinutes }} mins</strong>,
            resulting in a total of
            <strong>{{ lectureLimitDetails.totalMinutes }} mins</strong>, which
            exceeds the <strong>180 mins (3-hour)</strong> weekly lecture limit.
          </p>
        </div>

        <!-- Action Button -->
        <div class="flex justify-end mt-6">
          <button
            @click="showConflictLectureModal = false"
            class="px-4 py-3 text-sm font-medium rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Laboratory Limit Conflict Modal -->
    <div
      v-if="
        showConflictLaboratoryModal &&
        !showConflictModal &&
        !showConflictLectureModal
      "
      class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-xs flex justify-center items-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 transition-all"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-red-100 p-2 rounded-full">
            <icon name="exclamationmark" class="text-red-600 w-6 h-6" />
          </div>
          <h2 class="text-lg font-semibold text-red-700">
            Laboratory Hour Limit Reached
          </h2>
        </div>

        <!-- Message -->
        <div
          class="text-sm bg-red-50 border border-red-200 text-red-900 p-4 rounded-lg space-y-2"
        >
          <p>
            Instructor
            <strong>{{ labLimitDetails.instructor_name }}</strong>
            already has
            <strong>{{ labLimitDetails.currentMinutes }} mins</strong>
            assigned for
            <strong>{{ labLimitDetails.course_code }}</strong
            >.
          </p>
          <p>
            This schedule would add
            <strong>{{ labLimitDetails.addedMinutes }} mins</strong>, resulting
            in a total of
            <strong>{{ labLimitDetails.totalMinutes }} mins</strong>, which
            exceeds the <strong>300 mins (5-hour)</strong> weekly laboratory
            limit.
          </p>
        </div>

        <!-- Action Button -->
        <div class="flex justify-end mt-6">
          <button
            @click="showConflictLaboratoryModal = false"
            class="px-4 py-3 text-sm font-medium rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
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
import { toast } from "vue3-toastify";
import { useFetchDataStore } from "@/store/fetch-data-store";
import { mapState, mapActions } from "pinia";
import axios from "axios";

export default {
  name: "AddClassSchedules",
  components: { icon },
  data() {
    return {
      schedule_days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      showConflictLectureModal: false,
      lectureLimitDetails: {
        instructor_name: "",
        course_code: "",
        currentMinutes: 0,
        addedMinutes: 0,
        totalMinutes: 0,
      },
      showConflictLaboratoryModal: false,
      labLimitDetails: {
        instructor_name: "",
        course_code: "",
        currentMinutes: 0,
        addedMinutes: 0,
        totalMinutes: 0,
      },

      form: {
        schedule_days: [],
        instructor_id: "",
        instructor_name: "",
        course_id: "",
        course_code: "",
        project_id: "",
        project_section: "",
        room_id: "",
        room_name: "",
        time_start: "",
        selectedSemester: "",
        time_end: "",
      },
      selectedProgram: "",
      conflictSchedule: null,
      showConflictModal: false,
      searchInstructorQuery: "",
      showInstructorDropdown: false,
      searchCourseQuery: "",
      showCourseDropdown: false,
      searchRoomQuery: "",
      showRoomDropdown: false,
      searchProjectQuery: "",
      showProjectDropdown: false,
    };
  },
  watch: {
    "form.selectedSemester"(val) {
      console.log("Selected semester:", val);
    },
  },
  computed: {
    ...mapState(useFetchDataStore, [
      "instructors",
      "courses",
      "rooms",
      "time",
      "projects",
      "schedulers",
    ]),
    assignedProjectIds() {
      return new Set(
        this.schedulers.map((s) => String(s.project_id)).filter(Boolean)
      );
    },
    filteredProjects() {
      const selectedCourse = this.courses.find(
        (c) => c.course_id === this.form.course_id
      );
      const selectedRoom = this.rooms.find(
        (r) => r.room_id === this.form.room_id
      );

      if (!selectedCourse) return [];

      const offerCode = selectedCourse.course_offer_code;
      const roomType = selectedRoom?.room_type || null;

      return (
        this.projects
          // 🔎 Filter projects by search + matching course offer code
          .filter((project) => {
            const matchesSearch = project.project_section
              .toLowerCase()
              .includes(this.searchProjectQuery.toLowerCase());
            const course = project.courses;
            return (
              matchesSearch && course && course.course_offer_code === offerCode
            );
          })
          .map((project) => {
            // ⏳ Get schedules already assigned for this project and roomType
            const assignedSchedules = this.schedulers.filter((sched) => {
              const isSameProject =
                String(sched.project?.project_id ?? sched.project_id) ===
                String(project.project_id);
              if (!isSameProject) return false;

              const schedRoom =
                sched.room ||
                this.rooms.find((r) => r.room_id === sched.room_id) ||
                {};
              return roomType && schedRoom.room_type === roomType;
            });

            // 👨‍🏫 Get schedules of the *current instructor* on this project
            const currentInstructorSchedules = assignedSchedules.filter(
              (sched) =>
                sched.instructor?.instructor_id === this.form.instructor_id ||
                sched.instructor_id === this.form.instructor_id
            );

            // 🔢 Calculate rendered minutes by current instructor
            let renderedMinutes = 0;
            currentInstructorSchedules.forEach((sched) => {
              const days = Array.isArray(sched.schedule_days)
                ? sched.schedule_days
                : String(sched.schedule_days)
                    .split(",")
                    .map((d) => d.trim());
              const [sh, sm] = sched.time_start.split(":").map(Number);
              const [eh, em] = sched.time_end.split(":").map(Number);
              const minutesPerDay = eh * 60 + em - (sh * 60 + sm);
              renderedMinutes += minutesPerDay * days.length;
            });

            // 📏 Determine required minutes with rules
            let requiredMinutes = 0;
            if (roomType === "Lecture") {
              // Special: 2 lec units = 3 hrs
              if (selectedCourse.course_lec === 2) {
                requiredMinutes = 180;
              } else {
                requiredMinutes = (selectedCourse.course_lec || 0) * 60;
              }
            } else if (roomType === "Laboratory") {
              // Lab: 1 unit = 2 hrs
              requiredMinutes = (selectedCourse.course_lab || 0) * 120;
            } else {
              // Combo case: if roomType is null or hybrid use total units
              if (
                selectedCourse.course_lec === 2 &&
                selectedCourse.course_lab === 1
              ) {
                requiredMinutes = 300; // 5 hrs (2 lec + 1 lab special)
              } else {
                requiredMinutes =
                  (selectedCourse.course_lec || 0) * 60 +
                  (selectedCourse.course_lab || 0) * 120;
              }
            }

            // 🏷️ Assignment state
            let assigned = assignedSchedules.length > 0;
            let partiallyAssigned = false;
            let assignedInstructorName = "";

            if (assigned) {
              if (
                renderedMinutes > 0 &&
                renderedMinutes < requiredMinutes &&
                currentInstructorSchedules.length > 0
              ) {
                // Current instructor partially assigned
                partiallyAssigned = true;
                assigned = false; // Allow selection for partial assignment
                const inst = currentInstructorSchedules[0].instructor;
                assignedInstructorName = inst
                  ? `${inst.instructor_fname} ${inst.instructor_lname}`
                  : "";
              } else {
                // Assigned fully to another instructor
                const otherInstructor = assignedSchedules.find(
                  (sched) =>
                    (sched.instructor?.instructor_id ?? sched.instructor_id) !==
                    this.form.instructor_id
                );
                if (otherInstructor) {
                  const inst = otherInstructor.instructor;
                  assignedInstructorName = inst
                    ? `${inst.instructor_fname} ${inst.instructor_lname}`
                    : "";
                }
              }
            }

            return {
              ...project,
              assigned,
              partiallyAssigned,
              assignedInstructorName,
            };
          })
      );
    },

    filteredInstructors() {
      return this.instructors.filter((i) =>
        `${i.instructor_lname} ${i.instructor_fname}`
          .toLowerCase()
          .includes(this.searchInstructorQuery.toLowerCase())
      );
    },
    uniquePrograms() {
      if (!this.form.selectedSemester || !this.courses.length) return [];

      const programs = this.courses
        .filter(
          (course) =>
            course.course_semester === Number(this.form.selectedSemester)
        )
        .map((course) => course.curriculum?.program?.program_name)
        .filter(Boolean);

      return [...new Set(programs)];
    },
    filteredCourses() {
      return this.courses.filter((course) => {
        const matchesSemester =
          course.course_semester === Number(this.form.selectedSemester);

        const matchesProgram =
          !this.selectedProgram ||
          course.curriculum?.program?.program_name === this.selectedProgram;

        // ✅ New condition: curriculum must be Active
        const isActive = course.curriculum?.curriculum_status === "Active";

        return matchesSemester && matchesProgram && isActive;
      });
    },

    filteredRooms() {
      const selectedCourse = this.courses.find(
        (c) => c.course_id === this.form.course_id
      );

      if (!selectedCourse) return [];

      let allowedRoomTypes = [];

      if (selectedCourse.course_lec > 0) allowedRoomTypes.push("Lecture");
      if (selectedCourse.course_lab > 0) allowedRoomTypes.push("Laboratory");

      return this.rooms.filter((room) => {
        const matchesSearch = room.room_name
          .toLowerCase()
          .includes(this.searchRoomQuery.toLowerCase());

        const matchesType = allowedRoomTypes.includes(room.room_type);

        return matchesSearch && matchesType;
      });
    },
    filteredPrograms() {
      const programsMap = new Map();

      this.courses
        .filter(
          (course) =>
            course.course_semester === Number(this.form.selectedSemester)
        )
        .forEach((course) => {
          const program = course.curriculum?.program;
          if (program) {
            programsMap.set(program.program_id, program);
          }
        });

      return Array.from(programsMap.values());
    },
  },
  methods: {
    ...mapActions(useFetchDataStore, [
      "fetchInstructors",
      "fetchCourses",
      "fetchRooms",
      "fetchTime",
      "fetchProjects",
      "fetchSchedulers",
    ]),
    selectInstructor(i) {
      this.form.instructor_id = i.instructor_id;
      this.searchInstructorQuery = `${i.instructor_lname}, ${i.instructor_fname}`;
      this.showInstructorDropdown = false;
    },
    selectCourse(c) {
      this.form.course_id = c.course_id;
      this.searchCourseQuery = c.course_code;
      this.showCourseDropdown = false;
    },
    selectRoom(r) {
      this.form.room_id = r.room_id;
      this.searchRoomQuery = r.room_name + (r.room_number || "");
      this.showRoomDropdown = false;
    },
    selectProject(p) {
      this.form.project_id = p.project_id;
      this.searchProjectQuery = p.project_section;
      this.showProjectDropdown = false;
    },
    toggleDay(day) {
      const idx = this.form.schedule_days.indexOf(day);
      idx === -1
        ? this.form.schedule_days.push(day)
        : this.form.schedule_days.splice(idx, 1);
    },
    formatTime12Hour(time) {
      if (!time) return "";
      const [h, m] = time.split(":");
      const ampm = +h >= 12 ? "PM" : "AM";
      const hour12 = +h % 12 || 12;
      return `${String(hour12).padStart(2, "0")}:${m} ${ampm}`;
    },
    isTimeOverlap(start1, end1, start2, end2) {
      return start1 < end2 && start2 < end1;
    },
    // 🔹 Convert units → minutes (handles special rules)
    getRequiredMinutes(course, roomType) {
      if (!course) return 0;

      // Special case: Summer semester
      if (Number(this.form.selectedSemester) === 3) {
        if (roomType === "Lecture" && course.course_lec === 2) {
          return 9 * 60; // 9 hours → 540 minutes
        }
        if (roomType === "Laboratory" && course.course_lab === 1) {
          return 6 * 60; // 6 hours → 360 minutes
        }
      }

      // Default rules for other semesters
      if (roomType === "Lecture") {
        if (course.course_lec === 2) {
          return 180; // 3 hours
        }
        return (course.course_lec || 0) * 60;
      }

      if (roomType === "Laboratory") {
        return (course.course_lab || 0) * 120; // 2 hours per lab unit
      }

      return 0;
    },

    async submitData() {
      const formEl = this.$refs.schedulesForm;
      if (!formEl.checkValidity()) {
        formEl.reportValidity();
        return;
      }

      if (this.form.schedule_days.length === 0)
        return toast.error("Select at least one day.");
      if (!this.form.time_start || !this.form.time_end)
        return toast.error("Select start and end time.");

      const startIdx = this.time.findIndex(
        (t) => t.time === this.form.time_start
      );
      const endIdx = this.time.findIndex((t) => t.time === this.form.time_end);
      if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx)
        return toast.error("Invalid start or end time.");

      const instructor = this.instructors.find(
        (i) => i.instructor_id === this.form.instructor_id
      );
      const course = this.courses.find(
        (c) => c.course_id === this.form.course_id
      );
      const room = this.rooms.find((r) => r.room_id === this.form.room_id);
      const project = this.projects.find(
        (p) => p.project_id === this.form.project_id
      );

      if (!room) return toast.error("Room not found.");

      this.form.instructor_name = instructor
        ? `${instructor.instructor_fname} ${instructor.instructor_lname}`
        : "";
      this.form.course_code = course?.course_code || "";
      this.form.room_name = room?.room_name || "";
      this.form.project_section = project?.project_section || "";

      try {
        const res = await axios.get(
          "http://localhost:8000/class-schedules/get-class-schedules"
        );
        const existing = res.data;

        // ----------------- RULE 1: Lecture Limit -----------------
        const instructorLectureCourseScheds = existing.filter((s) => {
          const isSameInstructor =
            s.instructor?.instructor_id === this.form.instructor_id ||
            s.instructor_id === this.form.instructor_id;
          const isSameCourse =
            s.course?.course_id === this.form.course_id ||
            s.course_id === this.form.course_id;
          const room =
            s.room || this.rooms.find((r) => r.room_id === s.room_id) || {};
          const isLecture = (room.room_type || "Lecture") === "Lecture";
          return isSameInstructor && isSameCourse && isLecture;
        });

        let totalMinutesForSameProject = instructorLectureCourseScheds
          .filter(
            (s) =>
              String(s.project?.project_id ?? s.project_id) ===
              String(this.form.project_id)
          )
          .reduce((sum, s) => {
            const days = Array.isArray(s.schedule_days)
              ? s.schedule_days
              : String(s.schedule_days)
                  .split(",")
                  .map((d) => d.trim());
            const [sh, sm] = s.time_start.split(":").map(Number);
            const [eh, em] = s.time_end.split(":").map(Number);
            return sum + (eh * 60 + em - (sh * 60 + sm)) * days.length;
          }, 0);

        const selectedRoom =
          this.rooms.find((r) => r.room_id === this.form.room_id) || {};
        const isNewLecture =
          (selectedRoom.room_type || "Lecture") === "Lecture";

        let newMins = 0;
        if (isNewLecture) {
          const [newSh, newSm] = this.form.time_start.split(":").map(Number);
          const [newEh, newEm] = this.form.time_end.split(":").map(Number);
          newMins = newEh * 60 + newEm - (newSh * 60 + newSm);
          totalMinutesForSameProject +=
            newMins * this.form.schedule_days.length;
        }

        const lecLimitMinutes = this.getRequiredMinutes(course, "Lecture");
        if (totalMinutesForSameProject > lecLimitMinutes) {
          this.lectureLimitDetails = {
            instructor_name: this.form.instructor_name,
            course_code: this.form.course_code,
            currentMinutes:
              totalMinutesForSameProject -
              newMins * this.form.schedule_days.length,
            addedMinutes: newMins * this.form.schedule_days.length,
            totalMinutes: totalMinutesForSameProject,
          };

          this.showConflictLectureModal = true;
          this.showConflictModal = false;
          return true;
        }

        // ----------------- RULE 2: Laboratory Limit -----------------
        const instructorLabCourseScheds = existing.filter((s) => {
          const isSameInstructor =
            s.instructor?.instructor_id === this.form.instructor_id ||
            s.instructor_id === this.form.instructor_id;
          const isSameCourse =
            s.course?.course_id === this.form.course_id ||
            s.course_id === this.form.course_id;
          const room =
            s.room || this.rooms.find((r) => r.room_id === s.room_id) || {};
          const isLab = (room.room_type || "Laboratory") === "Laboratory";
          return isSameInstructor && isSameCourse && isLab;
        });

        let totalMinutesForSameLabProject = instructorLabCourseScheds
          .filter(
            (s) =>
              String(s.project?.project_id ?? s.project_id) ===
              String(this.form.project_id)
          )
          .reduce((sum, s) => {
            const days = Array.isArray(s.schedule_days)
              ? s.schedule_days
              : String(s.schedule_days)
                  .split(",")
                  .map((d) => d.trim());
            const [sh, sm] = s.time_start.split(":").map(Number);
            const [eh, em] = s.time_end.split(":").map(Number);
            return sum + (eh * 60 + em - (sh * 60 + sm)) * days.length;
          }, 0);

        const isNewLab =
          (selectedRoom.room_type || "Laboratory") === "Laboratory";
        let newLabMins = 0;
        if (isNewLab) {
          const [newSh, newSm] = this.form.time_start.split(":").map(Number);
          const [newEh, newEm] = this.form.time_end.split(":").map(Number);
          newLabMins = newEh * 60 + newEm - (newSh * 60 + newSm);
          totalMinutesForSameLabProject +=
            newLabMins * this.form.schedule_days.length;
        }

        const labLimitMinutes = this.getRequiredMinutes(course, "Laboratory");
        if (totalMinutesForSameLabProject > labLimitMinutes) {
          this.labLimitDetails = {
            instructor_name: this.form.instructor_name,
            course_code: this.form.course_code,
            currentMinutes:
              totalMinutesForSameLabProject -
              newLabMins * this.form.schedule_days.length,
            addedMinutes: newLabMins * this.form.schedule_days.length,
            totalMinutes: totalMinutesForSameLabProject,
          };

          this.showConflictLectureModal = false;
          this.showConflictModal = false;
          this.showConflictLaboratoryModal = true;
          return true;
        }

        // CONFLICT DETECTION — same day, time, room, project (if Lecture)
        const conflict = existing.find((sched) => {
          const days = Array.isArray(sched.schedule_days)
            ? sched.schedule_days
            : String(sched.schedule_days)
                .split(",")
                .map((d) => d.trim());

          const overlap = days.some((d) => this.form.schedule_days.includes(d));

          const timeConflict = this.isTimeOverlap(
            this.form.time_start,
            this.form.time_end,
            sched.time_start,
            sched.time_end
          );

          // 🔎 Normalize IDs (handles nested or top-level + type differences)
          const formInstructorId = String(this.form.instructor_id ?? "");
          const formCourseId = String(this.form.course_id ?? "");
          const formProjectId = String(this.form.project_id ?? "");
          const formRoomId = String(this.form.room_id ?? "");

          const schedInstructorId = String(
            (sched.instructor && sched.instructor.instructor_id) ??
              sched.instructor_id ??
              ""
          );
          const schedCourseId = String(
            (sched.course && sched.course.course_id) ?? sched.course_id ?? ""
          );
          const schedProjectId = String(
            (sched.project && sched.project.project_id) ??
              sched.project_id ??
              ""
          );
          const schedRoomId = String(
            (sched.room && sched.room.room_id) ?? sched.room_id ?? ""
          );

          const instructorMatch = schedInstructorId === formInstructorId;
          const courseMatch = schedCourseId === formCourseId;
          const projectMatch = schedProjectId === formProjectId;
          const roomMatch = schedRoomId === formRoomId;

          if (!(overlap && timeConflict)) return false;

          // ✅ Rule 1: Room already used at same time by the SAME course
          if (roomMatch && courseMatch) {
            const conflictRoomName =
              (sched.room && sched.room.room_name) ||
              this.rooms.find((r) => String(r.room_id) === formRoomId)
                ?.room_name ||
              "Selected room";
            sched.reason = `Room "${conflictRoomName}" is already occupied for course "${this.form.course_code}" at the selected time. Please choose a different time or room.`;
            return true;
          }

          // ✅ Rule 2: Instructor double-booked for the SAME project (even if room differs)
          if (instructorMatch && projectMatch) {
            sched.reason =
              "Instructor has another class for this project at this time.";
            return true;
          }

          // ✅ Rule 3: Same project + same course + same day/time + same instructor
          if (instructorMatch && projectMatch && courseMatch) {
            sched.reason =
              "This project section is already scheduled for this instructor at this time.";
            return true;
          }

          // ✅ Rule 4: Same project + same course, but DIFFERENT instructor
          if (!instructorMatch && projectMatch && courseMatch) {
            sched.reason =
              "This project section is already assigned to another instructor at this time.";
            return true;
          }

          // ✅ Rule 5: Same instructor, DIFFERENT project/course/room at same day/time
          if (
            instructorMatch &&
            (!projectMatch || !courseMatch || !roomMatch)
          ) {
            sched.reason =
              "This instructor is already teaching another project, course, or in a different room at this time.";
            return true;
          }

          // ✅ Rule 6: Room conflict at same day/time for a DIFFERENT course/project
          if (roomMatch && (!courseMatch || !projectMatch)) {
            sched.reason =
              "Room is occupied at the selected time for a different course or project. Please choose a different time or room.";
            return true;
          }

          return false;
        });

        if (conflict) {
          conflict.schedule_days = Array.isArray(conflict.schedule_days)
            ? conflict.schedule_days
            : String(conflict.schedule_days)
                .split(",")
                .map((d) => d.trim());

          this.conflictSchedule = {
            ...conflict,
            instructor_fname:
              this.instructors.find(
                (c) => c.instructor_id === conflict.instructor_id
              )?.instructor_lname || conflict.instructor_id,
            course_code:
              this.courses.find((c) => c.course_id === conflict.course_id)
                ?.course_code || conflict.course_id,
            room_name:
              this.rooms.find((r) => r.room_id === conflict.room_id)
                ?.room_name || conflict.room_id,
            project_section:
              this.projects.find((p) => p.project_id === conflict.project_id)
                ?.project_section || conflict.project_id,
          };
          this.showConflictModal = true;
          return;
        }

        // ✅ Save if no conflicts and hour constraints are followed
        await axios.post(
          "http://localhost:8000/class-schedules/add-class-schedules",
          {
            instructor_id: this.form.instructor_id,
            course_id: this.form.course_id,
            room_id: this.form.room_id,
            schedule_days: this.form.schedule_days,
            project_id: this.form.project_id,
            time_start: this.form.time_start,
            time_end: this.form.time_end,
          }
        );

        new Audio(require("@/assets/add.mp3")).play();
        toast.success("Schedule saved!");
        existing.push({ ...this.form });

        this.$emit("refresh");
        this.$emit("close");

        this.form = {
          schedule_days: [],
          instructor_id: "",
          instructor_name: "",
          course_id: "",
          course_code: "",
          project_id: "",
          project_section: "",
          room_id: "",
          room_name: "",
          time_start: "",
          time_end: "",
        };
      } catch (err) {
        toast.error("Failed to save schedule.");
        console.error(err);
      }
    },
  },
  mounted() {
    this.fetchInstructors();
    this.fetchCourses();
    this.fetchRooms();
    this.fetchTime().then(() => {
      this.time.sort((a, b) => {
        const [ah, am] = a.time.split(":").map(Number);
        const [bh, bm] = b.time.split(":").map(Number);
        return ah * 60 + am - (bh * 60 + bm);
      });
    });
    this.fetchProjects();
    this.fetchSchedulers();
  },
};
</script>
