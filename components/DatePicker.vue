<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { getLocalTimeZone, CalendarDate } from "@internationalized/date";

const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const isOpen = ref(false);
const calendarValue = ref<CalendarDate | null>(null);
const emit = defineEmits(["update:modelValue"]);
const props = defineProps<{
    modelValue: string | CalendarDate | null;
    disabled?: boolean
}>();




function clearDateFilter() {
    calendarValue.value = null;
}

function parseDateFromString(dateStr?: string): CalendarDate | null {
    if (!dateStr) return null;
    const parts = dateStr.split("-");
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    return new CalendarDate(year, month, day);
}


function calendarDateToString(calendarDate: CalendarDate): string {
    if (!calendarDate) return "";
    const date = calendarDate.toDate(getLocalTimeZone());
    const day = date.getDate();
    const month = monthShortNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}


const displayValue = computed(() => {
    if (!calendarValue.value) return "";
    return calendarDateToString(calendarValue.value);
});

watch(
    () => props.modelValue,
    (newVal) => {
        if (!newVal) {
            calendarValue.value = null;
        } else if (typeof newVal === "string") {
            calendarValue.value = parseDateFromString(newVal);
        } else {
            calendarValue.value = newVal;
        }
    },
    { immediate: true }
);

watch(calendarValue, (val) => {
    if (!val) {
        emit("update:modelValue", null);
    } else {
        const yyyy = val.year;
        const mm = val.month.toString().padStart(2, "0");
        const dd = val.day.toString().padStart(2, "0");
        emit("update:modelValue", `${yyyy}-${mm}-${dd}`);
    }
});
defineExpose({
    clearDateFilter,
});

</script>

<template>
    <div class="relative">
        <UPopover v-model:open="isOpen">
            <UInput :disabled="disabled" readonly :value="displayValue" placeholder="Select a date"
                trailing-icon="majesticons:calendar-line" size="xl" color="neutral" class="h-[40px] w-full"
                @click="isOpen = true" />
            <template #content>
                <UCalendar color="info" v-model="calendarValue" class="p-2" :disabled="disabled" />
            </template>
        </UPopover>
    </div>
</template>