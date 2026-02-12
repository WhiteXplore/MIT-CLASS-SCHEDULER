<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="submitData"
        class="w-auto bg-white text-[13px] rounded-[15px] shadow-xl"
        ref="instructorForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'edit-students'" />
            <h1 class="font-bold tracking-wide text-lg">Edit Instructor</h1>
          </div>
          <icon
            :name="'circle-close3'"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>

        <!-- Body -->
        <div class="w-full h-auto p-5">
          <!-- Step 1 -->
          <div v-if="currentStep === 1">
            <h1 class="text-left text-lg font-bold">Personal Information</h1>
            <div class="w-[25vw] text-left gap-3 flex flex-col mt-2">
              <div class="w-full space-y-2">
                <label for="instructor_fname">First Name:</label>
                <input
                  v-model="form.instructor_fname"
                  type="text"
                  id="instructor_fname"
                  required
                  class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                  placeholder="Enter first name"
                />
              </div>
              <div class="w-full space-y-2">
                <label for="instructor_mname">Middle Name:</label>
                <input
                  v-model="form.instructor_mname"
                  type="text"
                  id="instructor_mname"
                  class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                  placeholder="Enter middle name (optional)"
                />
              </div>

              <div class="w-full space-y-2">
                <label for="instructor_lname">Last Name:</label>
                <input
                  v-model="form.instructor_lname"
                  type="text"
                  id="instructor_lname"
                  required
                  class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                  placeholder="Enter last name"
                />
              </div>
              <div class="w-full space-y-2">
                <label for="instructor_gender">Gender:</label>
                <select
                  v-model="form.instructor_gender"
                  id="instructor_gender"
                  required
                  class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div v-if="currentStep === 2">
            <h1 class="text-left text-lg font-bold">Education Information</h1>
            <div class="w-[25vw] text-left gap-3 flex flex-col mt-2">
              <div class="w-full space-y-2">
                <label for="bachelorprogram_id">Bachelor Program:</label>
                <select
                  v-model="form.bachelorprogram_id"
                  id="bachelorprogram_id"
                  class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
                >
                  <option value="" disabled>Select Bachelor</option>
                  <option value="0">-</option>
                  <option
                    v-for="bachelor in bachelors"
                    :key="bachelor.bachelorprogram_id"
                    :value="bachelor.bachelorprogram_id"
                  >
                    {{ bachelor.bachelor_category || "-" }}
                  </option>
                </select>
              </div>

              <div class="w-full space-y-2">
                <label for="masterprogram_id">Master Program:</label>
                <select
                  v-model="form.masterprogram_id"
                  id="masterprogram_id"
                  class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
                >
                  <option value="" disabled>Select Master</option>
                  <option value="0">-</option>
                  <option
                    v-for="master in masters"
                    :key="master.masterprogram_id"
                    :value="master.masterprogram_id"
                  >
                    {{ master.master_category || "-" }}
                  </option>
                </select>
              </div>

              <div class="w-full space-y-2">
                <label for="doctorateprogram_id">Doctorate Program:</label>
                <select
                  v-model="form.doctorateprogram_id"
                  id="doctorateprogram_id"
                  class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
                >
                  <option value="" disabled>Select Doctorate</option>
                  <option value="0">-</option>
                  <option
                    v-for="doctorate in doctorates"
                    :key="doctorate.doctorateprogram_id"
                    :value="doctorate.doctorateprogram_id"
                  >
                    {{ doctorate.doctorate_category || "-" }}
                  </option>
                </select>
              </div>

              <div class="w-full space-y-2">
                <label for="instructor_jobtype">Job Type:</label>
                <select
                  v-model="form.instructor_jobtype"
                  id="instructor_jobtype"
                  required
                  class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
                >
                  <option :value="''" disabled>Select Job Type</option>
                  <option value="Regular">Regular</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Program Head">Program Head</option>
                  <option value="Clinical Instructor">
                    Clinical Instructor
                  </option>
                </select>
              </div>
              <div class="w-full space-y-2">
                <label for="employee_id">Employee ID:</label>
                <input
                  v-model="form.employee_id"
                  type="text"
                  id="employee_id"
                  required
                  maxlength="20"
                  pattern="[A-Za-z0-9-]+"
                  class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                  placeholder="Enter employee ID (alphanumeric, e.g., 2025-005)"
                />
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="tracking-wide flex justify-between mt-4">
            <button
              v-if="currentStep > 1"
              type="button"
              class="bg-gray-600 p-2 px-3 rounded-md text-white hover:bg-gray-800"
              @click="prevStep"
            >
              Back
            </button>
            <button
              v-if="currentStep < 2"
              type="button"
              class="bg-green-600 p-2 px-3 rounded-md text-white hover:bg-green-800"
              @click="nextStep"
            >
              Next
            </button>
          </div>

          <!-- Divider -->
          <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

          <!-- Submit/Cancel -->
          <div class="tracking-wide flex justify-end gap-2 mt-4">
            <button
              type="button"
              class="bg-red-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-green-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import { toast } from "vue3-toastify";
