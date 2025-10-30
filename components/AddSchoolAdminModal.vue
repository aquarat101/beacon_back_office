<script setup>
import { ref, watch, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { ROLES } from "~/constants/role";

const auth = useAuthStore();
const props = defineProps({
  modelValue: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "created"]);

const { public: config } = useRuntimeConfig();

const role = ref(false);

const form = ref({
  name: "",
  email: "",
  phone_number: "",
  password: "",
  role: "",
  schoolId: "",
  status: "Active",
});

const isLoading = ref(false);
const schools = ref([]);

watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      await fetchSchools();

      // ✅ รีเซ็ตค่า form ทุกครั้งที่เปิดใหม่
      form.value = {
        name: "",
        email: "",
        phone_number: "",
        password: "",
        role: form.value.role, // คง role เดิมไว้ตามสิทธิ์ user
        schoolId: "",
        status: "Active",
      };
    }
  }
);


async function fetchSchools() {
  try {
    const res = await fetch(`${config.apiDomain}/schools/getAll`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });

    const data = await res.json();
    console.log("📦 API Response:", data);

    if (res.ok && Array.isArray(data.data)) {
      schools.value = data.data;
      console.log("✅ Loaded schools:", schools.value);
    } else {
      console.warn("Unexpected response:", data);
    }
  } catch (error) {
    console.error("Error fetching schools:", error);
  }
}

function closeModal() {
  emit("update:modelValue", false);

  // ✅ เคลียร์ค่า form ทุกครั้งที่ปิด
  form.value = {
    name: "",
    email: "",
    phone_number: "",
    password: "",
    role: form.value.role,
    schoolId: "",
    status: "Active",
  };
}

async function createUser() {
  if (
    !form.value.name ||
    !form.value.email ||
    !form.value.phone_number ||
    !form.value.role ||
    !form.value.schoolId
  ) {
    alert("Please fill all required fields");
    return;
  }

  try {
    isLoading.value = true;

    const payload = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      phone_number: form.value.phone_number,
      role: form.value.role,
      schoolId: form.value.schoolId,
    };

    const res = await fetch(`${config.apiDomain}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      alert("User created successfully!");
      emit("created", data.user);
      closeModal();
    } else {
      alert(data.message || "Failed to create user");
    }
  } catch (err) {
    console.error("❌ Error creating user:", err);
    alert("Error creating user");
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  const user = auth.user; // ✅ ดึง user จาก Pinia

  if (user?.role === ROLES.SCHOOL_ADMIN) {
    // ถ้าเป็น School Admin → สามารถสร้าง staff ได้เท่านั้น
    role.value = false;
    form.value.role = "school_staff";
  } else {
    // ถ้าเป็น Super Admin → สามารถสร้าง School Admin ได้
    role.value = true;
    form.value.role = "school_admin";
  }

  console.log("🔹 Current user role:", user?.role);
  console.log("🔹 Assigned form.role:", form.value.role);
});
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
          <label class="block text-sm font-medium mb-1">Name<span class="text-red-500">*</span></label>
          <input v-model="form.name" type="text" placeholder="name"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Email<span class="text-red-500">*</span></label>
          <input v-model="form.email" type="email" placeholder="email"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Phone number<span class="text-red-500">*</span></label>
          <input v-model="form.phone_number" type="text" placeholder="phone number"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Password<span class="text-red-500">*</span></label>
          <input v-model="form.password" type="password" placeholder="password"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Role<span class="text-red-500">*</span></label>
          <input v-model="form.role" type="text" placeholder="" disabled
            class="w-full border rounded-md px-3 py-2 focus:ring-2 bg-gray-200 text-gray-500 focus:ring-blue-400 focus:outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">School<span class="text-red-500">*</span></label>
          <select v-model="form.schoolId"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none">
            <option disabled value="">Select School</option>
            <option v-for="school in schools" :key="school.id" :value="school.id">
              {{ school.schoolName }}
            </option>
          </select>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end px-6 py-4 border-t">
        <button @click="closeModal" class="px-4 py-2 mr-3 border rounded-md">
          Cancel
        </button>
        <button @click="createUser" class="px-4 py-2 bg-color-main2 hover:bg-blue-600 text-white rounded-md">
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
