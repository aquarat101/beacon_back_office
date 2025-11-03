import { useAuthStore } from "~/stores/auth";
import { useApi } from "~/composables/useApiFire";
export function useDashBoard(apiDomain) {
  const { useApiFire } = useApi();
  const route = useRoute();
  const router = useRouter();
  const auth = useAuthStore();
  const dashBoardData = ref("")

  console.log('useDashBoard called with', apiDomain);

  async function fetchDashBoardData() {
    try {
      const res = await useApiFire("/dashBoard/overview");
      if (res) {
        
        dashBoardData.value = res;
      }
      
    } catch (err) {
      console.error("❌ Fetch school users failed:", err);
    }
  }

  return { dashBoardData , fetchDashBoardData };
}
