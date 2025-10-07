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

const isLoading = ref(false)

function closeModal() {
    emit("update:modelValue", false)
}

async function createSchool() {
    if (!form.value.schoolName || !form.value.schoolType || !form.value.educationLevel) {
        alert("Please fill all required fields")
        return
    }

    try {
        isLoading.value = true

        const res = await fetch("http://localhost:3001/schools/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form.value)
        })

        const data = await res.json()

        if (res.ok && data.success) {
            emit("created", data.data)
            closeModal()
        } else {
            alert(data.message || "Failed to create school")
        }
    } catch (err) {
        console.error("❌ Error creating school:", err)
        alert("Error creating school")
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div v-if="props.modelValue"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md relative">

            <!-- Loading overlay -->
            <div v-if="isLoading"
                class="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-lg">
                <div class="loader border-t-4 border-blue-500 rounded-full w-10 h-10 animate-spin mb-3"></div>
                <p class="text-gray-600">Creating School...</p>
            </div>

            <!-- Header -->
            <div class="flex justify-between items-center px-6 py-4 border-b">
                <h2 class="text-lg font-semibold">Create School</h2>
                <button @click="closeModal" class="text-gray-500 hover:text-black text-xl">&times;</button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">School Name<span class="text-red-500">*</span></label>
                    <input v-model="form.schoolName" type="text"
                        class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">School Type<span class="text-red-500">*</span></label>
                    <select v-model="form.schoolType"
                        class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none">
                        <option disabled value="">Select Type</option>
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
                        <option disabled value="">Select Level</option>
                        <option>Elementary</option>
                        <option>Middle</option>
                        <option>High</option>
                    </select>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end px-6 py-4 border-t">
                <button @click="closeModal" class="px-4 py-2 mr-3 border rounded-md">Cancel</button>
                <button @click="createSchool" class="px-4 py-2 bg-color-main2 hover:bg-blue-600 text-white rounded-md">
                    Create
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.loader {
    border: 4px solid #ddd;
    border-top-color: #3b82f6;
}
</style>
