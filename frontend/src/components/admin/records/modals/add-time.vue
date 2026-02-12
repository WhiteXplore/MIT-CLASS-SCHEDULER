<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
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
            <h1 class="font-bold tracking-wide text-lg">Add Time</h1>
          </div>
          <icon
            :name="'circle-close3'"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>

        <div class="p-5 w-[20vw]">
          <!-- Row 1 -->
          <div class="space-y-5">
            <!-- Time Inputs -->
            <div class="w-full text-left gap-3 flex mt-2">
              <div class="w-full space-y-2">
                <label for="time" class="font-bold">Start Time:</label>
                <input
                  type="time"
                  id="time"
                  v-model="form.time"
                  required
                  class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                />
              </div>
            </div>
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
  name: "AddTime",
  components: {
    icon,
  },
  data() {
    return {
      form: {
        time: "",
      },
    };
  },
  methods: {
    async submitData() {
      const formEl = this.$refs.schedulesForm;

      if (!formEl.checkValidity()) {
        formEl.reportValidity();
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:8000/time/add-time",
          this.form
        );
        console.log(response);
        console.log("Submitting form:", this.form);
        toast.success("Schedule added successfully!");
        // Play sound after successful delete
        const audio = new Audio(require("@/assets/add.mp3"));
        audio.play();

        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        toast.error("Failed to add Time");
      }
    },
  },
};
</script>
