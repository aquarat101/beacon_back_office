<script setup>
const { deleted, confirmMultiDelete } = useDevices();
const props = defineProps({
  modelValue: Boolean,

  students: {
    type: Array,
    default: () => [],
  },
});
const multiSelected = ref([]);

const emit = defineEmits(["update:modelValue", "deleted"]);

const isOpen = ref(props.modelValue);
watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
    deleted.value = false;
    multiSelected.value = props.students;
  }
);
watch(isOpen, (val) => emit("update:modelValue", val));

watch(deleted, (val) => {
  if (val) {
    isOpen.value = false;
    emit("deleted", deleted.value);
    console.log("deleted.value", deleted.value);
  }
});

// const studentNames = computed(() => {
//   if (props.students.length > 0)
//     return props.students.map((k) => `"${k.name}"`).join(", ");
//   if (props.student?.name) return `"${props.student.name}"`;
//   return "";
// });
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
            <template v-if="props.students.length === 1">
              Delete this student
              <!-- Delete "{{ props.students[0].devicename }}" -->
            </template>
            <template v-else>
              Delete {{ props.students.length }} students?
            </template>
          </p>
          <p class="text-sm">
            Are you sure you want to delete
            <template v-if="props.students.length === 1"
              >this student?</template
            >
            <template v-else>these students?</template>
          </p>
        </div>
      </div>

      <div class="flex justify-between gap-3 mt-6">
        <button
          @click="isOpen = false"
          class="w-full px-4 py-2 rounded-lg border-2 border-blue-400 text-blue-500 font-normal hover:bg-blue-50"
        >
          Cancel
        </button>
        <button
          @click="confirmMultiDelete(multiSelected)"
          class="w-full px-4 py-2 rounded-lg bg-red-500 text-white font-normal hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
