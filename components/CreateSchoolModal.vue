<script setup>
import { ref } from "vue"

const props = defineProps({
    modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(["update:modelValue", "created"])

const form = ref({
    schoolName: "",
    schoolType: "",
    educationLevel: ""
})

function closeModal() {
    emit("update:modelValue", false)
}

function createSchool() {
    console.log("✅ Form submitted:", form.value)
    // 👉 เรียก API ได้ที่นี่
    emit("created", form.value)
    closeModal()
}
</script>

<template>
    <div v-if="props.modelValue" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
            <!-- Header -->
            <div class="flex justify-between items-center px-6 py-4 border-b">
                <h2 class="text-lg font-semibold">Create School</h2>
                <button @click="closeModal" class="text-gray-500 hover:text-black text-xl">&times;</button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">School Name<span class="text-red-500">*</span></label>
                    <input v-model="form.schoolName" type="text" placeholder="Search"
                        class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">School Type<span class="text-red-500">*</span></label>
                    <select v-model="form.schoolType"
                        class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none">
                        <option disabled value="">Search</option>
                        <option>Public</option>
                        <option>Private</option>
                        <option>International</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Education Level<span
                            class="text-red-500">*</span></label>
                    <select v-model="form.educationLevel"
                        class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none">
                        <option disabled value="">Search</option>
                        <option>Primary</option>
                        <option>Secondary</option>
                        <option>University</option>
                    </select>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 px-6 py-4 border-t">
                <button @click="closeModal"
                    class="px-6 py-2 border rounded-md text-blue-500 border-blue-300 hover:bg-gray-100">
                    Cancel
                </button>
                <button @click="createSchool" class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Create
                </button>
            </div>
        </div>
    </div>
</template>
