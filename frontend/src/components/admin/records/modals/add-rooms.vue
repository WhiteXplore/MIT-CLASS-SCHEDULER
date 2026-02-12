<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="submitData"
        class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg"
        ref="roomsForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'add-students'" />
            <h1 class="font-bold tracking-wide text-lg">Add Rooms</h1>
          </div>
          <icon
            :name="'circle-close3'"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>
        <div class="p-5 w-[25vw]">
          <!-- Row 1  -->
          <div class="w-full text-left gap-3 flex flex-col space-y-3">
            <div class="w-full space-y-2">
              <label for="room_name" class="font-bold">Room Name:</label>
              <input
                v-model="form.room_name"
                type="text"
                id="room_name"
                required
                class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                placeholder="Enter room name"
              />
            </div>
            <div class="w-full space-y-2">
              <label for="room_number" class="font-bold">Room Number:</label>
              <input
                v-model="form.room_number"
                type="number"
                id="room_number"
                class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                placeholder="Enter room number"
              />
            </div>

            <div class="w-full space-y-2">
              <label for="room_type" class="font-bold">Room Type:</label>
              <select
                v-model="form.room_type"
                id="room_type"
                required
                class="w-full border px-2 py-3 border-gray-600 rounded-md text-md text-gray-800"
              >
                <option value="" disabled>Select Room Type:</option>
                <option value="Lecture">Lecture</option>
                <option value="Laboratory">Laboratory</option>
              </select>
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
  name: "AddRoomspage",
  components: {
    icon,
  },
  data() {
    return {
      form: {
        room_name: "",
        room_type: "",
        room_number: null,
      },
    };
  },
  methods: {
    async submitData() {
      const form = this.$refs.roomsForm;
      if (!form.checkValidity()) {
        form.reportValidity(); // triggers browser validation messages
        return;
      }

      if (this.form.room_number === "") {
        this.form.room_number = null;
      }
      try {
        const response = await axios.post(
          "http://localhost:8000/rooms/add-rooms",
          this.form
        );
        console.log(response);
        console.log("Submitting form:", this.form);
        toast.success("Rooms added successfully!");
        // Play sound after successful delete
        const audio = new Audio(require("@/assets/add.mp3"));
        audio.play();

        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        toast.error("Failed to add rooms");
      }
    },
  },
};
</script>
