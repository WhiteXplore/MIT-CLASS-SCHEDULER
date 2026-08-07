<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Account Archive</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableUserArchive />
    </div>
  </div>
</template>

<script>
import tableUserArchive from "./tables/table-user-archive.vue";
export default {
  name: "UserAccountsPage",
  components: {
    tableUserArchive,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
