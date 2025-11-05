import { useAuthStore } from "~/stores/auth";
import { useApi } from "~/composables/useApiFire";
export function useDevices(apiDomain) {
  const { useApiFire } = useApi();
  const route = useRoute();
  const router = useRouter();
  const auth = useAuthStore();
  const kids = ref([]);
  const errorMessage = ref("");
  const studentId = route.query.studentId;
  const beaconId = route.query.beaconId;
  const deviceName = route.query.deviceName;
  const schoolId = route.params.id;
  const deviceStatus = route.query.status;
  const beacon = ref(null);
  const locations = ref([]);
  const loadingLocations = ref(false);

  async function fetchKids() {
    console.log("1-1");

    try {
      const res = await useApiFire(`/students/getAllStudent`);
      if (res) {
        console.log("res", res);

        kids.value = res.data;

        console.log("kids", kids.value);
      }
    } catch (err) {
      errorMessage.value = err.message;
    }
  }
  async function fetchKidAndParent() {
    console.log("1-1");

    try {
      const res = await useApiFire(
        `/students/${schoolId}/student/${studentId}`
      );

      if (res) {
        console.log("res", res);

        beacon.value = res.data;
        fetchLocations();
        console.log("kids", kids.value);
      }
    } catch (err) {
      errorMessage.value = err.message;
    }
  }

  async function fetchLocations() {


    loadingLocations.value = true;
    try {
      const res = await useApiFire(
        `/students/historyTrack/${schoolId}/student/${studentId}`
      );

      if (res) {
        locations.value = res.data;
      }
    } catch (err) {
      console.error("Fetch locations error:", err);
      locations.value = [];
    } finally {
      loadingLocations.value = false;
    }
  }

  return { deviceStatus,deviceName,beaconId, locations, beacon, kids, fetchKids, fetchKidAndParent };
}
