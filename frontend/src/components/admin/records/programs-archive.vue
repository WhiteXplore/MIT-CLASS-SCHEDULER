<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Programs Archive</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableProgramsArchive />
    </div>
  </div>
</template>

<script>
import tableProgramsArchive from "./tables/table-programs-archive.vue";
export default {
  name: "ProgramsArchivePage",
  components: {
    tableProgramsArchive,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
