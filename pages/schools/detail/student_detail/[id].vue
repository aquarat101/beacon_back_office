<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// route params
const route = useRoute()
const router = useRouter()
const staffId = route.params.id

// modal delete
const deleteModalOpen = ref(false)

// mock data
const staff = ref({
    id: staffId,
    name: 'Super Piyo Chan',
    email: 'piyopiyoschool@mail.com',
    phoneNumber: '0123456789',
    role: 'School Admin',
    school: 'Piyo Piyo Elementary School',
    status: 'Active',
})

</script>

<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">School Detail</h1>

        <button @click="router.back()" class="text-blue-500 mb-4 text-lg">&lt; Back</button>

        <!-- Tab content -->
        <div class="bg-white p-6 rounded-xl shadow">
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
                    <img src="/images/edit.png" alt="edit" class="w-5 h-5 mr-1 mt-0.5">
                    Edit
                </button>
            </div>

            <div class="flex flex-col gap-6">
                <img src="/images/layout/logo.png" alt="staff" class="w-24 h-24 rounded-full" />

                <div class="flex-1">
                    <p class="mt-2"><strong>Email</strong> <br> {{ staff.email }}</p>
                    <p class="mt-2"><strong>Phone Number</strong> <br> {{ staff.phoneNumber }}</p>
                    <p class="mt-2"><strong>Role</strong> <br> {{ staff.role }}</p>
                    <p class="mt-2"><strong>School</strong> <br> {{ staff.school }}</p>

                    <button @click="deleteModalOpen = true" class="text-blue-500 font-bold mt-4 underline">
                        Delete Staff
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>