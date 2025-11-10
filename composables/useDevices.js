import { useApi } from "~/composables/useApiFire";
export function useDevices() {
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
  const deleted = ref(false);

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

  async function confirmDelete(schoolId, studentId) {
    // if (!studentId) {
    //   alert("Missing student id");
    //   return;
    // } else {
    //   if (!schoolId) {
    //     alert("Missing school id");
    //     return;
    //   }
    // }

    try {
      const res = await useApiFire(
        `/students/${schoolId}/student/${studentId}`,
        {
          method: "DELETE",
        }
      );

      if (res) {
        deleted.value = true;
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      alert("Error deleting student");
    }
  }

  async function confirmMultiDelete(multiSelected) {
    if (!multiSelected || !multiSelected.length) {
      return console.error("No student to delete");
    }

    let allDeleted = true;

    try {
      for (const k of multiSelected) {
        const res = await useApiFire(
          `/students/${k.schoolId}/student/${k.studentId}`,
          { method: "DELETE" }
        );

        if (!res) {
          allDeleted = false;
          console.error("Failed to delete student:", k);
          break;
        }
      }

      if (allDeleted) {
        deleted.value = true;
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      alert("Error deleting student");
    }
  }

  return {
    deleted,
    deviceStatus,
    deviceName,
    beaconId,
    locations,
    beacon,
    kids,
    fetchKids,
    fetchKidAndParent,
    confirmDelete,
    confirmMultiDelete,
  };
}
