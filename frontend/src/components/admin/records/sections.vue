<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Sections</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableSections />
    </div>
  </div>
</template>

<script>
import tableSections from "./tables/table-sections.vue";
export default {
  name: "RoomsPage",
  components: {
    tableSections,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
