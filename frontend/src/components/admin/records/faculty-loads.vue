<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Faculty Loads</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableFacultyLoads />
    </div>
  </div>
</template>

<script>
import tableFacultyLoads from "./tables/table-faculty-loads.vue";
export default {
  name: "FacultyLoadsPage",
  components: {
    tableFacultyLoads,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
