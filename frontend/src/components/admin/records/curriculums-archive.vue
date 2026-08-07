<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Curriculums Archive</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableCurriculumArchive />
    </div>
  </div>
</template>

<script>
import tableCurriculumArchive from "./tables/table-curriculum-archive.vue";
export default {
  name: "CurriculumsArchivePage",
  components: {
    tableCurriculumArchive,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
