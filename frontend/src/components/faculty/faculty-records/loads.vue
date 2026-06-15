<template>
  <div class="px-0 lg:px-4 mt-2">
    <!-- Headers -->
    <!-- <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md hidden lg:block">My Loads</h1>
    </div> -->

    <!-- Main Content  -->
    <div class="mt-0 md:mt-3">
      <!-- Table -->
      <viewFacultyLoads />
    </div>
  </div>
</template>

<script>
import viewFacultyLoads from "../faculty-records/modals/view-faculty-loadings.vue";
export default {
  name: "LoadsPage",
  components: {
    viewFacultyLoads,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
