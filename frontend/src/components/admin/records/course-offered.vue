<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Curriculum Offered</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableCourseOffered />
    </div>
  </div>
</template>

<script>
import tableCourseOffered from "./tables/table-course-offered.vue";
export default {
  name: "CoursesPage",
  components: {
    tableCourseOffered,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
