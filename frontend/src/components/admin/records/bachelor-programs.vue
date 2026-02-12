<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Bachelor Programs</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <TableBachelorPrograms />
    </div>
  </div>
</template>

<script>
import TableBachelorPrograms from "./tables/table-bachelor-programs.vue";

export default {
  name: "BachelorProgramPage",
  components: {
    TableBachelorPrograms,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
