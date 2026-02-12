<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Doctorate Programs</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <TableDoctoratePrograms />
    </div>
  </div>
</template>

<script>
import TableDoctoratePrograms from "./tables/table-doctorate-programs.vue";
export default {
  name: "DoctorateProgramPage",
  components: {
    TableDoctoratePrograms,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
