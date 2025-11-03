import { useAuthStore } from "~/stores/auth";
import { useGeneralStore } from "~/stores/general";
import { useRuntimeConfig } from "#app";

export function useApi() {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const general = useGeneralStore();

  async function useApiFire(url, options = {}) {
    try {
      general.setLoading(true);

      const res = await $fetch(`${config.public.apiDomain}${url}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        ...options,
      });

      return res;
    } catch (err) {
      console.error("❌ API Error:", err);
      throw err;
    } finally {
      general.setLoading(false);
    }
  }

  return { useApiFire };
}
