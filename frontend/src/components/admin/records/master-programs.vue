<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Master Programs</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <TableMasterProgram />
    </div>
  </div>
</template>

<script>
import TableMasterProgram from "./tables/table-master-programs.vue";
export default {
  name: "BachelorProgramPage",
  components: {
    TableMasterProgram,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
