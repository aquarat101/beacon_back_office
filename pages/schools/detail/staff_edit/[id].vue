<script setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

// Mock data (จริงๆ ต้อง fetch จาก API ตาม id)
const form = ref({
    id: "00001",
    name: "Piyo Piyo Elementary School",
    email: "superpiyochan@piyopiyo.ac.th",
    phoneNumber: "0123456789",
    role: "School Admin",
    school: "Piyo Piyo Elementary School",
    status: "Active"
})

// Options สำหรับ select
const schoolTypes = ["Piyo Piyo Elementary School", "Privi", "Chonburi"]
const statusOptions = ["Active", "Inactive"]

const handleSave = () => {
    console.log("Saving school:", form.value)
    // TODO: call API update
}

const handleCancel = () => {
    router.push("/schools")
}
</script>

<template>
    <div class="p-6">
        <!-- Header -->
        <h1 class="text-2xl font-bold mb-4">Edit User Detail</h1>

        <button @click="router.back()" class="text-blue-500 mb-4 text-lg">&lt; Back</button>


        <!-- Card -->
        <div class="bg-white shadow rounded-xl p-6">
            <!-- Profile image -->
            <div class="flex items-center mb-6">
                <div class="relative">
                    <img src="/images/layout/logo.png" alt="logo" class="w-24 h-24 rounded-full border object-cover" />
                    <button class="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded-full shadow">
                        <img src="/images/edit.png" alt="edit" class="w-5 h-5">
                    </button>
                </div>
            </div>

            <!-- Form -->
            <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- User ID -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        User ID <span class="text-red-500 font-bold">*</span>
                    </label>
                    <input v-model="form.id" type="text" disabled
                        class="w-full border rounded-lg p-2 bg-gray-100 text-gray-400" />
                </div>

                <!-- Name -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        Name <span class="text-red-500 font-bold">*</span>
                    </label>
                    <input v-model="form.name" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <!-- Email -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        Email <span class="text-red-500 font-bold">*</span>
                    </label>
                    <input v-model="form.email" type="text" class="w-full border rounded-lg p-2" />
                </div>


                <!-- Phone number -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        Phone number <span class="text-red-500 font-bold">*</span>
                    </label>
                    <input v-model="form.phoneNumber" type="text" class="w-full border rounded-lg p-2" />
                </div>


                <!-- Role -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        Role <span class="text-red-500 font-bold">*</span>
                    </label>
                    <input v-model="form.role" type="text" class="w-full border rounded-lg p-2" />
                </div>


                <!-- School -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        School <span class="text-red-500 font-bold">*</span>
                    </label>
                    <select v-model="form.school" class="w-full border rounded-lg p-2">
                        <option v-for="sc in schoolTypes" :key="sc">{{ sc }}</option>
                    </select>
                </div>

                <!-- Status -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        Status <span class="text-red-500 font-bold">*</span>
                    </label>
                    <select v-model="form.status" class="w-full border rounded-lg p-2">
                        <option v-for="s in statusOptions" :key="s">{{ s }}</option>
                    </select>
                </div>
            </form>

            <!-- Footer buttons -->
            <div class="flex justify-end mt-6 gap-2">
                <button type="button" @click="handleCancel"
                    class="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200">
                    Cancel
                </button>
                <button type="button" @click="handleSave"
                    class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                    Save
                </button>
            </div>
        </div>
    </div>
</template>
