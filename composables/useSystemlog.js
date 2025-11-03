import { useAuthStore } from "~/stores/auth";
import { useApi } from "~/composables/useApiFire";
export function useSystemLog(apiDomain) {
  const { useApiFire } = useApi();
  const logs = ref([]);

  async function fetchLogs() {
    try {
      const res = await useApiFire(`/systemBof/`);
      if (res) {
        logs.value = (res.logs || []).map((item, index) => ({
          id: index + 1,
          datetime: item.timestamp,
          log: item.action,
          user: item.targetName,
          role:
            item.actorRole === "super_admin" ? "Super Admin" : item.actorRole,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  }

  return { logs, fetchLogs };
}
