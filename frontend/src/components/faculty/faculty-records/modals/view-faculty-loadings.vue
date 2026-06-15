<template>
  <div class="min-h-screen bg-white">
    <div class="bg-white space-y-4">
      <div class="hidden lg:block">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Faculty Teaching Load</h1>

            <p class="text-sm text-gray-500 mt-1">
              {{ selectedSemester === 1 ? "1st Semester" : "2nd Semester" }}
              •
              {{ selectedSchoolYear || "Select School Year" }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-9 gap-4">
          <!-- Wider Card -->
          <div
            class="col-span-3 relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-900 p-6 shadow-lg"
          >
            <!-- Background Decoration -->
            <div
              class="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10"
            ></div>
            <div
              class="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5"
            ></div>

            <div class="relative flex items-center justify-between">
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-[0.25em] text-blue-100"
                >
                  Teaching Load
                </p>

                <h2 class="mt-3 text-4xl font-black text-white">
                  {{ scheduleCount }}
                </h2>

                <p class="mt-1 text-sm text-blue-100">
                  Active Schedule{{ scheduleCount > 1 ? "s" : "" }}
                </p>
              </div>

              <div
                class="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-md border border-white/20"
              >
                <icon name="book" class="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          <!-- Subjects -->
          <div
            class="col-span-2 bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-start justify-between">
              <div>
                <p
                  class="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold"
                >
                  Subjects
                </p>

                <h2 class="text-4xl font-black text-gray-900 mt-3">
                  {{ uniqueSubjects }}
                </h2>

                <p class="text-sm text-gray-500 mt-1">Unique Subjects</p>
              </div>

              <div
                class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center"
              >
                <icon name="book-open" class="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <!-- Preparations -->
          <div
            class="col-span-2 bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-start justify-between">
              <div>
                <p
                  class="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold"
                >
                  Preparations
                </p>

                <h2 class="text-4xl font-black text-gray-900 mt-3">
                  {{ preparationCount }}
                </h2>

                <p class="text-sm text-gray-500 mt-1">Course Preparations</p>
              </div>

              <div
                class="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center"
              >
                <icon name="clipboard" class="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <!-- Units -->
          <div
            class="col-span-2 bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-start justify-between">
              <div>
                <p
                  class="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold"
                >
                  Units
                </p>

                <h2 class="text-4xl font-black text-gray-900 mt-3">
                  {{ totalUnits }}
                </h2>

                <p class="text-sm text-gray-500 mt-1">Total Teaching Units</p>
              </div>

              <div
                class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center"
              >
                <icon name="calculator" class="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- TOP ACTIONS -->
      <div class="hidden lg:flex lg:flex-row lg:justify-between gap-3">
        <!-- School Year -->
        <div class="relative" ref="schoolYearDropdownRef">
          <div class="flex items-center gap-2">
            <div class="relative" ref="semesterDropdownRef">
              <div
                class="relative flex items-center rounded-xl border border-gray-200 bg-white transition-all duration-200"
              >
                <!-- Icon -->
                <div class="absolute left-3 text-blue-800">
                  <icon name="calendar" />
                </div>

                <!-- Trigger -->
                <button
                  type="button"
                  @click="isSchoolYearOpen = !isSchoolYearOpen"
                  class="w-[12vw] rounded-xl bg-transparent py-3 pl-10 pr-10 text-left text-sm font-semibold text-gray-700"
                >
                  <span v-if="selectedSchoolYear">
                    {{ selectedSchoolYear }}
                  </span>

                  <span v-else class="text-gray-400"> Select School Year </span>
                </button>

                <!-- Arrow -->
                <button
                  type="button"
                  @click="isSchoolYearOpen = !isSchoolYearOpen"
                  class="absolute right-2 flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100"
                >
                  <svg
                    class="h-4 w-4 transition-transform duration-200"
                    :class="{ 'rotate-180': isSchoolYearOpen }"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              <!-- Dropdown -->
              <div
                v-if="isSchoolYearOpen"
                class="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
              >
                <div class="border-b border-gray-100 px-4 py-3">
                  <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    School Year Options
                  </p>
                </div>

                <div class="p-1.5">
                  <button
                    v-for="year in availableSchoolYears"
                    :key="year"
                    @click="
                      selectedSchoolYear = year;
                      isSchoolYearOpen = false;
                    "
                    class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-blue-50"
                    :class="
                      selectedSchoolYear === year
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700'
                    "
                  >
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold">
                        {{ year }}
                      </p>

                      <p class="text-xs text-gray-500">Curriculum Year</p>
                    </div>

                    <span
                      class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      :class="
                        selectedSchoolYear === year
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-500'
                      "
                    >
                      {{ selectedSchoolYear === year ? "Selected" : "Select" }}
                    </span>
                  </button>

                  <div
                    v-if="availableSchoolYears.length === 0"
                    class="px-4 py-6 text-center text-sm text-gray-400"
                  >
                    No school years found
                  </div>
                </div>
              </div>
            </div>

            <!-- Semester Switcher -->

            <div class="relative" ref="semesterDropdownRef">
              <div
                class="relative flex items-center rounded-xl border border-gray-200 bg-white transition-all duration-200"
              >
                <!-- Icon -->
                <div class="absolute left-3 text-blue-800">
                  <icon name="filter" />
                </div>

                <!-- Trigger -->
                <button
                  type="button"
                  @click="isSemesterOpen = !isSemesterOpen"
                  class="w-[12vw] rounded-xl bg-transparent py-3 pl-10 pr-10 text-left text-sm font-semibold text-gray-700"
                >
                  <span v-if="selectedSemester">
                    {{ getSemesterLabel(selectedSemester) }}
                  </span>

                  <span v-else class="text-gray-400"> Select Semester </span>
                </button>

                <!-- Arrow -->
                <button
                  type="button"
                  @click="isSemesterOpen = !isSemesterOpen"
                  class="absolute right-2 flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100"
                >
                  <svg
                    class="h-4 w-4 transition-transform duration-200"
                    :class="{ 'rotate-180': isSemesterOpen }"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              <!-- Dropdown -->
              <div
                v-if="isSemesterOpen"
                class="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
              >
                <div class="border-b border-gray-100 px-4 py-3">
                  <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Semester Options
                  </p>
                </div>

                <div class="p-1.5">
                  <button
                    v-for="semester in semesters"
                    :key="semester.value"
                    @click="
                      selectedSemester = semester.value;
                      isSemesterOpen = false;
                    "
                    class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-indigo-50"
                    :class="selectedSemester === semester.value ? 'bg-indigo-50' : ''"
                  >
                    <div>
                      <p class="text-sm font-semibold text-gray-800">
                        {{ semester.label }}
                      </p>

                      <p class="text-xs text-gray-500">Academic Term</p>
                    </div>

                    <span
                      class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      :class="
                        selectedSemester === semester.value
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-500'
                      "
                    >
                      {{ selectedSemester === semester.value ? "Selected" : "Select" }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Download Button -->
        <router-link
          v-if="authenticatedEmployeeId"
          :to="{
            name: 'view-pdf-faculty-loadings',
            params: { id: authenticatedEmployeeId },
            query: { course_semester: selectedSemester },
          }"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition-all duration-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
        >
          <icon name="download2" class="text-blue-800" />

          <div>
            <p class="text-sm font-semibold leading-tight">Faculty Load PDF</p>
          </div>
        </router-link>
      </div>

      <!-- ========================= -->
      <!-- DESKTOP DESIGN -->
      <!-- ========================= -->
      <div class="hidden lg:block border-t border-gray-200 mt-4">
        <!-- Day Filter Pills -->
        <div class="w-full flex justify-center py-2">
          <div
            class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1"
          >
            <button
              @click="selectedDay = 'ALL'"
              class="px-3 py-2 rounded-lg text-sm font-semibold transition-all"
              :class="
                selectedDay === 'ALL'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              "
            >
              All
            </button>

            <button
              v-for="day in days"
              :key="day"
              @click="selectedDay = day"
              class="px-3 py-2 rounded-lg text-sm font-semibold transition-all"
              :class="
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              "
            >
              {{ day.substring(0, 3) }}
            </button>
          </div>
        </div>
        <!-- NO DATA -->
        <div
          v-if="filteredFacultyLoads.length === 0"
          class="text-center py-16 text-gray-500"
        >
          No faculty load found for the selected semester.
        </div>

        <!-- FACULTY LOAD CARDS -->
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
        >
          <div
            v-for="load in groupedFacultyLoads"
            :key="load.schedule_id"
            class="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <!-- HEADER -->
            <div
              class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 text-white"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold">
                    {{ load.course?.course_code }}
                  </h3>

                  <p class="text-blue-100 text-sm">
                    {{ load.project?.project_section }}
                  </p>
                </div>

                <div class="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                  {{ load.schedule_days }}
                </div>
              </div>
            </div>

            <!-- BODY -->
            <div class="p-4">
              <!-- DESCRIPTION -->
              <div class="mb-4">
                <p class="text-xs uppercase text-gray-400 mb-1">Course Description</p>

                <p class="text-gray-700 font-medium">
                  {{ load.course?.course_description }}
                </p>
                <div
                  class="flex flex-wrap gap-5 text-gray-500 text-sm md:text-xs mb-1 mt-1"
                >
                  <div class="flex items-center gap-1">
                    <icon name="time" class="text-gray-600" />

                    <span>
                      {{ formatTime(load.time_start) }}
                      -
                      {{ formatTime(load.time_end) }}
                    </span>
                  </div>

                  <div class="flex items-center gap-1">
                    <icon name="location" class="w-4 h-4" />

                    <span>
                      {{ load.room?.room_name }}
                      {{ load.room?.room_number }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- QUICK STATS -->
              <!-- <div class="grid grid-cols-3 gap-3 mb-4">
              <div class="bg-gray-50 rounded-2xl p-3 text-center">
                <p class="text-gray-400 text-xs">Lec</p>

                <p class="font-bold text-lg">
                  {{ load.course?.course_lec }}
                </p>
              </div>

              <div class="bg-gray-50 rounded-2xl p-3 text-center">
                <p class="text-gray-400 text-xs">Lab</p>

                <p class="font-bold text-lg">
                  {{ load.course?.course_lab }}
                </p>
              </div>

              <div class="bg-blue-50 rounded-2xl p-3 text-center">
                <p class="text-blue-400 text-xs">Units</p>

                <p class="font-bold text-lg text-blue-700">
                  {{ load.course?.course_lec + load.course?.course_lab }}
                </p>
              </div>
            </div> -->

              <!-- FOOTER DETAILS -->
              <div class="border-t pt-3 flex justify-between text-xs text-gray-500">
                <div>
                  <span class="font-medium"> Requisite: </span>

                  {{ load.course?.course_requisite || "None" }}
                </div>

                <div>
                  {{ load.course?.curriculum?.curriculum_since }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- MOBILE DESIGN -->
    <div class="lg:hidden h-screen pb-[25%] overflow-y-auto">
      <!-- DASHBOARD CARDS -->
      <div class="space-y-3 mb-4">
        <!-- Main Summary Card -->

        <div
          class="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-900 text-white"
        >
          <!-- Background Decoration -->
          <div
            class="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-white/10"
          ></div>
          <div
            class="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/5"
          ></div>

          <div class="relative flex items-center justify-between">
            <div class="min-w-0">
              <p
                class="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70 font-semibold"
              >
                Teaching Load
              </p>

              <h2 class="mt-1 text-4xl sm:text-5xl font-black text-white leading-none">
                {{ scheduleCount }}
              </h2>

              <p class="mt-1 text-xs sm:text-sm text-white/80">
                Active Schedule{{ scheduleCount > 1 ? "s" : "" }}
              </p>
            </div>

            <div
              class="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shrink-0"
            >
              <icon name="book1" class="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-3">
          <!-- Subjects -->
          <div class="bg-white rounded-xl p-2 border border-gray-100">
            <div class="flex items-center justify-between">
              <span
                class="text-[10px] uppercase tracking-wider text-gray-400 font-semibold"
              >
                Subjects
              </span>

              <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5A4.5 4.5 0 003 9.5v8.25A2.25 2.25 0 005.25 20H12m0-13c1.168-.776 2.754-1.253 4.5-1.253A4.5 4.5 0 0121 9.5v8.25A2.25 2.25 0 0118.75 20H12"
                  />
                </svg>
              </div>
            </div>

            <div class="text-2xl font-black text-gray-900 mt-3">
              {{ uniqueSubjects }}
            </div>
          </div>

          <!-- Preparation -->
          <div class="bg-white rounded-xl p-2 border border-gray-100">
            <div class="flex items-center justify-between">
              <span
                class="text-[10px] uppercase tracking-wider text-gray-400 font-semibold"
              >
                Prep
              </span>

              <div
                class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 3h6a1 1 0 011 1v2H8V4a1 1 0 011-1z"
                  />
                </svg>
              </div>
            </div>

            <div class="text-2xl font-black text-gray-900 mt-3">
              {{ preparationCount }}
            </div>
          </div>

          <!-- Units -->
          <div class="bg-white rounded-xl p-2 border border-gray-100">
            <div class="flex items-center justify-between">
              <span
                class="text-[10px] uppercase tracking-wider text-gray-400 font-semibold"
              >
                Units
              </span>

              <div
                class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 7h6m-6 4h6m-7 8h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div class="text-2xl font-black text-gray-900 mt-3">
              {{ totalUnits }}
            </div>
          </div>
        </div>
      </div>

      <!-- MOBILE FILTER CARD -->
      <div class="bg-white rounded-xl border border-gray-100 p-4 mb-2">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-700 text-sm">Academic Filters</h3>
          <icon name="filter" class="w-4 h-4 text-gray-400" />
        </div>

        <div class="space-y-5">
          <!-- School Year -->
          <div class="relative" ref="schoolYearDropdownRef">
            <label class="block text-xs font-medium text-gray-500 mb-2">
              School Year
            </label>

            <!-- Trigger -->
            <div
              class="relative flex items-center rounded-xl border border-gray-200 bg-white transition-all duration-200"
            >
              <div class="absolute left-3 text-blue-500">
                <icon name="calendar" />
              </div>

              <button
                type="button"
                @click="isSchoolYearOpen = !isSchoolYearOpen"
                class="w-full rounded-xl bg-transparent py-3 pl-10 pr-10 text-left text-sm font-semibold text-gray-700"
              >
                <span v-if="selectedSchoolYear">
                  {{ selectedSchoolYear }}
                </span>

                <span v-else class="text-gray-400"> Select School Year </span>
              </button>

              <button
                type="button"
                @click="isSchoolYearOpen = !isSchoolYearOpen"
                class="absolute right-2 flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100"
              >
                <svg
                  class="h-4 w-4 transition-transform duration-200"
                  :class="{ 'rotate-180': isSchoolYearOpen }"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <!-- Dropdown -->
            <div
              v-if="isSchoolYearOpen"
              class="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
            >
              <div class="border-b border-gray-100 px-4 py-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  School Year Options
                </p>
              </div>

              <div class="max-h-60 overflow-y-auto p-1.5">
                <button
                  v-for="year in availableSchoolYears"
                  :key="year"
                  @click="
                    selectedSchoolYear = year;
                    isSchoolYearOpen = false;
                  "
                  class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-blue-50"
                  :class="selectedSchoolYear === year ? 'bg-blue-50' : ''"
                >
                  <div>
                    <p class="text-sm font-semibold text-gray-800">
                      {{ year }}
                    </p>
                    <p class="text-xs text-gray-500">Curriculum Year</p>
                  </div>

                  <span
                    class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    :class="
                      selectedSchoolYear === year
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-500'
                    "
                  >
                    {{ selectedSchoolYear === year ? "Selected" : "Select" }}
                  </span>
                </button>

                <div
                  v-if="availableSchoolYears.length === 0"
                  class="px-4 py-6 text-center text-sm text-gray-400"
                >
                  No school years found
                </div>
              </div>
            </div>
          </div>

          <!-- Semester -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-2"> Semester </label>

            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="semester in availableSemesters"
                :key="semester.value"
                @click="selectedSemester = semester.value"
                class="rounded-xl py-3 text-sm font-medium transition-all duration-200"
                :class="
                  selectedSemester === semester.value
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                "
              >
                {{ semester.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- DAY FILTER -->
      <div class="mb-1 border-t">
        <div class="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          <button
            @click="selectedDay = 'ALL'"
            :class="[
              selectedDay === 'ALL'
                ? 'bg-blue-900 text-white'
                : 'bg-white text-gray-600 border',
              'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap',
            ]"
          >
            All
          </button>

          <button
            v-for="day in days"
            :key="day"
            @click="selectedDay = day"
            :class="[
              selectedDay === day
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border',
              'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap',
            ]"
          >
            {{ day }}
          </button>
        </div>
      </div>
      <!-- NO DATA -->
      <div
        v-if="!selectedSchoolYear"
        class="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center"
      >
        <h3 class="font-semibold text-gray-700">Select a School Year</h3>

        <p class="text-sm text-gray-500 mt-1">
          Please select a school year to view your faculty load.
        </p>
      </div>

      <div
        v-else-if="filteredFacultyLoads.length === 0"
        class="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center"
      >
        <h3 class="font-semibold text-gray-700">No Schedule Available</h3>

        <p class="text-sm text-gray-500 mt-1">
          No faculty load found for the selected semester.
        </p>
      </div>
      <!-- COURSE CARDS -->
      <div
        v-else
        v-for="load in groupedFacultyLoads"
        :key="`${load.schedule_id}-${load.schedule_days}`"
        class="bg-white shadow-sm border border-gray-100 mb-4 rounded-xl overflow-hidden"
      >
        <!-- TOP HEADER -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 text-white">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-sm leading-none">
                {{ load.course?.course_code }}
              </h3>

              <p class="text-blue-100 text-xs mt-1">
                {{ load.project?.project_section }}
              </p>
            </div>

            <div class="bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span class="text-xs font-semibold">
                {{ load.schedule_days }}
              </span>
            </div>
          </div>
        </div>

        <!-- MAIN CONTENT -->
        <div class="p-4">
          <!-- DESCRIPTION -->
          <div class="mb-4">
            <p class="text-xs uppercase text-gray-400 mb-1">Course Description</p>

            <p class="text-gray-700 font-medium">
              {{ load.course?.course_description }}
            </p>
            <div
              class="flex flex-wrap gap-5 text-gray-500 text-sm md:text-base mb-1 mt-1"
            >
              <div class="flex items-center gap-1">
                <icon name="time" class="text-gray-600" />

                <span>
                  {{ formatTime(load.time_start) }}
                  -
                  {{ formatTime(load.time_end) }}
                </span>
              </div>

              <div class="flex items-center gap-1">
                <icon name="location" class="w-4 h-4" />

                <span>
                  {{ load.room?.room_name }}
                  {{ load.room?.room_number }}
                </span>
              </div>
            </div>
          </div>

          <!-- QUICK STATS -->
          <!-- <div class="grid grid-cols-3 gap-3 mb-4">
              <div class="bg-gray-50 rounded-2xl p-3 text-center">
                <p class="text-gray-400 text-xs">Lec</p>

                <p class="font-bold text-lg">
                  {{ load.course?.course_lec }}
                </p>
              </div>

              <div class="bg-gray-50 rounded-2xl p-3 text-center">
                <p class="text-gray-400 text-xs">Lab</p>

                <p class="font-bold text-lg">
                  {{ load.course?.course_lab }}
                </p>
              </div>

              <div class="bg-blue-50 rounded-2xl p-3 text-center">
                <p class="text-blue-400 text-xs">Units</p>

                <p class="font-bold text-lg text-blue-700">
                  {{ load.course?.course_lec + load.course?.course_lab }}
                </p>
              </div>
            </div> -->

          <!-- FOOTER DETAILS -->
          <div class="border-t pt-3 flex justify-between text-xs text-gray-500">
            <div>
              <span class="font-medium"> Requisite: </span>

              {{ load.course?.course_requisite || "None" }}
            </div>

            <div>
              {{ load.course?.curriculum?.curriculum_since }}
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
      user: null,
      authenticatedEmployeeId: null,
      selectedSemester: null,
      selectedSchoolYear: null,
      selectedDay: "ALL",
      isSchoolYearOpen: false,

      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      isSemesterOpen: false,

      semesters: [
        { value: 1, label: "First Semester" },
        { value: 2, label: "Second Semester" },
        { value: 3, label: "Summer" },
      ],
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["schedulers"]),
    availableSemesters() {
      const semesterMap = new Map([
        [1, "1st Sem"],
        [2, "2nd Sem"],
        [3, "Summer"], // always included
      ]);

      this.schedulers.forEach((item) => {
        const sem = Number(item.course?.course_semester);

        if (sem && !semesterMap.has(sem)) {
          semesterMap.set(sem, `${sem}th Sem`);
        }
      });

      return [...semesterMap.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([value, label]) => ({
          value,
          label,
        }));
    },
    availableSchoolYears() {
      const years = new Set();

      this.schedulers.forEach((item) => {
        const curriculum = item.course?.curriculum;

        if (curriculum) {
          years.add(
            `${curriculum.curriculum_since} - ${curriculum.curriculum_effective}`
          );
        }
      });

      return [...years];
    },
    filteredFacultyLoads() {
      // Don't show any records until a school year is selected
      if (!this.selectedSchoolYear) {
        return [];
      }

      return this.schedulers.filter((item) => {
        const schoolYear = `${item.course?.curriculum?.curriculum_since} - ${item.course?.curriculum?.curriculum_effective}`;

        const sameInstructor =
          String(item.instructor?.employee_id) === String(this.authenticatedEmployeeId);

        return (
          sameInstructor &&
          schoolYear === this.selectedSchoolYear &&
          item.course?.course_semester === this.selectedSemester
        );
      });
    },
    groupedFacultyLoads() {
      let expanded = [];

      this.filteredFacultyLoads.forEach((item) => {
        const days = (item.schedule_days || "").split(",").map((d) => d.trim());

        days.forEach((day) => {
          expanded.push({
            ...item,
            schedule_days: day,
          });
        });
      });

      if (this.selectedDay !== "ALL") {
        expanded = expanded.filter(
          (item) => item.schedule_days.toLowerCase() === this.selectedDay.toLowerCase()
        );
      }

      const dayOrder = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7,
      };

      expanded.sort((a, b) => {
        const dayCompare = dayOrder[a.schedule_days] - dayOrder[b.schedule_days];

        // If same day, sort by start time
        if (dayCompare === 0) {
          return a.time_start.localeCompare(b.time_start);
        }

        return dayCompare;
      });

      return expanded;
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

    // UNIQUE SUBJECTS
    uniqueSubjects() {
      const unique = new Set();

      this.filteredFacultyLoads.forEach((item) => {
        unique.add(item.course?.course_id);
      });

      return unique.size;
    },

    // PREPARATIONS
    preparationCount() {
      const unique = new Set();

      this.filteredFacultyLoads.forEach((item) => {
        unique.add(item.course?.course_id);
      });

      return unique.size;
    },

    // TOTAL SCHEDULES
    scheduleCount() {
      return this.filteredFacultyLoads.length;
    },

    // TOTAL UNITS
    totalUnits() {
      const countedProjects = new Set();
      let total = 0;

      this.filteredFacultyLoads.forEach((item) => {
        const projectId = item.project?.project_id;

        if (!countedProjects.has(projectId)) {
          countedProjects.add(projectId);

          total +=
            Number(item.course?.course_lec || 0) + Number(item.course?.course_lab || 0);
        }
      });

      return total;
    },
  },
  methods: {
    getSemesterLabel(value) {
      const semester = this.semesters.find((item) => item.value === value);

      return semester ? semester.label : "Select Semester";
    },
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
        const response = await axios.get(process.env.VUE_APP_API_BASE_URL + "/auth/me", {
          withCredentials: true,
        });
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
