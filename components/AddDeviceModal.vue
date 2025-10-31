<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  schoolId: { type: String, required: true },
});
const emit = defineEmits(["update:modelValue", "created"]);

const { public: config } = useRuntimeConfig();

const form = ref({
  schoolId: props.schoolId,
  beaconId: "",
  deviceName: "",
  userId: "",
  status: "",
});

watch(
  () => props.schoolId,
  (newId) => {
    form.value.schoolId = newId;
  },
  { immediate: true },

  form.value = {
    schoolId: props.schoolId,
    beaconId: "",
    deviceName: "",
    userId: "",
    status: "",
  }
);

const isLoading = ref(false);

function closeModal() {
  emit("update:modelValue", false);

  form.value = {
    schoolId: props.schoolId,
    beaconId: "",
    deviceName: "",
    userId: "",
    status: "",
  }
}

async function AddDeviceModal() {
  // Validate required fields
  if (!form.value.beaconId || !form.value.deviceName || !form.value.userId) {
    alert("Please fill all required fields");
    return;
  }

  try {
    isLoading.value = true;

    const resStudent = await fetch(
      `${config.apiDomain}/students/createStudent/${props.schoolId}/${form.value.userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(form.value),
      }
    );

    // const resKid = await fetch(
    //   `${config.apiDomain}/kids/create/${form.value.userId}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${auth.token}`,
    //     },
    //     body: JSON.stringify(form.value),
    //   }
    // );

    const studentData = await resStudent.json();
    // const kidData = await resKid.json();

    if (studentData.success) {
      emit("created", studentData);
      closeModal();
    } else {
      alert(studentData.message || "Failed to create user");
    }
  } catch (err) {
    console.error("❌ Error creating user:", err);
    alert("Error creating user");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div v-if="props.modelValue" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md relative">
      <!-- Loading overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-lg">
        <div class="loader border-t-4 border-blue-500 rounded-full w-10 h-10 animate-spin mb-3"></div>
        <p class="text-gray-600">Creating user...</p>
      </div>

      <!-- Header -->
      <div class="flex justify-between items-center px-6 py-4 border-b">
        <h2 class="text-lg font-semibold">Add Back Office User</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-black text-xl">
          &times;
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Beacon ID<span class="text-red-500">*</span></label>
          <input v-model="form.beaconId" type="text" placeholder="beaconId"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Parent User ID<span class="text-red-500">*</span></label>
          <input v-model="form.userId" type="text" placeholder="parent user id"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Device Name<span class="text-red-500">*</span></label>
          <input v-model="form.deviceName" type="text" placeholder="device name"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Status<span class="text-red-500">*</span></label>
          <select v-model="form.status"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none">
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end px-6 py-4 border-t">
        <button @click="closeModal" class="px-4 py-2 mr-3 border rounded-md">
          Cancel
        </button>
        <button @click="AddDeviceModal" class="px-4 py-2 bg-color-main2 hover:bg-blue-600 text-white rounded-md">
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  border: 4px solid #ddd;
  border-top-color: #3b82f6;
}
</style>
