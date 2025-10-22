<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

const { public: config } = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const staffId = route.params.id

const form = ref({
    id: "",
    name: "",
    email: "",
    phone_number: "",
    role: "",
    school: "",
    status: "",
})

const schoolTypes = ["Piyo Piyo Elementary School", "Privi", "Chonburi"]
const statusOptions = ["Active", "Inactive"]
const isLoading = ref(true)

// ✅ โหลดข้อมูลจาก API
async function fetchStaffDetail() {
    try {
        const res = await fetch(`${config.apiDomain}/schools/getUser/${staffId}`)
        const json = await res.json()
        if (json.success) {
            form.value = json.data
        } else {
            console.error("❌ Failed to fetch staff:", json.message)
        }
    } catch (err) {
        console.error("🔥 Error fetching staff:", err)
    } finally {
        isLoading.value = false
    }
}

// ✅ อัปเดตข้อมูล
async function handleSave() {
    try {
        const res = await fetch(`${config.apiDomain}/schools/updateSchoolUser/${staffId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form.value),
        })
        const json = await res.json()
        if (json.success) {
            alert("✅ Updated successfully")
            // router.push(`/schools/detail/${staffId}`)
        } else {
            alert("❌ Failed to update: " + json.message)
        }
    } catch (err) {
        console.error("🔥 Error updating staff:", err)
        alert("Error updating staff")
    }
}

const handleCancel = () => {
    router.push(`/schools/detail/${staffId}`)
}

onMounted(() => {
    fetchStaffDetail()
})
</script>

<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Edit User Detail</h1>
        <button @click="router.back()" class="text-blue-500 mb-4 text-lg">&lt; Back</button>

        <div v-if="isLoading" class="text-gray-500">Loading...</div>

        <div v-else class="bg-white shadow rounded-xl p-6">
            <!-- Profile -->
            <div class="flex items-center mb-6">
                <div class="relative">
                    <img src="/images/layout/logo.png" alt="logo" class="w-24 h-24 rounded-full border object-cover" />
                    <button class="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded-full shadow">
                        <img src="/images/edit.png" alt="edit" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Form -->
            <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">User ID</label>
                    <input v-model="form.id" type="text" disabled
                        class="w-full border rounded-lg p-2 bg-gray-100 text-gray-400" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Name</label>
                    <input v-model="form.name" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input v-model="form.email" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Phone number</label>
                    <input v-model="form.phone_number" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Role</label>
                    <input v-model="form.role" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">School</label>
                    <select v-model="form.school" class="w-full border rounded-lg p-2">
                        <option v-for="sc in schoolTypes" :key="sc">{{ sc }}</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Status</label>
                    <select v-model="form.status" class="w-full border rounded-lg p-2">
                        <option v-for="s in statusOptions" :key="s">{{ s }}</option>
                    </select>
                </div>
            </form>

            <!-- Buttons -->
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
