<script setup>
import { defineProps, ref, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  kid: {
    // สำหรับ single delete
    type: Object,
    default: () => ({ id: "", name: "" }),
  },
  kids: {
    // สำหรับ multi delete
    type: Array,
    default: () => [],
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

// 🔹 ลบ kid หรือ kids จริง
async function confirmDelete() {
  const targets =
    props.kids.length > 0 ? props.kids : props.kid.id ? [props.kid] : [];
  if (!targets.length) return console.error("No kid(s) to delete");

  try {
    for (const k of targets) {
      const res = await fetch(`${config.apiDomain}/kids/delete/${k.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        console.error("❌ Failed to delete kid:", k, json.message);
        alert(
          `Failed to delete "${k.name}": ${json.message || "Unknown error"}`
        );
        return;
      }
    }

    // emit deleted array or single object
    emit("deleted", targets.length > 1 ? targets : targets[0]);
    close();
  } catch (err) {
    console.error("🔥 Error deleting kid(s):", err);
    alert("Error deleting kid(s): " + err.message);
  }
}

// สำหรับแสดงข้อความ modal
const kidNames = computed(() => {
  if (props.kids.length > 0)
    return props.kids.map((k) => `"${k.name}"`).join(", ");
  if (props.kid?.name) return `"${props.kid.name}"`;
  return "";
});
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
  >
    <div class="bg-white rounded-xl w-96 p-6 shadow-lg">
      <div class="flex gap-4 items-center">
        <img
          src="/images/trash_red.png"
          alt="trash"
          class="bg-red-100 w-16 h-16 p-2 rounded-full"
        />
        <div>
          <p class="text-xl font-bold mb-1 mt-1">
            <template v-if="props.kids.length === 1">
              Delete "{{ props.kids[0].name }}"
            </template>
            <template v-else> Delete {{ props.kids.length }} kids? </template>
          </p>
          <p class="text-sm">
            Are you sure you want to delete
            <template v-if="props.kids.length === 1">this kid?</template>
            <template v-else>these kids?</template>
          </p>
        </div>
      </div>

      <div class="flex justify-between gap-3 mt-6">
        <button
          @click="close"
          class="w-full px-4 py-2 rounded-lg border-2 border-blue-400 text-blue-500 font-normal hover:bg-blue-50"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="w-full px-4 py-2 rounded-lg bg-red-500 text-white font-normal hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
