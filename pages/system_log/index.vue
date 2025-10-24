<script setup>
import { ref, computed } from "vue"
import { useRoute, useRouter } from 'vue-router'
import DeleteSchoolModal from '~/components/DeleteSchoolModal.vue'

// route params
const route = useRoute()
const router = useRouter()
const beaconId = route.params.id

// mock data
const beacon = ref({
    id: beaconId,
    name: "Piyo Chan",
    parentName: "Tamayo Chan",
    parentEmail: "tamayo@mail.com",
    phoneNumber: "0821234567",
    school: "Piyo Piyo Elementary School",
    remark: "Worem ipsum dolor sit amet...",
    status: "Active",
    avatar: "/images/layout/logo.png"
})

// mock data: 90 รายการ location (System Log)
const locations = Array.from({ length: 90 }, (_, i) => ({
    id: i + 1,
    datetime: new Date(2025, 7 - 1, (i % 28) + 1, i % 2 === 0 ? 18 : 7, 0), // 6PM / 7AM
    log: i % 2 === 0 ? "Login to system" : "Viewed student profile",
    user: i % 2 === 0 ? "Admin" : "Teacher A",
    role: i % 2 === 0 ? "Administrator" : "Teacher"
}))

// pagination
const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(locations.length / pageSize))

const paginatedLocations = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return locations.slice(start, start + pageSize)
})

// page numbers logic
const pageNumbers = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        if (current <= 3) {
            pages.push(1, 2, 3, 4, 5, "...", total)
        } else if (current >= total - 2) {
            pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total)
        } else {
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

function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
    }) + ", " + date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    })
}
</script>

<template>
    <div class="p-6 bg-white rounded-xl">
        <!-- Page Title -->
        <h1 class="text-2xl font-bold mb-6">System Log</h1>

        <!-- Search & Filters -->
        <div class="rounded-xl mb-4 flex gap-3 items-center">
            <div class="flex w-full">
                <div class="relative w-full flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                        <img src="/images/search.png" class="w-4 h-4 text-gray-600" />
                    </span>
                    <input type="text" placeholder="Search" class="w-full border rounded-lg pl-10 pr-3 py-2" />
                </div>
            </div>


            <input type="date" class="border rounded-lg px-3 py-2" placeholder="Start Date" />
            <input type="date" class="border rounded-lg px-3 py-2" placeholder="End Date" />yyyyy

            <button class="bg-blue-500 text-white px-4 py-2 rounded-lg">Search</button>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
            <table class="w-full border-collapse">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="pl-6 p-3 text-left">Date/Time</th>
                        <th class="p-3 text-center">Log</th>
                        <th class="p-3 text-center">User</th>
                        <th class="pr-6 p-3 text-right">Role</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="loc in paginatedLocations" :key="loc.id" class="border-t hover:bg-gray-50">
                        <td class="pl-6 p-3 text-left">{{ formatDate(loc.datetime) }}</td>
                        <td class="p-3 text-center">{{ loc.log }}</td>
                        <td class="p-3 text-center">{{ loc.user }}</td>
                        <td class="pr-6 p-3 text-right">{{ loc.role }}</td>
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
</template>
