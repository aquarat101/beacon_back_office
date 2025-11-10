<script setup>
import DeleteStudentModal from "~/components/DeleteStudentModal.vue";
import DatePicker from "~/components/DatePicker.vue";

const route = useRoute();
const router = useRouter();

const { public: config } = useRuntimeConfig();
const {
  deviceStatus,
  deviceName,
  beaconId,
  locations,
  beacon,
  fetchKidAndParent,
} = useDevices(config.apiDomain);

const deleteModalOpen = ref(false);

// current tab
const currentTab = ref("info");
const parentProfile = ref(null);
const isLoading = ref(false);
const errorMessage = ref("");

const startDate = ref("");
const endDate = ref("");
const searchQueryInput = ref("");

// location history

// pagination
const currentPage = ref(1);
const pageSize = 10;
const totalPages = computed(() => Math.ceil(locations.value.length / pageSize));
const paginatedLocations = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return locations.value.slice(start, start + pageSize);
});

const pageNumbers = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  if (total <= 5) for (let i = 1; i <= total; i++) pages.push(i);
  else if (current <= 3) pages.push(1, 2, 3, 4, 5, "...", total);
  else if (current >= total - 2)
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  else pages.push(1, "...", current - 1, current, current + 1, "...", total);
  return pages;
});

function goToPage(page) {
  if (page === "...") return;
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}

function formatDate(date) {
  if (!date) return "-";

  const d = new Date(date);
  return (
    d.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }) +
    ", " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}

function handleDelete() {
  deleteModalOpen.value = false;
  router.push("/devices");
}

function handleSearch() {}

function clearhandleSearch() {
  startDate.value = "";
  endDate.value = "";
  searchQueryInput.value = "";
  console.log("1", startDate.value);
  console.log("2", endDate.value);
}


onMounted(() => {
  fetchKidAndParent();
});
</script>

<template>
  <div class="h-screen p-6">
    <h1 class="text-2xl font-bold mb-4">Device Detail</h1>
    <button @click="router.back()" class="text-blue-500 mb-4 text-lg">
      &lt; Back
    </button>

    <div v-if="isLoading" class="text-center py-10 text-gray-500">
      Loading...
    </div>
    <div v-else-if="errorMessage" class="text-center py-10 text-red-500">
      {{ errorMessage }}
    </div>

    <div v-else>
      <!-- Tabs -->
      <div class="flex border-b mb-5">
        <button
          :class="
            currentTab === 'info' ? 'border-b-2 border-blue-500 pb-2' : 'pb-2'
          "
          @click="currentTab = 'info'"
          class="px-4"
        >
          Information Detail
        </button>
        <button
          :class="
            currentTab === 'location'
              ? 'border-b-2 border-blue-500 pb-2'
              : 'pb-2'
          "
          @click="currentTab = 'location'"
          class="px-4"
        >
          Location History
        </button>
      </div>

      <!-- Info Tab -->
      <div
        v-if="currentTab === 'info' && beacon"
        class="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="flex gap-3">
              <h2 class="text-xl font-bold">{{ deviceName }}</h2>
              <span
                class="text-sm text-white px-2 py-1 rounded-full"
                :class="
                  beacon.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                "
              >
                {{ deviceStatus }}
              </span>
            </div>
            <div class="text-sm text-gray-500 mt-1">
              Beacon ID: {{ beaconId }}
            </div>
          </div>
        </div>

        <img :src="beacon.avatar" alt="avatar" class="w-20 h-20 rounded-full" />

        <div class="mt-6">
          <strong>Parent Name</strong>
          <p>{{ beacon.parent.firstName }} {{ beacon.parent.lastName }}</p>
          <strong>Email</strong>
          <p>
            {{ beacon.parent.email }}
          </p>
          <strong>Phone</strong>
          <p>
            {{ beacon.parent.phone }}
          </p>
          <strong>School</strong>
          <p>
            {{ beacon.schoolName }}
          </p>
          <strong>Remark</strong>
          <p>
            {{ beacon.remark }}
          </p>
        </div>

        <button
          @click="deleteModalOpen = true"
          class="text-blue-500 font-bold underline mt-2"
        >
          Delete Device
        </button>
      </div>

      <!-- Location Tab -->
      <div
        v-if="currentTab === 'location'"
        class="p-6 bg-white rounded-xl shadow"
      >
        <h1 class="text-2xl font-bold mb-6">Location History</h1>

        <div class="flex mb-6 gap-4">
          <input
            v-model="searchQueryInput"
            type="text"
            placeholder="Search"
            class="border rounded-lg px-3 py-2 flex-1 w-full"
          />

          <DatePicker v-model="startDate" placeholder="Start Date"></DatePicker>
          <DatePicker v-model="endDate" placeholder="End Date"></DatePicker>
          <button
            @click="handleSearch"
            class="bg-color-main2 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
          <button
            @click="clearhandleSearch"
            class="bg-color-main2 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Clear
          </button>
        </div>

        <table class="w-full border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th class="pl-6 p-3 text-left">Location Name</th>
              <th class="pr-6 p-3 text-right">Date/Time</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="loc in paginatedLocations"
              :key="loc.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="pl-6 p-3 text-left">{{ loc.type }}</td>
              <td class="pr-6 p-3 text-right">
                {{ formatDate(loc.timestamp) }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-end items-center p-4">
          <button
            class="text-color-main2 disabled:text-gray-600"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            &lt; Previous
          </button>

          <div class="flex gap-2 px-8">
            <button
              v-for="page in pageNumbers"
              :key="page + '-btn'"
              class="px-3 py-1 rounded"
              :disabled="page === '...'"
              :class="
                page === currentPage
                  ? 'bg-blue-500 text-white'
                  : page === '...'
                  ? 'bg-transparent text-gray-500 cursor-default'
                  : 'bg-white text-color-main2'
              "
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            class="text-color-main2 disabled:text-gray-600"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next &gt;
          </button>
        </div>
      </div>

      <DeleteStudentModal
        v-if="beacon"
        v-model="deleteModalOpen"
        :kid="{ id: beacon.id, name: beacon.name }"
        @deleted="handleDelete"
      />
    </div>
  </div>
</template>

<style scoped>
p {
  color: #767a85;
  margin-bottom: 16px !important;
}
.dp__input {
  border: none !important;
  box-shadow: none !important;
}
</style>
