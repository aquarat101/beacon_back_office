<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  schoolUsers: {
    // array ของ staff/student ที่เลือก
    type: Array,
    default: () => [], // [{ id: '', name: '' }]
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

// 🔹 ลบหลาย user จริง
async function confirmDelete() {
  if (!props.schoolUsers.length) return;

  try {
    // ลบทีละคน (loop) หรือเปลี่ยนเป็น API ที่รองรับ array ก็ได้
    for (const user of props.schoolUsers) {
      const res = await fetch(
        `${config.apiDomain}/schools/deleteUser/${user.id}`,
        {
          method: "DELETE",
        }
      );
      const json = await res.json();
      if (!json.success) console.error("❌ Failed to delete:", user);
    }

    emit("deleted", props.schoolUsers); // แจ้ง parent ว่าลบเสร็จแล้ว
    close();
  } catch (err) {
    console.error("🔥 Error deleting school users:", err);
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
  >
    <div class="bg-white rounded-xl w-96 p-6 shadow-lg">
      <div class="flex gap-4">
        <img
          src="/images/trash_red.png"
          alt="trash"
          class="bg-red-100 w-16 h-16 p-2 rounded-full"
        />

        <div>
          <p class="text-xl font-bold mb-1 mt-1">
            <template v-if="props.schoolUsers.length === 1">
              Delete "{{ props.schoolUsers[0].name }}"
            </template>
            <template v-else>
              Delete {{ props.schoolUsers.length }} users?
            </template>
          </p>
          <p class="text-sm">
            Are you sure you want to delete
            <template v-if="props.schoolUsers.length === 1"
              >this user?</template
            >
            <template v-else>these users?</template>
          </p>
        </div>
      </div>

      <div class="flex justify-between gap-3 mt-6">
        <button
          @click="close"
          class="w-full px-4 py-2 rounded-lg border-2 border-blue-400 text-blue-500 font-normal"
        >
          Cancel
        </button>

        <button
          @click="confirmDelete"
          class="w-full px-4 py-2 rounded-lg bg-red-500 text-white font-normal"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
