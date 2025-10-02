<script setup>
import { ref, computed } from "vue"
import CreateSchoolModal from "~/components/CreateSchoolModal.vue"
import AddSchoolModal from "~~/components/AddSchoolModal.vue"
import DeleteSchoolModal from "~~/components/DeleteSchoolModal.vue"

const isCreateSchoolModalOpen = ref(false)
const isAddSchoolModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

function handleCreated(data) {
    console.log("🎉 School created:", data)
    // 👉 เช่น push ลง list หรือ refetch API ได้เลย
}

function handleAdded(data) {
    console.log("🎉 School added:", data)
}

function handleDeleted() {
    console.log("Deleted")
}

// mock data 90 โรงเรียน
const schools = Array.from({ length: 90 }, (_, i) => ({
    id: String(i + 1).padStart(5, "0"),
    name: `School ${i + 1}`,
    type: i % 3 === 0 ? "Public" : i % 3 === 1 ? "Private" : "International",
    level: i % 3 === 0 ? "Elementary" : i % 3 === 1 ? "Middle" : "High",
    devices: Math.floor(Math.random() * 1500) + 100,
    status: i % 2 === 0 ? "Active" : "Inactive",
}))

const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(schools.length / pageSize))

const paginatedSchools = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return schools.slice(start, start + pageSize)
})

// ✅ ฟังก์ชันสร้าง page numbers + ...
const pageNumbers = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 5) {
        // ถ้าน้อยกว่า 5 หน้า แสดงทั้งหมด
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        if (current <= 3) {
            // case: หน้าแรกๆ
            pages.push(1, 2, 3, 4, 5, "...", total)
        } else if (current >= total - 2) {
            // case: หน้าสุดท้าย
            pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total)
        } else {
            // case: อยู่ตรงกลาง
            pages.push(1, "...", current - 1, current, current + 1, "...", total)
        }
    }

    return pages
})

function goToPage(page) {
    if (page === "...") return
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

function deleteSchool() {}
</script>


<template>
    <div>
        <div class="p-6">
            <!-- Page Title -->
            <h1 class="text-4xl font-bold mb-6 ml-2 mt-2">Schools</h1>

            <!-- Search & Filters -->
            <div class="bg-white p-4 rounded-xl shadow mb-4">
                <div class="flex flex-wrap gap-3 items-center">
                    <input type="text" placeholder="Search" class="border rounded-lg px-3 py-2 flex-1" />

                    <select class="border rounded-lg px-3 py-2 pr-16">
                        <option>School Type</option>
                        <option>Public</option>
                        <option>Private</option>
                        <option>International</option>
                    </select>

                    <select class="border rounded-lg px-3 py-2 pr-16">
                        <option>Education Level</option>
                        <option>Elementary</option>
                        <option>Middle</option>
                        <option>High</option>
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
                    <button @click="isCreateSchoolModalOpen = true" class="bg-color-main2 text-white px-4 py-2 rounded-lg">
                        + Create School
                    </button>
                    <button @click="isAddSchoolModalOpen = true" class="flex items-center gap-1 bg-color-main2 text-white px-4 py-2 rounded-lg">
                        <img src="/images/person_plus.png" alt="person_plus" class="w-4 h-4">
                        Add School Admin
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

                            <!-- Action buttons -->
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
                                        @click="isDeleteModalOpen = true">
                                        <img src="/images/trash.png" alt="delete" class="w-5 h-5" />
                                    </button>
                                </div>
                            </td>

                            <td class="p-3 text-center">{{ school.id }}</td>
                            <td class="p-3 text-center">{{ school.name }}</td>
                            <td class="p-3 text-center">{{ school.type }}</td>
                            <td class="p-3 text-center">{{ school.level }}</td>
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
        <AddSchoolModal v-model="isAddSchoolModalOpen" @added="handleAdded" />
        <DeleteSchoolModal v-model="isDeleteModalOpen" @deleted="handleDeleted" />
    </div>
</template>