import axios from "axios";
import { useFetchDataStore } from "@/store/fetch-data-store";
import { mapState, mapActions } from "pinia";

export default {
  name: "EditInstructorModalPage",
  components: { icon },
  props: {
    instructorData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentStep: 1,
      form: {
        instructor_fname: "",
        instructor_mname: "",
        instructor_lname: "",
        instructor_gender: "",
        instructor_jobtype: "",
        bachelorprogram_id: 0,
        masterprogram_id: 0,
        doctorateprogram_id: 0,
        employee_id: "",
      },
    };
  },
  computed: {
    ...mapState(useFetchDataStore, ["bachelors", "masters", "doctorates"]),
  },
  methods: {
    ...mapActions(useFetchDataStore, [
      "fetchBachelors",
      "fetchMasters",
      "fetchDoctorates",
    ]),
    nextStep() {
      this.currentStep++;
    },
    prevStep() {
      this.currentStep--;
    },
    async submitData() {
      const formEl = this.$refs.instructorForm;
      if (!formEl.checkValidity()) {
        formEl.reportValidity();
        return;
      }

      const payload = {
        ...this.form,
        bachelorprogram_id:
          this.form.bachelorprogram_id === 0
            ? null
            : this.form.bachelorprogram_id,
        masterprogram_id:
          this.form.masterprogram_id === 0 ? null : this.form.masterprogram_id,
        doctorateprogram_id:
          this.form.doctorateprogram_id === 0
            ? null
            : this.form.doctorateprogram_id,
      };

      try {
        await axios.patch(
          `http://localhost:8000/instructors/update-instructor/${this.instructorData.instructor_id}`,
          payload
        );
        toast.success("Instructor updated successfully!");
        new Audio(require("@/assets/add.mp3")).play();
        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        console.error(
          "Error updating instructor:",
          error.response?.data || error
        );
        toast.error("Failed to update instructor.");
      }
    },
    populateForm() {
      this.form = {
        instructor_fname: this.instructorData.instructor_fname || "",
        instructor_mname: this.instructorData.instructor_mname || "",
        instructor_lname: this.instructorData.instructor_lname || "",
        instructor_gender: this.instructorData.instructor_gender || "",
        instructor_jobtype: this.instructorData.instructor_jobtype || "",
        bachelorprogram_id: this.instructorData.bachelorprogram_id ?? 0,
        masterprogram_id: this.instructorData.masterprogram_id ?? 0,
        doctorateprogram_id: this.instructorData.doctorateprogram_id ?? 0,
        employee_id: this.instructorData.employee_id || "",
      };
    },
  },
  mounted() {
    this.fetchBachelors();
    this.fetchMasters();
    this.fetchDoctorates();
    this.populateForm();
  },
};
</script>
