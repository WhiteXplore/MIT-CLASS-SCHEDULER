<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Time</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <TableSchedules />
    </div>
  </div>
</template>

<script>
import TableSchedules from "./tables/table-time.vue";
export default {
  name: "TimePage",
  components: {
    TableSchedules,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
