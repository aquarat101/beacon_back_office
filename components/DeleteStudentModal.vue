<script setup>
const { deleted, confirmDelete } = useDevices();
const props = defineProps({
  modelValue: Boolean,
  student: {
    type: Object,
  },
});
const emit = defineEmits(["update:modelValue", "deleted"]);

const schoolId = ref("");
const studentId = ref("");
const isOpen = ref();

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = props.modelValue;
    schoolId.value = props.student.schoolId;
    studentId.value = props.student.studentId;
  }
);
watch(deleted, (val) => {
  if (val) {
    isOpen.value = false;
    emit('deleted', deleted.value);
  }
});
watch(isOpen, (val) => emit("update:modelValue", val));
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
            Delete "{{ student.deviceName }}"?
          </p>
          <p class="text-sm text-gray-600">
            Are you sure you want to delete this student from the system?
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
          @click="confirmDelete(schoolId, studentId)"
          class="w-full px-4 py-2 rounded-lg bg-red-500 text-white font-normal hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
