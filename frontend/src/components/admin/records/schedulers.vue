<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Schedules</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <TableSchedulers />
    </div>
  </div>
</template>

<script>
import TableSchedulers from "./tables/table-schedulers.vue";
export default {
  name: "ClassSchedulesPage",
  components: {
    TableSchedulers,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
