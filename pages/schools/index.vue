<script setup>
import { ref, computed, onMounted } from "vue"
import CreateSchoolModal from "~/components/CreateSchoolModal.vue"
import AddSchoolModal from "~~/components/AddSchoolModal.vue"
import DeleteSchoolModal from "~~/components/DeleteSchoolModal.vue"

const { public: config } = useRuntimeConfig()

const isCreateSchoolModalOpen = ref(false)
const isAddSchoolModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isLoading = ref(false)
const schools = ref([])

// โรงเรียนที่เลือกจะลบ
const selectedSchoolId = ref("")
const selectedSchoolName = ref("")

// Input state (ยังไม่ filter)
const searchQueryInput = ref("")
const filterTypeInput = ref("")
const filterLevelInput = ref("")
const filterStatusInput = ref("")

// Active filters (เอาไปคำนวณ filteredSchools)
const activeSearchQuery = ref("")
const activeFilterType = ref("")
const activeFilterLevel = ref("")
const activeFilterStatus = ref("")

function handleCreated(data) {
    console.log("🎉 School created:", data)
    fetchSchools()
}

function handleAdded(data) {
    console.log("🎉 School added:", data)
}

function handleDeleted(deletedSchool) {
    console.log("Deleted:", deletedSchool)
    fetchSchools()
}

// Fetch schools from API
async function fetchSchools() {
    try {
        isLoading.value = true
        const res = await fetch(`${config.apiDomain}/schools/getAll`)
        const json = await res.json()
        if (json.success) {
            schools.value = json.data
        } else {
            console.error("❌ Failed to fetch schools")
        }
    } catch (err) {
        console.error("🔥 Error fetching schools:", err)
    } finally {
        isLoading.value = false
    }
}

// Load on mounted
onMounted(fetchSchools)

// Filtered schools based on **active filters**
const filteredSchools = computed(() => {
    return schools.value.filter(school => {
        const matchesSearch =
            !activeSearchQuery.value ||
            school.schoolName.toLowerCase().includes(activeSearchQuery.value.toLowerCase())

        const matchesType =
            !activeFilterType.value || school.schoolType === activeFilterType.value

        const matchesLevel =
            !activeFilterLevel.value || school.educationLevel === activeFilterLevel.value

        const matchesStatus =
            !activeFilterStatus.value || school.status === activeFilterStatus.value

        return matchesSearch && matchesType && matchesLevel && matchesStatus
    })
})

// Pagination
const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(filteredSchools.value.length / pageSize))
const paginatedSchools = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredSchools.value.slice(start, start + pageSize)
})

const pageNumbers = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value
    if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        if (current <= 3) pages.push(1, 2, 3, 4, 5, "...", total)
        else if (current >= total - 2)
            pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total)
        else pages.push(1, "...", current - 1, current, current + 1, "...", total)
    }
    return pages
})

