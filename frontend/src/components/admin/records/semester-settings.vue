<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Term & Year Setup</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableSemesterSetting />
    </div>
  </div>
</template>

<script>
import tableSemesterSetting from "./tables/table-semester-setting.vue";
export default {
  name: "RoomsPage",
  components: {
    tableSemesterSetting,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
