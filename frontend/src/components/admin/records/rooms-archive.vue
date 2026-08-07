<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Rooms Archive</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableRoomsArchive />
    </div>
  </div>
</template>

<script>
import tableRoomsArchive from "./tables/table-rooms-archive.vue";
export default {
  name: "RoomsPage",
  components: {
    tableRoomsArchive,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
