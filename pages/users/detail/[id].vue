<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DeleteSchoolUserModal from '~/components/DeleteSchoolUserModal.vue'

const { public: config } = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const userId = route.params.id

const deleteModalOpen = ref(false)
const user = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

async function fetchUser() {
    try {
        const res = await fetch(`${config.apiDomain}/schools/getUser/${userId}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        user.value = data.data || null
    } catch (err) {
        console.error(err)
        errorMessage.value = 'Failed to load user data'
    } finally {
        isLoading.value = false
    }
}

function handleDeleted() {
    alert('User deleted successfully.')
    router.push('/users')
}

onMounted(fetchUser)
</script>

<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">User Detail</h1>
        <button @click="router.back()" class="text-blue-500 mb-4 text-lg">&lt; Back</button>

        <div v-if="isLoading" class="text-gray-500">Loading...</div>
        <div v-else-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>

        <div v-else-if="user" class="bg-white p-6 rounded-xl shadow relative">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-xl font-bold">{{ user.name }}</h2>
                    <div class="text-sm text-gray-500 mt-1">user ID: {{ user.id }}</div>
                </div>

                <button class="flex bg-blue-500 text-white px-4 py-2 rounded"
                    @click="$router.push(`/users/edit/${user.id}`)">
                    <img src="/images/edit.png" alt="edit" class="w-5 h-5 mr-1 mt-0.5" />
                    Edit
                </button>
            </div>

            <div class="flex flex-col gap-6">
                <img :src="user.avatar || '/image-avatars/1.png'" alt="user" class="w-24 h-24 rounded-full" />

                <div class="flex-1">
                    <p class="mt-2">
                        <strong>Email</strong><br />
                        <span class="text-gray-600">{{ user.email }}</span>
                    </p>

                    <p class="mt-2">
                        <strong>Phone Number</strong><br />
                        <span class="text-gray-600">{{ user.phone_number }}</span>
                    </p>

                    <p class="mt-2">
                        <strong>Role</strong><br />
                        <span class="text-gray-600">{{ user.role }}</span>
                    </p>

                    <p class="mt-2">
                        <strong>School</strong><br />
                        <span class="text-gray-600">{{ user.school }}</span>
                    </p>

                    <button @click="deleteModalOpen = true" class="text-blue-500 font-semibold mt-6 underline">
                        Delete User
                    </button>
                </div>
            </div>
        </div>

        <!-- ✅ Modal -->
        <DeleteSchoolUserModal v-model="deleteModalOpen" :schoolUser="user" @deleted="handleDeleted" />
    </div>
</template>
