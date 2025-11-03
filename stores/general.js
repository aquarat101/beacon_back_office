import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    setLoading(val = true) {
      this.isLoading = val;
    },
  },
});
