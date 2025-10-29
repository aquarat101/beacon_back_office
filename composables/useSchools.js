import { ref } from "vue";

export function useSchools(apiDomain) {
  const schools = ref([]);
  const isLoading = ref(false);

  async function fetchSchools() {
    try {
      isLoading.value = true;
      const res = await fetch(`${apiDomain}/schools/getAll`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      const json = await res.json();
      if (json.success) schools.value = json.data;
      else console.error("Failed to fetch schools");
    } catch (err) {
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  return { schools, isLoading, fetchSchools };
}
