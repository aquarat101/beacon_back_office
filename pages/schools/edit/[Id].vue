<script setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

// Mock data (จริงๆ ต้อง fetch จาก API ตาม id)
const form = ref({
    id: "00001",
    name: "Piyo Piyo Elementary School",
    type: "Public",
    level: "Elementary",
    address: "Piyo Piyo Elementary School",
    city: "Chatuchak",
    province: "Bangkok",
    latitude: "",
    longitude: "",
    postalCode: "10900",
    contact: "0123456789",
    email: "piyopiyoschool@mail.com",
    website: "http://www.piyopiyo.ac.th/",
    status: "Active"
})

// Options สำหรับ select
const schoolTypes = ["Public", "Private"]
const levels = ["Kindergarten", "Elementary", "Secondary", "High School"]
const provinces = ["Bangkok", "Chiang Mai", "Chonburi"]
const cities = ["Chatuchak", "Bang Kapi", "Dusit"]
const postalCodes = ["10900", "10110", "10240"]
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
        <h1 class="text-2xl font-bold mb-4">Edit School Detail</h1>

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
                <!-- School ID -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        School ID <span class="text-red-500 font-bold">*</span>
                    </label>
                    <input v-model="form.id" type="text" disabled
                        class="w-full border rounded-lg p-2 bg-gray-100 text-gray-400" />
                </div>

                <!-- School Name -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        School Name <span class="text-red-500 font-bold">*</span>
                    </label>
                    <input v-model="form.name" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <!-- School Type -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        School Type <span class="text-red-500 font-bold">*</span>
                    </label>
                    <select v-model="form.type" class="w-full border rounded-lg p-2">
                        <option v-for="t in schoolTypes" :key="t">{{ t }}</option>
                    </select>
                </div>

                <!-- Education Level -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        Education Level <span class="text-red-500 font-bold">*</span>
                    </label>
                    <select v-model="form.level" class="w-full border rounded-lg p-2">
                        <option v-for="l in levels" :key="l">{{ l }}</option>
                    </select>
                </div>

                <!-- Address -->
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium mb-1">
                        Address <span class="text-red-500 font-bold">*</span>
                    </label>
                    <textarea v-model="form.address" rows="3" class="w-full border rounded-lg p-2"></textarea>
                </div>

                <!-- City -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        City <span class="text-red-500 font-bold">*</span>
                    </label>
                    <select v-model="form.city" class="w-full border rounded-lg p-2">
                        <option v-for="c in cities" :key="c">{{ c }}</option>
                    </select>
                </div>

                <!-- Province -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        Province <span class="text-red-500 font-bold">*</span>
                    </label>
                    <select v-model="form.province" class="w-full border rounded-lg p-2">
                        <option v-for="p in provinces" :key="p">{{ p }}</option>
                    </select>
                </div>

                <!-- Latitude -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        Latitude <span class="text-red-500 font-bold">*</span>
                    </label>
                    <input v-model="form.latitude" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <!-- Longitude -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        Longitude <span class="text-red-500 font-bold">*</span>
                    </label>
                    <input v-model="form.longitude" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <!-- Postal Code -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        Postal Code <span class="text-red-500 font-bold">*</span>
                    </label>
                    <select v-model="form.postalCode" class="w-full border rounded-lg p-2">
                        <option v-for="z in postalCodes" :key="z">{{ z }}</option>
                    </select>
                </div>

                <!-- Contact Number -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        Contact Number <span class="text-red-500 font-bold">*</span>
                    </label>
                    <input v-model="form.contact" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <!-- Email -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        School Email <span class="text-red-500 font-bold">*</span>
                    </label>
                    <input v-model="form.email" type="email" class="w-full border rounded-lg p-2" />
                </div>

                <!-- Website -->
                <div>
                    <label class="block text-sm font-medium mb-1">
                        Website <span class="text-red-500 font-bold">*</span>
                    </label>
                    <input v-model="form.website" type="text" class="w-full border rounded-lg p-2" />
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
