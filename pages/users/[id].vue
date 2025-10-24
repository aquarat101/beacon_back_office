<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CreateSchoolModal from "~/components/CreateSchoolModal.vue"
import AddSchoolAdminModal from "~/components/AddSchoolAdminModal.vue"
import DeleteSchoolUserModal from '~/components/DeleteSchoolUserModal.vue'
import DeleteSchoolUserMultiModal from '~/components/DeleteSchoolUserMultiModal.vue'

const { public: config } = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const schoolId = route.params.id

const selectedSchoolUserId = ref("")
const selectedSchoolUserName = ref("")

// ✅ modal states
const isCreateSchoolModalOpen = ref(false)
const isAddSchoolAdminModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

// ✅ data state
const staffs = ref([])
const isLoading = ref(false)
const errorMessage = ref("")
const searchQuery = ref("") // ช่องค้นหาที่พิมพ์อยู่
const activeSearchQuery = ref("") // ค่าที่จะใช้ filter จริง (หลังจากกด Search)

// ✅ pagination
const currentPage = ref(1)
const pageSize = 10

// ✅ ฟิลเตอร์ตามชื่อ (ใช้ activeSearchQuery แทน)
const filteredStaffs = computed(() => {
    if (!activeSearchQuery.value.trim()) return staffs.value
    return staffs.value.filter(staff =>
        staff.name?.toLowerCase().includes(activeSearchQuery.value.toLowerCase())
    )
})

// ✅ pagination slice
const totalPages = computed(() => Math.ceil(filteredStaffs.value.length / pageSize))
const paginatedStaffs = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredStaffs.value.slice(start, start + pageSize)
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

// ---------------- Selection ----------------
const selectedUsers = ref([])

const allUsersSelected = computed({
    get: () =>
        paginatedStaffs.value.length > 0 &&
        paginatedStaffs.value.every(u => selectedUsers.value.includes(u.id)),
    set: val => {
        const ids = paginatedStaffs.value.map(u => u.id)
        if (val) selectedUsers.value = Array.from(new Set([...selectedUsers.value, ...ids]))
        else selectedUsers.value = selectedUsers.value.filter(id => !ids.includes(id))
    }
})

function toggleUserSelection(id) {
    if (selectedUsers.value.includes(id))
        selectedUsers.value = selectedUsers.value.filter(i => i !== id)
    else selectedUsers.value.push(id)
}

// ---------------- Multi Delete ----------------
const deleteMultiModalOpen = ref(false)
const selectedUsersForDelete = computed(() =>
    staffs.value.filter(u => selectedUsers.value.includes(u.id))
)

function confirmDeleteSelected() {
    if (selectedUsers.value.length === 0) return
    deleteMultiModalOpen.value = true
}

function handleDeletedMulti() {
    staffs.value = staffs.value.filter(u => !selectedUsers.value.includes(u.id))
    selectedUsers.value = []
}


// ✅ fetch API
async function fetchSchoolUsers() {
    try {
        isLoading.value = true
        const res = await fetch(`${config.apiDomain}/schools/getAllUserById/${schoolId}`)
        if (!res.ok) throw new Error("Failed to fetch school users")

        const data = await res.json()
        staffs.value = data.data || []
    } catch (err) {
        console.error("❌ Fetch error:", err)
        errorMessage.value = err.message
    } finally {
        isLoading.value = false
    }
}

// ✅ เมื่อกดปุ่ม Search
function handleSearch() {
    activeSearchQuery.value = searchQuery.value.trim()
    currentPage.value = 1
}

// ✅ modal handlers
function handleCreated() {
    fetchSchoolUsers()
}

function handleAdded() {
    fetchSchoolUsers()
}

function handleDeleted() {
    fetchSchoolUsers()
}

function confirmDelete(staff) {
    selectedSchoolUserId.value = staff.id
    selectedSchoolUserName.value = staff.name
    isDeleteModalOpen.value = true
}

onMounted(() => {
    fetchSchoolUsers()
})
</script>

<template>
    <div>
        <div class="p-6">
            <h1 class="text-4xl font-bold mb-6 ml-2 mt-2">Users</h1>

            <!-- Search & Filters -->
            <div class="bg-white p-4 rounded-xl shadow mb-4">
                <div class="flex flex-wrap gap-3 items-center">
                    <input v-model="searchQuery" type="text" placeholder="Search by name"
                        class="border rounded-lg px-3 py-2 flex-1" />

                    <button @click="handleSearch"
                        class="bg-color-main2 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Search
                    </button>
                </div>

                <div class="flex gap-3 mt-4">
                    <button @click="isAddSchoolAdminModalOpen = true"
                        class="flex items-center gap-1 bg-color-main2 text-white px-4 py-2 rounded-lg">
                        <img src="/images/person_plus.png" alt="person_plus" class="w-4 h-4" />
                        Add School Admin
                    </button>

                    <button @click="confirmDeleteSelected"
                        class="flex items-center gap-1 bg-color-main-red text-white px-4 py-2 rounded-lg">
                        <img src="/images/trash.png" alt="trash" class="w-5 h-5" />
                        Delete ({{ selectedUsers.length }})
                    </button>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white rounded-xl shadow overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-3"><input type="checkbox" v-model="allUsersSelected" /></th>
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
                            <td class="p-3">
                                <input type="checkbox" :checked="selectedUsers.includes(staff.id)"
                                    @change="toggleUserSelection(staff.id)" />
                            </td>

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
                                        : 'bg-color-main-red text-white'">
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
                                    : 'bg-white text-color-main2'" @click="goToPage(page)">
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
        <DeleteSchoolUserMultiModal v-model="deleteMultiModalOpen" :schoolUsers="selectedUsersForDelete"
            @deleted="handleDeletedMulti" />

    </div>
</template>
