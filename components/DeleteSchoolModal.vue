<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
    modelValue: Boolean,
    school: {
        type: Object,
        default: () => ({ id: '', name: '' })
    }
})

const emit = defineEmits(['update:modelValue', 'deleted'])

const isOpen = ref(props.modelValue)
watch(() => props.modelValue, val => isOpen.value = val)
watch(isOpen, val => emit('update:modelValue', val))

function close() {
    isOpen.value = false
}

function confirmDelete() {
    // 🔹 ที่นี่จะเรียก API delete จริงได้
    console.log('Deleted school:', props.school)
    emit('deleted', props.school)
    close()
}
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div class="bg-white rounded-xl w-96 p-6 shadow-lg">
            <div class="flex gap-4">
                <img src="/images/trash_red.png" alt="trash" class="bg-red-100 w-16 h-16 p-2 rounded-full">
                
                <div>
                    <p class="text-xl font-bold mb-1 mt-1">Delete?</p>
                    <p class="text-sm">Are you sure, do you want to delete?</p>
                </div>
            </div>

            <div class="flex justify-between gap-3 mt-6">
                <button @click="close" class="w-full px-4 py-2 rounded-lg border-2 border-blue-400 text-blue-500 font-normal">Cancel</button>
                <button @click="confirmDelete" class="w-full px-4 py-2 rounded-lg bg-red-500 text-white font-normal">Delete</button>
            </div>
        </div>
    </div>
</template>
