<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CreateSchoolModal from "~/components/CreateSchoolModal.vue"
import AddSchoolAdminModal from "~/components/AddSchoolAdminModal.vue"
import DeleteSchoolUserModal from '~/components/DeleteSchoolUserModal.vue'

const { public: config } = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const selectedSchoolUserId = ref("")
const selectedSchoolUserName = ref("")

// ✅ state ของ modal
const isCreateSchoolModalOpen = ref(false)
const isAddSchoolAdminModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

// ✅ staff list (จะมาจาก API)
const staffs = ref([])
const isLoading = ref(false)
const errorMessage = ref("")

// ✅ pagination
const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(staffs.value.length / pageSize))

// ✅ pagination slice
const paginatedStaffs = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return staffs.value.slice(start, start + pageSize)
})

// ✅ สร้างเลขหน้า
const pageNumbers = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else if (current <= 3) {
        pages.push(1, 2, 3, 4, 5, "...", total)
    } else if (current >= total - 2) {
        pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total)
    } else {
        pages.push(1, "...", current - 1, current, current + 1, "...", total)
    }
    return pages
})

function goToPage(page) {
    if (page === "...") return
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

// ✅ ฟังก์ชันดึงข้อมูลจาก API
async function fetchSchoolUsers() {
    try {
        isLoading.value = true
        const res = await fetch(`${config.apiDomain}/schools/getAllUser`)
        if (!res.ok) throw new Error("Failed to fetch school users")

        const data = await res.json()
        // สมมติ backend ส่งเป็น { data: [...] }
        staffs.value = data.data || []
    } catch (err) {
        console.error("❌ Fetch error:", err)
        errorMessage.value = err.message
    } finally {
        isLoading.value = false
    }
}

// ✅ lifecycle
onMounted(() => {
    fetchSchoolUsers()
})

// ✅ modal events
function handleCreated(data) {
    console.log("🎉 School created:", data)
    fetchSchoolUsers() // refresh list
}

function handleAdded(data) {
    console.log("🎉 School added:", data)
    fetchSchoolUsers()
}

function handleDeleted() {
    console.log("Deleted")
    fetchSchoolUsers()
}

function confirmDelete(staff) {
    selectedSchoolUserId.value = staff.id
    selectedSchoolUserName.value = staff.name
    isDeleteModalOpen.value = true
    console.log(selectedSchoolUserId.value, selectedSchoolUserName.value)
}

</script>


<template>
    <div>
        <div class="p-6">
            <!-- Page Title -->
            <h1 class="text-4xl font-bold mb-6 ml-2 mt-2">Users</h1>

            <!-- Search & Filters -->
            <div class="bg-white p-4 rounded-xl shadow mb-4">
                <div class="flex flex-wrap gap-3 items-center">
                    <input type="text" placeholder="Search" class="border rounded-lg px-3 py-2 flex-1" />

                    <select class="border rounded-lg px-3 py-2 pr-20">
                        <option>Role</option>
                        <option>Admin</option>
                        <option>Staff</option>
                        <option>User</option>
                    </select>

                    <select class="border rounded-lg px-3 py-2 pr-16">
                        <option>Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>

                    <button class="bg-color-main2 text-white px-4 py-2 rounded-lg">
                        Search
                    </button>
                </div>

                <div class="flex gap-3 mt-4">
                    <button @click="isAddSchoolAdminModalOpen = true"
                        class="flex items-center gap-1 bg-color-main2 text-white px-4 py-2 rounded-lg">
                        <img src="/images/person_plus.png" alt="person_plus" class="w-4 h-4">
                        Add School Admin
                    </button>

                    <button @click="isDeleteModalOpen = true"
                        class="flex items-center gap-1 bg-color-main-red text-white px-4 py-2 rounded-lg">
                        <img src="/images/trash.png" alt="trash" class="w-5 h-5">
                        Delete
                    </button>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white rounded-xl shadow overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-3"><input type="checkbox" /></th>
                            <th class="p-3 text-center">Action</th>
                            <th class="p-3 text-center">Name</th>
                            <th class="p-3 text-center">Email</th>
                            <th class="p-3 text-center">Phone number</th>
                            <th class="p-3 text-center">Role</th>
                            <th class="p-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="staff in paginatedStaffs" :key="staff.id" class="border-t hover:bg-gray-50">
                            <td class="p-3"><input type="checkbox" /></td>

                            <!-- Action buttons -->
                            <td class="p-3 text-center">
                                <div class="flex justify-center gap-2">
                                    <button class="bg-color-main3 text-white px-2 py-1 rounded"
                                        @click="$router.push(`/users/detail/${staff.id}`)">
                                        <img src="/images/eye.png" alt="eye" class="w-5 h-5" />
                                    </button>

                                    <button class="bg-color-main3 text-white px-2 py-1 rounded"
                                        @click="$router.push(`/users/edit/${staff.id}`)">
                                        <img src="/images/edit.png" alt="edit" class="w-5 h-5" />
                                    </button>

                                    <button class="bg-color-main-red text-white px-2 py-1 rounded"
                                        @click="confirmDelete(staff)">
                                        <img src="/images/trash.png" alt="delete" class="w-5 h-5" />
                                    </button>
                                </div>
                            </td>

                            <td class="p-3 text-center">{{ staff.name }}</td>
                            <td class="p-3 text-center">{{ staff.email }}</td>
                            <td class="p-3 text-center">{{ staff.phone_number }}</td>
                            <td class="p-3 text-center">{{ staff.role }}</td>

                            <td class="p-3 text-center">
                                <span class="px-4 py-1 rounded-full text-sm" :class="staff.status === 'Active'
                                    ? 'bg-green-500 text-white'
                                    : staff.status === 'Pending'
                                        ? 'bg-color-main-yellow text-black'
                                        : 'bg-color-main-red text-white '
                                    ">
                                    {{ staff.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination -->
                <div class="flex justify-end items-center p-4">
                    <button class="text-color-main2 disabled:text-gray-600" :disabled="currentPage === 1"
                        @click="goToPage(currentPage - 1)">
                        &lt; Previous
                    </button>

                    <div class="flex gap-2 px-8">
                        <button v-for="page in pageNumbers" :key="page + '-btn'" class="px-3 py-1 rounded"
                            :disabled="page === '...'" :class="page === currentPage
                                ? 'bg-blue-500 text-white'
                                : page === '...'
                                    ? 'bg-transparent text-gray-500 cursor-default'
                                    : 'bg-white text-color-main2'
                                " @click="goToPage(page)">
                            {{ page }}
                        </button>
                    </div>

                    <button class="text-color-main2 disabled:text-gray-600" :disabled="currentPage === totalPages"
                        @click="goToPage(currentPage + 1)">
                        Next &gt;
                    </button>
                </div>

            </div>
        </div>

        <CreateSchoolModal v-model="isCreateSchoolModalOpen" @created="handleCreated" />
        <AddSchoolAdminModal v-model="isAddSchoolAdminModalOpen" @added="handleAdded" />
        <DeleteSchoolUserModal v-model="isDeleteModalOpen"
            :schoolUser="{ id: selectedSchoolUserId, name: selectedSchoolUserName }" @deleted="handleDeleted" />
    </div>
</template>