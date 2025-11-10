<template>
  <VueDatePicker
    v-model="selectDate"
    class="max-w-[250px] border rounded-lg"
    :format="formatDate"
    :enable-time-picker="true"
    :placeholder="placeholder"
  />
  <slot></slot>
</template>

<script setup>
import dayjs from "dayjs";
import { VueDatePicker } from "@vuepic/vue-datepicker";

const props = defineProps({
  modelValue: {
    type: [Date, String, null],
    default: null,
  },
  placeholder: {
    type: String,
    default: "Select Date",
  },
});

const emit = defineEmits(["update:modelValue"]);

const selectDate = ref(props.modelValue);

const formatDate = (date) => (date ? dayjs(date).format("MM/DD/YYYY, h:mm A") : "");

watch(selectDate, (val) => {
  emit("update:modelValue", val);
});

watch(
  () => props.modelValue,
  (val) => {
    selectDate.value = val;
  }
);
</script>

<style scoped></style>
