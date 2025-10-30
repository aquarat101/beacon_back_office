<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DeleteSchoolUserModal from '~/components/DeleteSchoolUserModal.vue'
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const { public: config } = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const staffId = route.params.id

const staff = ref(null)
const deleteModalOpen = ref(false)
const isLoading = ref(true)

// ✅ โหลดข้อมูลจาก API: /schools/getUser/:id
async function getSchoolUser() {
    try {
        const res = await fetch(`${config.apiDomain}/schools/getUser/${staffId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
        const json = await res.json()
        if (json.success) {
            staff.value = json.data
        } else {
            console.error('❌ Failed to fetch user:', json.message)
        }
    } catch (err) {
        console.error('🔥 Error fetching user:', err)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    getSchoolUser()
})

// ✅ หลังจากลบสำเร็จ
function handleDeleted() {
    deleteModalOpen.value = false
    router.push('/schools/detail') // กลับหน้า list
}

</script>

<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">School Detail</h1>

        <button @click="router.back()" class="text-blue-500 mb-4 text-lg">&lt; Back</button>

        <!-- กำลังโหลด -->
        <div v-if="isLoading" class="text-gray-500">Loading...</div>

        <!-- ข้อมูล -->
        <div v-else-if="staff" class="bg-white p-6 rounded-xl shadow">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <div class="flex gap-3">
                        <h2 class="text-xl font-bold">{{ staff.name }}</h2>

                        <div class="flex items-center px-4 rounded-2xl text-white text-sm"
                            :class="staff.status === 'Active' ? 'bg-green-500' : 'bg-red-500'">
                            {{ staff.status }}
                        </div>
                    </div>

                    <div class="text-sm text-gray-500 mt-1">staff ID: {{ staff.id }}</div>
                </div>

                <button class="flex bg-blue-500 text-white px-4 py-2 rounded"
                    @click="$router.push(`/schools/detail/staff_edit/${staff.id}`)">
                    <img src="/images/edit.png" alt="edit" class="w-5 h-5 mr-1 mt-0.5" />
                    Edit
                </button>
            </div>

            <div class="flex flex-col gap-6">
                <img src="/images/layout/logo.png" alt="staff" class="w-24 h-24 rounded-full" />

                <div class="flex-1">
                    <p class="mt-2"><strong>Email</strong><br />{{ staff.email }}</p>
                    <p class="mt-2"><strong>Phone Number</strong><br />{{ staff.phone_number }}</p>
                    <p class="mt-2"><strong>Role</strong><br />{{ staff.role }}</p>
                    <p class="mt-2"><strong>School</strong><br />{{ staff.school }}</p>

                    <button @click="deleteModalOpen = true" class="text-blue-500 font-bold mt-4 underline">
                        Delete Staff
                    </button>
                </div>
            </div>
        </div>

        <!-- modal -->
        <DeleteSchoolUserModal v-model="deleteModalOpen" :schoolUser="staff" @deleted="handleDeleted" />
    </div>
</template>