function goToPage(page) {
    if (page === "...") return
    if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// Trigger search (คัดลอกค่า input ไป active filter แล้ว reset page)
function handleSearch() {
    activeSearchQuery.value = searchQueryInput.value
    activeFilterType.value = filterTypeInput.value
    activeFilterLevel.value = filterLevelInput.value
    activeFilterStatus.value = filterStatusInput.value
    currentPage.value = 1
}

// เปิด modal delete พร้อมส่ง school
function confirmDelete(school) {
    selectedSchoolId.value = school.id
    selectedSchoolName.value = school.schoolName
    isDeleteModalOpen.value = true
}
</script>


<template>
    <div class="p-6 relative">
        <!-- Overlay Loading -->
        <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 flex flex-col items-center shadow-lg w-64">
                <div class="loader border-t-4 border-blue-500 rounded-full w-10 h-10 mb-3 animate-spin"></div>
                <p class="text-gray-700 text-center font-medium">Loading schools...</p>
            </div>
        </div>

        <!-- Page Title -->
        <h1 class="text-4xl font-bold mb-6 ml-2 mt-2">Schools</h1>

        <!-- Search & Filters -->
        <div class="bg-white p-4 rounded-xl shadow mb-4">
            <div class="flex flex-wrap gap-3 items-center">
                <input v-model="searchQueryInput" type="text" placeholder="Search by name"
                    class="border rounded-lg px-3 py-2 flex-1" />

                <select v-model="filterTypeInput" class="border rounded-lg px-3 py-2 pr-16">
                    <option value="">All Types</option>
                    <option>Public</option>
                    <option>Private</option>
                    <option>International</option>
                </select>

                <select v-model="filterLevelInput" class="border rounded-lg px-3 py-2 pr-16">
                    <option value="">All Levels</option>
                    <option>Elementary</option>
                    <option>Middle</option>
                    <option>High</option>
                </select>

                <select v-model="filterStatusInput" class="border rounded-lg px-3 py-2 pr-16">
                    <option value="">All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>

                <button @click="handleSearch"
                    class="bg-color-main2 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Search</button>
            </div>

            <div class="flex gap-3 mt-4">
                <button @click="isCreateSchoolModalOpen = true"
                    class="bg-color-main2 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                    + Create School
                </button>
                <button @click="isAddSchoolModalOpen = true"
                    class="flex items-center gap-1 bg-color-main2 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                    <img src="/images/person_plus.png" alt="person_plus" class="w-4 h-4"> Add School Admin
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
                        <th class="p-3 text-center">School ID</th>
                        <th class="p-3 text-center">School Name</th>
                        <th class="p-3 text-center">School Type</th>
                        <th class="p-3 text-center">Education Level</th>
                        <th class="p-3 text-center">Devices (Students)</th>
                        <th class="p-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="school in paginatedSchools" :key="school.id" class="border-t hover:bg-gray-50">
                        <td class="p-3"><input type="checkbox" /></td>
                        <td class="p-3 text-center">
                            <div class="flex justify-center gap-2">
                                <button class="bg-color-main3 text-white px-2 py-1 rounded"
                                    @click="$router.push(`/schools/detail/${school.id}`)">
                                    <img src="/images/eye.png" alt="eye" class="w-5 h-5" />
                                </button>
                                <button class="bg-color-main3 text-white px-2 py-1 rounded"
                                    @click="$router.push(`/schools/edit/${school.id}`)">
                                    <img src="/images/edit.png" alt="edit" class="w-5 h-5" />
                                </button>
                                <button class="bg-color-main-red text-white px-2 py-1 rounded"
                                    @click="confirmDelete(school)">
                                    <img src="/images/trash.png" alt="delete" class="w-5 h-5" />
                                </button>
                            </div>
                        </td>

                        <td class="p-3 text-center">{{ school.id }}</td>
                        <td class="p-3 text-center">{{ school.schoolName }}</td>
                        <td class="p-3 text-center">{{ school.schoolType }}</td>
                        <td class="p-3 text-center">{{ school.educationLevel }}</td>
                        <td class="p-3 text-center">{{ school.devices }}</td>
                        <td class="p-3 text-center">
                            <span class="px-4 py-1 rounded-full text-white text-sm"
                                :class="school.status === 'Active' ? 'bg-green-500' : 'bg-color-main-red'">
                                {{ school.status }}
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

        <CreateSchoolModal v-model="isCreateSchoolModalOpen" @created="handleCreated" />
        <AddSchoolModal v-model="isAddSchoolModalOpen" @added="handleAdded" />
        <DeleteSchoolModal v-model="isDeleteModalOpen"
            :school="{ id: selectedSchoolId, schoolName: selectedSchoolName }" @deleted="handleDeleted" />
    </div>
</template>

<style scoped>
.loader {
    border: 4px solid #f3f3f3;
    border-top-color: #3b82f6;
    border-radius: 50%;
}
</style>
