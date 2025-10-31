<script setup>
import { defineProps, ref, watch } from "vue";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const props = defineProps({
  modelValue: Boolean,
  student: {
    type: Object,
    default: () => ({
      id: "",
      name: "",
    }),
  },
});

const emit = defineEmits(["update:modelValue", "deleted"]);
const { public: config } = useRuntimeConfig();

const isOpen = ref(props.modelValue);
watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);
watch(isOpen, (val) => emit("update:modelValue", val));

function close() {
  isOpen.value = false;
}

// 🔹 ลบ student จริง
async function confirmDelete() {
  if (!props.student.id) {
    console.error("Missing student id");
    return;
  }

  try {
    const res = await fetch(`${config.apiDomain}/${schoolId}/student/${studentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });

    const json = await res.json();

    if (res.ok) {
      // console.log('✅ Deleted student:', props.student)
      emit("deleted", props.student);
      close();
    } else {
      console.error("❌ Failed to delete student:", json.message);
      alert("Failed to delete student: " + (json.message || "Unknown error"));
    }
  } catch (err) {
    console.error("🔥 Error deleting student:", err);
    alert("Error deleting student: " + err.message);
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div class="bg-white rounded-xl w-96 p-6 shadow-lg">
      <div class="flex gap-4 items-center">
        <img src="/images/trash_red.png" alt="trash" class="bg-red-100 w-16 h-16 p-2 rounded-full" />
        <div>
          <p class="text-xl font-bold mb-1 mt-1">Delete "{{ student.name }}"?</p>
          <p class="text-sm text-gray-600">
            Are you sure you want to delete this student from the system?
          </p>
        </div>
      </div>

      <div class="flex justify-between gap-3 mt-6">
        <button @click="close"
          class="w-full px-4 py-2 rounded-lg border-2 border-blue-400 text-blue-500 font-normal hover:bg-blue-50">
          Cancel
        </button>
        
        <button @click="confirmDelete"
          class="w-full px-4 py-2 rounded-lg bg-red-500 text-white font-normal hover:bg-red-600">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
