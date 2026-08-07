<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Projects Archive</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableProjectsArchive />
    </div>
  </div>
</template>

<script>
import tableProjectsArchive from "./tables/table-projects-archive.vue";
export default {
  name: "ProjectedPage",
  components: {
    tableProjectsArchive,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
