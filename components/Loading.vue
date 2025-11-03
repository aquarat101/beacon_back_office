<script setup>
import { useGeneralStore } from "~/stores/general";
const isLoading = computed(() => useGeneralStore().isLoading)
</script>

<template>
  <!-- <div
    v-if="isLoading"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  > -->
  <div
  :class="{ '!hidden': !isLoading }"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-lg p-6 flex flex-col items-center shadow-lg w-64"
    >
      <div
        class="loader border-t-4 border-blue-500 rounded-full w-10 h-10 mb-3 animate-spin"
      ></div>
      <p class="text-gray-700 text-center font-medium">Loading schools...</p>
    </div>
  </div>
</template>

<style scoped></style>
