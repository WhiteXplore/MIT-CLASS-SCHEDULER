<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Account Settings</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <TablesUers />
    </div>
  </div>
</template>

<script>
import TablesUers from "./tables/table-user.vue";
export default {
  name: "UserAccountsPage",
  components: {
    TablesUers,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
