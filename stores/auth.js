import { defineStore } from "pinia";
import * as authAPI from "~/service/api/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(email, password) {
      const data = await authAPI.login(email, password);
      this.user = data.user;
      this.token = data.token;
    },
    async logout() {
      try {
        if (this.user?.email) await authAPI.logout(this.user.email);
      } catch (err) {
        console.error(err);
      } finally {
        this.user = null;
        this.token = null;
        localStorage.removeItem("pinia");
      }
    },
    async fetchUser() {
      if (!this.token) return;
      try {
        const data = await authAPI.fetchMe();
        this.user = data.user;
      } catch (err) {
        this.logout();
      }
    },
  },
  persist: true,
});
