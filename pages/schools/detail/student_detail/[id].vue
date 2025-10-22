<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { public: config } = useRuntimeConfig()

const kidId = route.params.id
const schoolId = route.query.schoolId

const kid = ref(null)
const user = ref(null)
const schoolName = ref(null)
const deleteModalOpen = ref(false)
const deleting = ref(false) // สำหรับ loading state ขณะลบ

// Fetch kid info
const fetchKid = async () => {
    try {
        const res = await fetch(`${config.apiDomain}/kids/getKidByKidId/${kidId}`)
        const result = await res.json()
        kid.value = {
            ...result,
            status: result.status || 'Inactive'
        }

        const resUser = await fetch(`${config.apiDomain}/users/get/${kid.value.userId}`)
        const resultUser = await resUser.json()
        user.value = resultUser
    } catch (error) {
        console.error("Error fetching kid:", error)
        kid.value = null
    }
}

// Fetch school name
const fetchSchoolName = async () => {
    try {
        const res = await fetch(`${config.apiDomain}/schools/get/${schoolId}`)
        const result = await res.json()
        schoolName.value = result.data.schoolName
    } catch (error) {
        console.error("Error fetching school:", error)
        schoolName.value = '-'
    }
}

function handleDelete() {
    deleteModalOpen.value = false
    // router.push("/schools/detail/student_detail")
}


onMounted(() => {
    fetchKid()
    fetchSchoolName()
})
</script>

<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">School Detail</h1>

        <button @click="router.back()" class="text-blue-500 mb-4 text-lg">&lt; Back</button>

        <div v-if="kid" class="bg-white p-6 rounded-xl shadow">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <div class="flex gap-3">
                        <h2 class="text-xl font-bold">{{ kid?.name || '-' }}</h2>

                        <div class="flex items-center px-4 rounded-2xl text-white text-sm"
                            :class="kid?.status === 'Active' ? 'bg-green-500' : 'bg-red-500'">
                            {{ kid?.status || 'Inactive' }}
                        </div>
                    </div>

                    <div class="text-sm text-gray-500 mt-1">kid ID: {{ kid?.id || '-' }}</div>
                </div>
            </div>

            <div class="flex flex-col gap-6">
                <img src="/images/layout/logo.png" alt="kid" class="w-24 h-24 rounded-full" />

                <div class="flex-1">
                    <p class="mt-2"><strong>Parent Name</strong> <br> {{ user?.firstName || '-' }}</p>
                    <p class="mt-2"><strong>Parent Email</strong> <br> {{ user?.email || '-' }}</p>
                    <p class="mt-2"><strong>Parent Phone Number</strong> <br> {{ user?.phone || '-' }}</p>
                    <p class="mt-2"><strong>School</strong> <br> {{ schoolName || '-' }}</p>
                    <p class="mt-2"><strong>Remark</strong> <br> {{ kid?.remark || '-' }}</p>

                    <button @click="deleteModalOpen = true" class="text-blue-500 font-bold underline mt-2">
                        Delete Kid
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="text-gray-500">Loading kid info...</div>

        <DeleteKidModal v-if="kid" v-model="deleteModalOpen" :kid="{ id: kid.id, name: kid.name }"
            @deleted="handleDelete" />

    </div>
</template>
