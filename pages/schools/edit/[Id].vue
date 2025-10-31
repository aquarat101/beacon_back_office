<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const { public: config } = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const schoolId = route.params.id
const loading = ref(false)
const saving = ref(false)
const form = ref(null)

// dropdown options
const schoolTypes = ["Public", "Private"]
const levels = ["Elementary", "Middle", "High"]
const provinces = ["Bangkok", "Chiang Mai", "Chonburi"]
const cities = ["Ladprao", "Bang Kapi", "Dusit"]
const postalCodes = ["10230", "10110", "10240"]
const statusOptions = ["Active", "Inactive"]

// 🔹 ดึงข้อมูลโรงเรียนตาม id
const fetchSchool = async () => {
    try {
        loading.value = true
        const res = await fetch(`${config.apiDomain}/schools/get/${schoolId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
        const data = await res.json() // ✅ แปลง response เป็น JSON

        form.value = {
            id: data.data.id,
            name: data.data.schoolName,
            type: data.data.schoolType,
            level: data.data.educationLevel,
            address: data.data.address,
            city: data.data.city,
            province: data.data.province,
            latitude: data.data.latitude,
            longitude: data.data.longtitude,
            postalCode: data.data.postalCode,
            contact: data.data.contactNumber,
            email: data.data.schoolEmail,
            website: data.data.website,
            status: data.data.status
        }
    } catch (error) {
        console.error("❌ Error fetching school:", error)
        alert("Failed to load school details")
    } finally {
        loading.value = false
    }
}

const handleSave = async () => {
    try {
        saving.value = true
        const payload = {
            schoolName: form.value.name,
            schoolType: form.value.type,
            educationLevel: form.value.level,
            address: form.value.address,
            city: form.value.city,
            province: form.value.province,
            latitude: form.value.latitude,
            longtitude: form.value.longitude,
            postcode: form.value.postalCode,
            contactNumber: form.value.contact,
            schoolEmail: form.value.email,
            website: form.value.website,
            status: form.value.status
        }

        const response = await fetch(`${config.apiDomain}/schools/update/${form.value.id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify(payload)
        })

        const res = await response.json()

        if (res.success) {
            alert("✅ School updated successfully!")
            router.push("/schools")
        } else {
            alert("❌ Failed to update school")
        }
    } catch (error) {
        console.error("❌ Error updating school:", error)
        alert("Failed to update school")
    } finally {
        saving.value = false
    }
}


const handleCancel = () => {
    router.push("/schools")
}

onMounted(() => {
    fetchSchool()
})

function goBack() {
    router.push({
        path: `/schools/detail/${schoolId}`,
        query: {
            tab: "info"
        }
    })
}
</script>

<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Edit School Detail</h1>
        <button @click="goBack()" class="text-blue-500 mb-4 text-lg">&lt; Back</button>

        <div v-if="loading" class="text-center text-gray-500 py-20">Loading school details...</div>

        <div v-else-if="form" class="bg-white shadow rounded-xl p-6">
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
                    <label class="block text-sm font-medium mb-1">School ID</label>
                    <input v-model="form.id" type="text" disabled
                        class="w-full border rounded-lg p-2 bg-gray-100 text-gray-400" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">School Name</label>
                    <input v-model="form.name" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">School Type</label>
                    <select v-model="form.type" class="w-full border rounded-lg p-2">
                        <option v-for="t in schoolTypes" :key="t">{{ t }}</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Education Level</label>
                    <select v-model="form.level" class="w-full border rounded-lg p-2">
                        <option v-for="l in levels" :key="l">{{ l }}</option>
                    </select>
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium mb-1">Address</label>
                    <textarea v-model="form.address" rows="3" class="w-full border rounded-lg p-2"></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">City</label>
                    <select v-model="form.city" class="w-full border rounded-lg p-2">
                        <option v-for="c in cities" :key="c">{{ c }}</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Province</label>
                    <select v-model="form.province" class="w-full border rounded-lg p-2">
                        <option v-for="p in provinces" :key="p">{{ p }}</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Latitude</label>
                    <input v-model="form.latitude" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Longitude</label>
                    <input v-model="form.longitude" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Postal Code</label>
                    <select v-model="form.postalCode" class="w-full border rounded-lg p-2">
                        <option v-for="z in postalCodes" :key="z">{{ z }}</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Contact Number</label>
                    <input v-model="form.contact" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">School Email</label>
                    <input v-model="form.email" type="email" class="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Website</label>
                    <input v-model="form.website" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Status</label>
                    <select v-model="form.status" class="w-full border rounded-lg p-2">
                        <option v-for="s in statusOptions" :key="s">{{ s }}</option>
                    </select>
                </div>
            </form>

            <!-- Footer -->
            <div class="flex justify-end mt-6 gap-2">
                <button type="button" @click="handleCancel"
                    class="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200">Cancel</button>
                <button type="button" @click="handleSave" :disabled="saving"
                    class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                    {{ saving ? 'Saving...' : 'Save' }}
                </button>
            </div>
        </div>
    </div>
</template>
