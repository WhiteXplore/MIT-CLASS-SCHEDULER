<template>
  <div
    class="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5"
  >
    <div
      class="w-full max-w-7xl bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
    >
      <!-- HEADER -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-8 py-5 border-b border-gray-200"
      >
        <div>
          <h1
            class="text-[12px] sm:text-[16px] font-semibold tracking-tight text-gray-900"
          >
            Upload Instructor Excel
          </h1>

          <p class="text-xs text-gray-500 mt-1">
            Upload and verify instructor records before saving.
          </p>
        </div>

        <button
          @click="$emit('close')"
          class="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-100 transition flex items-center justify-center text-gray-500"
        >
          ✕
        </button>
      </div>

      <!-- BODY -->
      <div class="p-4 sm:p-6 lg:p-8">
        <!-- TOP SECTION -->
        <div class="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-5 lg:gap-8">
          <!-- LEFT -->
          <div>
            <!-- UPLOAD CARD -->
            <div
              class="border border-dashed border-gray-300 rounded-2xl bg-gray-50 p-6 sm:p-8"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".xlsx,.xls"
                class="hidden"
                @change="handleFile"
              />

              <div class="flex flex-col items-center text-center">
                <!-- ICON -->
                <div
                  class="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-8 h-8 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.7"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                <h2 class="mt-5 text-[17px] font-semibold text-gray-800">
                  Select Excel File
                </h2>

                <p
                  class="mt-2 text-sm leading-relaxed text-gray-500 max-w-[250px]"
                >
                  Upload an Excel file containing instructor records.
                </p>

                <button
                  @click="$refs.fileInput.click()"
                  class="mt-6 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-medium transition"
                >
                  Browse File
                </button>
              </div>
            </div>

            <!-- FILE INFO -->
            <div
              v-if="file"
              class="mt-5 border border-gray-200 rounded-2xl p-5"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <p class="text-xs uppercase tracking-wide text-gray-400">
                    Selected File
                  </p>

                  <h3 class="mt-1 text-sm font-medium text-gray-800 break-all">
                    {{ file.name }}
                  </h3>

                  <p class="mt-2 text-sm text-gray-500">
                    {{ previewData.length }} records detected
                  </p>
                </div>

                <button
                  @click="removeFile"
                  class="shrink-0 px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="min-w-0">
            <!-- TABLE HEADER -->
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
            >
              <div>
                <h2 class="text-sm sm:text-[16px] font-semibold text-gray-900">
                  Preview Data
                </h2>

                <p class="text-sm text-gray-500 mt-1">
                  Review uploaded instructor information.
                </p>
              </div>

              <div
                class="inline-flex items-center px-4 py-2 rounded-xl bg-gray-100 text-sm font-medium text-gray-700 w-fit"
              >
                {{ previewData.length }} Records
              </div>
            </div>

            <!-- EMPTY STATE -->
            <div
              v-if="!previewData.length"
              class="border border-gray-200 rounded-2xl h-[420px] flex flex-col items-center justify-center bg-gray-50 text-center px-5"
            >
              <div
                class="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-7 h-7 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                    d="M9 17v-2m3 2v-4m3 4v-6M9 7h.01M15 7h.01M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                  />
                </svg>
              </div>

              <h3 class="mt-5 text-base font-semibold text-gray-800">
                No Excel Data
              </h3>

              <p class="mt-2 text-sm text-gray-500 max-w-sm">
                Upload an Excel file to preview instructor records before saving
                them into the system.
              </p>
            </div>

            <!-- TABLE -->
            <div
              v-else
              class="border border-gray-200 rounded-2xl overflow-hidden"
            >
              <div class="overflow-auto max-h-[500px]">
                <table class="min-w-[900px] w-full text-sm text-left">
                  <thead
                    class="sticky top-0 bg-white border-b border-gray-200 z-10"
                  >
                    <tr>
                      <th class="px-5 py-4 font-semibold text-gray-700">#</th>

                      <th class="px-5 py-4 font-semibold text-gray-700">
                        First Name
                      </th>

                      <th class="px-5 py-4 font-semibold text-gray-700">
                        Middle Name
                      </th>

                      <th class="px-5 py-4 font-semibold text-gray-700">
                        Last Name
                      </th>

                      <th class="px-5 py-4 font-semibold text-gray-700">
                        Gender
                      </th>

                      <th class="px-5 py-4 font-semibold text-gray-700">
                        Job Type
                      </th>

                      <th class="px-5 py-4 font-semibold text-gray-700">
                        Employee ID
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(item, index) in previewData"
                      :key="index"
                      class="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td class="px-5 py-4 text-gray-500">
                        {{ index + 1 }}
                      </td>

                      <td class="px-5 py-4 text-gray-800">
                        {{ item.instructor_fname }}
                      </td>

                      <td class="px-5 py-4 text-gray-800">
                        {{ item.instructor_mname }}
                      </td>

                      <td class="px-5 py-4 text-gray-800">
                        {{ item.instructor_lname }}
                      </td>

                      <td class="px-5 py-4 text-gray-600">
                        {{ item.instructor_gender }}
                      </td>

                      <td class="px-5 py-4 text-gray-600">
                        {{ item.instructor_jobtype }}
                      </td>

                      <td class="px-5 py-4 text-gray-600">
                        {{ item.employee_id }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- FOOTER -->

        <div class="tracking-wide flex justify-end gap-2 mt-4">
          <button
            type="button"
            class="bg-red-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md cursor-pointer"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            @click="uploadExcel"
            :disabled="loading || !file"
            class="bg-green-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md cursor-pointer"
          >
            {{ loading ? "Uploading..." : "Upload Excel" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      file: null,
      loading: false,
      previewData: [],
    };
  },

  methods: {
    async handleFile(event) {
      this.file = event.target.files[0];

      console.log("Selected File:", this.file);

      if (!this.file) return;

      const allowedExtensions = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];

      if (!allowedExtensions.includes(this.file.type)) {
        toast.error("Invalid excel file");

        this.file = null;

        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, {
          type: "array",
        });

        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log("Excel Preview Data:", jsonData);

        this.previewData = jsonData;
      };

      reader.readAsArrayBuffer(this.file);
    },

    removeFile() {
      this.file = null;

      this.previewData = [];

      this.$refs.fileInput.value = null;

      toast.info("File removed");
    },

    async uploadExcel() {
      if (!this.file) {
        toast.error("Please select an excel file");

        return;
      }

      try {
        this.loading = true;

        const formData = new FormData();

        formData.append("file", this.file);

        console.log("Uploading Excel...");

        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/instructors/upload-excel`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        console.log("Upload Success:", response.data);

        toast.success(response.data.message);

        this.$emit("refresh");

        this.$emit("close");
      } catch (error) {
        console.error("Upload Error:", error);

        toast.error(error.response?.data?.message || "Upload failed");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
