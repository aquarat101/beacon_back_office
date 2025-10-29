<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  school: {
    type: Object,
    default: () => ({ id: "", schoolName: "" }), // เปลี่ยนเป็น schoolName ตาม API
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

// 🔹 ลบโรงเรียนจริง
async function confirmDelete() {
  if (!props.school.id) return;
  try {
    const res = await fetch(
      `${config.apiDomain}/schools/delete/${props.school.id}`,
      {
        method: "DELETE",
      }
    );
    const json = await res.json();
    if (json.success) {
      console.log("Deleted school:", props.school);
      emit("deleted", props.school); // ส่ง event กลับ parent
      close();
    } else {
      console.error("Failed to delete:", json.message);
    }
  } catch (err) {
    console.error("🔥 Error deleting school:", err);
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
            Delete "{{ props.school.schoolName }}"?
          </p>
          <p class="text-sm">Are you sure you want to delete this school?</p>
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
