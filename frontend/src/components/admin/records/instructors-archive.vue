<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Faculty Archive</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableInstructorArchive />
    </div>
  </div>
</template>

<script>
import tableInstructorArchive from "./tables/table-instructor-archive.vue";
export default {
  name: "InstructorArchivePage",
  components: {
    tableInstructorArchive,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
