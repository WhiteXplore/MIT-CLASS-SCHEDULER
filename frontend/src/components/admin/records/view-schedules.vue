<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Schedules</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableViewAll />
    </div>
  </div>
</template>

<script>
import tableViewAll from "./tables/table-view-all.vue";
export default {
  name: "ClassSchedulesPage",
  components: {
    tableViewAll,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
