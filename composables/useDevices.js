import { useAuthStore } from "~/stores/auth";
import { useApi } from "~/composables/useApiFire";
export function useDevices(apiDomain) {
  const { useApiFire } = useApi();
  const route = useRoute();
  const router = useRouter();
  const auth = useAuthStore();
  const kids = ref([]);
  const errorMessage = ref("");

  async function fetchKids() {
    try {
      const res = await useApiFire(`/students/getAllStudent`);
      if (res) {
        console.log("res",res);
        
        kids.value = res.data;
      }
    } catch (err) {
      errorMessage.value = err.message;
    }
  }
//   async function fetchKids() {
//     try {
//       const { public: config } = useRuntimeConfig();
//       const res = await useApiFire(`/kids/getAllKids`);
//       if (res) {
//         const rawKids = res.kids || [];

//         const kidsWithExtraData = await Promise.all(
//           rawKids.map(async (kid) => {
//             let placeName = "Unknown place";
//             let parentName = "Unknown parent";

//             try {
//               const placeRes = await useApiFire(
//                 `/places/getPlace/${kid.userId}/${kid.lastZoneId}`);
//               if (placeRes.ok) {
//                 const placeData = await placeRes.json();
//                 placeName =
//                   placeData?.place?.name || placeData?.name || "Unknown place";
//               }
//             } catch {}

//             try {
//               const userRes = await useApiFire(
//                 `${config.apiDomain}/users/get/${kid.userId}`,
//                 {
//                   headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${auth.token}`,
//                   },
//                 }
//               );
//               if (userRes.ok) {
//                 const userData = await userRes.json();
//                 parentName =
//                   userData?.user?.firstName ||
//                   userData?.firstName ||
//                   "Unknown parent";
//               }
//             } catch {}

//             return { ...kid, placeName, parentName };
//           })
//         );
//         kids.value = kidsWithExtraData;
//       }
//     } catch (err) {
//       errorMessage.value = err.message;
//     }
//   }

  return { kids, fetchKids };
}
