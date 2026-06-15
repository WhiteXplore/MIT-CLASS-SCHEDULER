// src/stores/fetch-data-store.js
import { defineStore } from "pinia";
import axios from "axios";

export const useFetchDataStore = defineStore("fetchData", {
  state: () => ({
    instructors: [],
    courses: [],
    curriculums: [],
    programs: [],
    sections: [],
    rooms: [],
    time: [],
    projects: [],
    schedulers: [],
    bachelors: [],
    masters: [],
    doctorates: [],
    detailedAll: [],
    detailedInstructor: [],
    detailedPrograms: [],
    detailedCourses: [],
    detailedSections: [],
    semesterSettings: [],
    loading: false,
    error: null,
    user_accounts: [],
  }),

  actions: {
        async fetchUserAccounts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/user/get-all-users",
        ); // Update with your NestJS base URL
        this.user_accounts = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch user accounts";
      } finally {
        this.loading = false;
      }
    },
    async fetchInstructors() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/instructors/get-instructors",
        ); // Update with your NestJS base URL
        this.instructors = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch instructors";
      } finally {
        this.loading = false;
      }
    },

    async fetchCourses() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/courses/get-courses",
        ); // Update with your NestJS base URL
        this.courses = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch courses";
      } finally {
        this.loading = false;
      }
    },

    async fetchCurriculums() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/curriculums/get-curriculums",
        ); // Update with your NestJS base URL
        this.curriculums = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch curriculums";
      } finally {
        this.loading = false;
      }
    },

    async fetchPrograms() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/programs/get-programs",
        ); // Update with your NestJS base URL
        this.programs = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch programs";
      } finally {
        this.loading = false;
      }
    },

    async fetchSections() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/sections/get-sections",
        ); // Update with your NestJS base URL
        this.sections = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch sections";
      } finally {
        this.loading = false;
      }
    },

    async fetchRooms() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/rooms/get-rooms",
        ); // Update with your NestJS base URL
        this.rooms = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch rooms";
      } finally {
        this.loading = false;
      }
    },

    async fetchTime() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/time/get-time",
        ); // Update with your NestJS base URL
        this.time = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch time";
      } finally {
        this.loading = false;
      }
    },

    async fetchSchedulers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL +
            "/class-schedules/get-class-schedules",
        ); // Update with your NestJS base URL
        this.schedulers = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch schedulers";
      } finally {
        this.loading = false;
      }
    },

    async fetchProjects() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/projected/get-projected",
        ); // Update with your NestJS base URL
        this.projects = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch projects";
      } finally {
        this.loading = false;
      }
    },

    async fetchBachelors() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/bachelor/get-bachelor",
        ); // Update with your NestJS base URL
        this.bachelors = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch bachelors";
      } finally {
        this.loading = false;
      }
    },

    async fetchMasters() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/master/get-master",
        ); // Update with your NestJS base URL
        this.masters = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch masters";
      } finally {
        this.loading = false;
      }
    },

    async fetchDoctorates() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/doctorate/get-doctorate",
        ); // Update with your NestJS base URL
        this.doctorates = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch doctorates";
      } finally {
        this.loading = false;
      }
    },

    async fetchDetailedInstructor() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL +
            "/class-schedules/get-detailed-instructor",
        ); // Update with your NestJS base URL
        this.detailedInstructor = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch detailedInstructor";
      } finally {
        this.loading = false;
      }
    },

    async fetchDetailedPrograms() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL +
            "/class-schedules/get-detailed-programs",
        ); // Update with your NestJS base URL
        this.detailedPrograms = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch detailedPrograms";
      } finally {
        this.loading = false;
      }
    },

    async fetchDetailedCourses() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL +
            "/class-schedules/get-detailed-courses",
        ); // Update with your NestJS base URL
        this.detailedCourses = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch detailedCourses";
      } finally {
        this.loading = false;
      }
    },

    async fetchDetailedSections() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL +
            "/class-schedules/get-detailed-sections",
        ); // Update with your NestJS base URL
        this.detailedSections = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch detailedSections";
      } finally {
        this.loading = false;
      }
    },

    async fetchDetailedAll() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL +
            "/class-schedules/get-detailed-all",
        ); // Update with your NestJS base URL
        this.detailedAll = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch detailedAll";
      } finally {
        this.loading = false;
      }
    },

    async fetchSemesterSettings() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL +
            "/semester-settings/get-semester-settings",
        ); // Update with your NestJS base URL
        this.semesterSettings = response.data;
      } catch (err) {
        this.error = err.message || "Failed to fetch semesterSettings";
      } finally {
        this.loading = false;
      }
    },
  },
});
