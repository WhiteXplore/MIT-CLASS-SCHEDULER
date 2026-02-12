<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Projects</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableProjects />
    </div>
  </div>
</template>

<script>
import tableProjects from "./tables/table-projects.vue";
export default {
  name: "ProgramsPage",
  components: {
    tableProjects,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
