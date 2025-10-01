<script setup>
import { ref, computed } from "vue"
import { useRoute, useRouter } from 'vue-router'
import DeleteSchoolModal from '~/components/DeleteSchoolModal.vue'

// route params
const route = useRoute()
const router = useRouter()
const beaconId = route.params.id

// modal delete
const deleteModalOpen = ref(false)

// current tab
const currentTab = ref('location')

// mock data
const beacon = ref({
    id: beaconId,
    name: "Piyo Chan",
    parentName: "Tamayo Chan",
    parentEmail: "tamayo@mail.com",
    phoneNumber: "0821234567",
    school: "Piyo Piyo Elementary School",
    remark: "Worem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    status: "Active",
    avatar: "/images/layout/logo.png" // ใส่รูปตัวอย่าง
})

function handleDelete() {
    console.log('Deleted device:', beacon.value)
    router.push('/devices')
}


// mock data: 90 รายการ location
const locations = Array.from({ length: 90 }, (_, i) => ({
    id: i + 1,
    name: i % 2 === 0 ? "Home" : "Piyo Piyo Elementary School",
    datetime: new Date(2025, 7 - 1, (i % 28) + 1, i % 2 === 0 ? 18 : 7, 0), // 6PM / 7AM
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
    <div class="h-screen p-6">

        <h1 class="text-2xl font-bold mb-4">Device Detail</h1>

        <button @click="router.back()" class="text-blue-500 mb-4 text-lg">&lt; Back</button>

        <!-- Tabs -->
        <div class="flex border-b mb-5">
            <button :class="currentTab === 'info' ? 'border-b-2 border-blue-500 pb-2' : 'pb-2'"
                @click="currentTab = 'info'" class="px-4">
                Information Detail
            </button>

            <button :class="currentTab === 'location' ? 'border-b-2 border-blue-500 pb-2' : 'pb-2'"
                @click="currentTab = 'location'" class="px-4">
                Location History
            </button>
        </div>

        <div v-if="currentTab === 'info'" class="">
            <div class="bg-white p-6 rounded-xl shadow space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="flex gap-3">
                            <h2 class="text-xl font-bold">{{ beacon.name }}</h2>
                            <span class="text-sm text-white px-2 py-1 rounded-full"
                                :class="beacon.status === 'Active' ? 'bg-green-500' : 'bg-red-500'">
                                {{ beacon.status }}
                            </span>
                        </div>

                        <div class="text-sm text-gray-500 mt-1">Beacon ID: {{ beacon.id }}</div>
                    </div>
                </div>

                <img :src="beacon.avatar" alt="avatar" class="w-20 h-20 rounded-full" />

                <div>
                    <p><strong>Parent Name</strong><br>{{ beacon.parentName }}</p>
                    <p class="mt-2"><strong>Parent Email</strong><br>{{ beacon.parentEmail }}</p>
                    <p class="mt-2"><strong>Parent Phone Number</strong><br>{{ beacon.phoneNumber }}</p>
                    <p class="mt-2"><strong>School</strong><br>{{ beacon.school }}</p>
                    <p class="mt-2"><strong>Remark</strong><br>{{ beacon.remark }}</p>
                </div>

                <button @click="deleteModalOpen = true" class="text-blue-500 font-bold underline mt-2">
                    Delete Device
                </button>
            </div>
        </div>

        <div v-if="currentTab === 'location'" class="">
            <div class="p-6 bg-white rounded-xl">
                <!-- Page Title -->
                <h1 class="text-2xl font-bold mb-6">Location History</h1>

                <!-- Search & Filters -->
                <div class="rounded-xl mb-4 flex gap-3 items-center">
                    <div class="flex w-full">
                        <div class="relative w-full flex-1">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                                <img src="/images/search.png" class="w-4 h-4 text-gray-600" />
                            </span>
                            <input type="text" placeholder="Search" class="w-full border rounded-lg pl- p-8 r-3 py-2" />
                        </div>
                    </div>

                    <input type="date" class="border rounded-lg px-3 py-2" placeholder="Start Date" />
                    <input type="date" class="border rounded-lg px-3 py-2" placeholder="End Date" />
                    <button class="bg-blue-500 text-white px-4 py-2 rounded-lg">Search</button>
                </div>

                <!-- Table -->
                <div class="bg-white rounded-xl shadow overflow-hidden">
                    <table class="w-full border-collapse">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="pl-6 p-3 text-left">Location Name</th>
                                <th class="pr-6 p-3 text-right">Date/Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="loc in paginatedLocations" :key="loc.id" class="border-t hover:bg-gray-50">
                                <td class="pl-6 p-3 text-left">{{ loc.name }}</td>
                                <td class="pr-6 p-3 text-right">{{ formatDate(loc.datetime) }}</td>
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
        </div>


        <DeleteSchoolModal v-model="deleteModalOpen" :school="beacon" @deleted="handleDelete" />
    </div>
</template>
