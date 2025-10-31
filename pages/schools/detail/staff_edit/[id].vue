<script setup>
import { ref, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "~/stores/auth"

const auth = useAuthStore()
const { public: config } = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const staffId = route.params.id
const schoolId = route.query.schoolId

const form = ref({
    id: "",
    name: "",
    email: "",
    phone_number: "",
    role: "",
    school: "", // จะเป็น id หรือ name ก็ได้
    status: "",
})

const schools = ref([])
const schoolName = ref()
const statusOptions = ["Active", "Inactive"]
const isLoading = ref(true)

// ✅ โหลดข้อมูล staff
async function fetchStaffDetail() {
    try {
        const res = await fetch(`${config.apiDomain}/schoolUsers/getUser/${staffId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
        const json = await res.json()
        if (json.success) {
            form.value = json.data
            schoolName.value = json.data.schoolName
        } else {
            console.error("❌ Failed to fetch staff:", json.message)
        }
    } catch (err) {
        console.error("🔥 Error fetching staff:", err)
    }
}

// ✅ โหลดโรงเรียนทั้งหมด
async function fetchSchools() {
    try {
        const res = await fetch(`${config.apiDomain}/schools/getAll`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
        const json = await res.json()
        if (json.success) {
            schools.value = json.data
        } else {
            console.error("❌ Failed to fetch schools:", json.message)
        }
    } catch (err) {
        console.error("🔥 Error fetching schools:", err)
    }
}

// ✅ รอจนทั้ง staff และ schools โหลดเสร็จแล้วค่อย sync ค่าเริ่มต้น
watch(
    [form, schools],
    () => {
        if (form.value.school && schools.value.length > 0) {
            const match = schools.value.find(
                (sc) =>
                    sc.id === form.value.school ||
                    sc.schoolName === form.value.school
            )
            if (match) form.value.school = match.id // เก็บเป็น id เพื่อ consistency
        }
    },
    { deep: true }
)

async function handleSave() {
    try {
        const res = await fetch(`${config.apiDomain}/schoolUsers/updateSchoolUser/${staffId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify(form.value),
        })
        const json = await res.json()
        if (json.success) {
            alert("✅ Updated successfully")
            router.push(`/schools/detail/staff_detail/${staffId}`)
        } else {
            alert("❌ Failed to update: " + json.message)
        }
    } catch (err) {
        console.error("🔥 Error updating staff:", err)
        alert("Error updating staff")
    }
}

const handleCancel = () => {
    router.push({
        path: `/schools/detail/staff_detail/${staffId}`,
        query: { schoolId },
    })
}

function goBack() {
    router.push({
        path: `/schools/detail/staff_detail/${staffId}`,
        query: { schoolId, tab: "staffs" },
    })
}

onMounted(async () => {
    await Promise.all([fetchStaffDetail(), fetchSchools()])
    isLoading.value = false
})
</script>

<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Edit User Detail</h1>
        <button @click="goBack()" class="text-blue-500 mb-4 text-lg">&lt; Back</button>

        <div v-if="isLoading" class="text-gray-500">Loading...</div>

        <div v-else class="bg-white shadow rounded-xl p-6">
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
                    <select v-model="form.schoolName" class="w-full border rounded-lg p-2">
                        <option disabled :value="schoolName">{{ schoolName || "Select" }}</option>
                        <option v-for="sc in schools" :key="sc.id" :value="sc.id">
                            {{ sc.schoolName }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Status</label>
                    <select v-model="form.status" class="w-full border rounded-lg p-2">
                        <option v-for="s in statusOptions" :key="s">{{ s }}</option>
                    </select>
                </div>
            </form>

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
