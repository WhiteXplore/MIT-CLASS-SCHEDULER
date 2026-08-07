<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Courses Archive</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableCoursesArchive />
    </div>
  </div>
</template>

<script>
import tableCoursesArchive from "./tables/table-courses-archive.vue";
export default {
  name: "CoursesArchivePage",
  components: {
    tableCoursesArchive,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
