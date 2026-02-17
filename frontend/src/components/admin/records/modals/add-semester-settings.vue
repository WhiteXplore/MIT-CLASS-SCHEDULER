<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="submitData"
        class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg"
        ref="semesterSettingsForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'add-students'" />
            <h1 class="font-bold tracking-wide text-lg">
              Add Semester & School Year
            </h1>
          </div>
          <icon
            :name="'circle-close3'"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>

        <div class="p-5 w-[30vw]">
          <!-- Semester -->
          <div class="w-full space-y-2">
            <label for="semester" class="font-bold">Semester:</label>
            <select
              v-model="form.semester"
              id="semester"
              required
              class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
            >
              <option value="" disabled>Select Semester</option>
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
              <option value="Summer">Summer</option>
            </select>
          </div>

          <!-- School Year Since -->
          <div class="w-full space-y-2 mt-3">
            <label for="school_year_since" class="font-bold"
              >School Year Since:</label
            >
            <input
              v-model="form.school_year_since"
              type="text"
              id="school_year_since"
              required
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter starting year"
            />
          </div>

          <!-- School Year Effective -->
          <div class="w-full space-y-2 mt-3">
            <label for="school_year_effective" class="font-bold"
              >School Year Effective:</label
            >
            <input
              v-model="form.school_year_effective"
              type="text"
              id="school_year_effective"
              required
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
              placeholder="Enter effective year"
            />
          </div>

          <!-- Term Status -->
          <div class="w-full space-y-2 mt-3">
            <label for="term_status" class="font-bold">Term Status:</label>
            <select
              v-model="form.term_status"
              id="term_status"
              required
              class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
            >
              <option value="" disabled>Select Term Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <!-- Divider -->
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
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import { toast } from "vue3-toastify";
import axios from "axios";

export default {
  name: "AddSemesterSettings",
  components: { icon },
  data() {
    return {
      form: {
        semester: "",
        school_year_since: "",
        school_year_effective: "",
        term_status: "",
      },
    };
  },
  methods: {
    async submitData() {
      const form = this.$refs.semesterSettingsForm;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      try {
        const response = await axios.post(
          process.env.VUE_APP_API_BASE_URL +
            "/semester-settings/add-semester-settings",
          this.form,
        );
        console.log(response);
        toast.success("Semester setting added successfully!");
        new Audio(require("@/assets/add.mp3")).play();
        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        toast.error("Failed to add semester setting");
      }
    },
  },
};
</script>
