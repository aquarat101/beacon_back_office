<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from 'vue-router'
import DeleteStudentModal from '~/components/DeleteStudentModal.vue'
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const route = useRoute()
const router = useRouter()

const userId = route.query.userId
const kidId = route.params.id

// modal delete
const deleteModalOpen = ref(false)

// current tab
const currentTab = ref('info')

// runtime config
const { public: config } = useRuntimeConfig()

// data
const beacon = ref(null)
const parentProfile = ref(null)
const isLoading = ref(false)
const errorMessage = ref("")

// location history
const locations = ref([])
const loadingLocations = ref(false)

// pagination
const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(locations.value.length / pageSize))
const paginatedLocations = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return locations.value.slice(start, start + pageSize)
})

const pageNumbers = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value
    if (total <= 5) for (let i = 1; i <= total; i++) pages.push(i)
    else if (current <= 3) pages.push(1, 2, 3, 4, 5, "...", total)
    else if (current >= total - 2) pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total)
    else pages.push(1, "...", current - 1, current, current + 1, "...", total)
    return pages
})

function goToPage(page) {
    if (page === "...") return
    if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

function formatDate(date) {
    return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" }) +
        ", " + date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

// ✅ โหลดข้อมูล kid และ profile
async function fetchKidAndParent() {
    try {
        isLoading.value = true

        const kidRes = await fetch(`${config.apiDomain}/kids/getKid/${userId}/${kidId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
        if (!kidRes.ok) throw new Error("Failed to fetch kid")
        const kidData = await kidRes.json()
        const kid = kidData

        let parent = null
        if (userId) {
            const userRes = await fetch(`${config.apiDomain}/users/get/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            })
            if (userRes.ok) parent = await userRes.json()
        }

        let place = null
        if (kid.lastZoneId) {
            const placeRes = await fetch(`${config.apiDomain}/places/getPlace/${userId}/${kid.lastZoneId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            })
            if (placeRes.ok) place = await placeRes.json()
        }

        beacon.value = {
            id: kid.id,
            name: kid.name || "Unknown Kid",
            parentName: parent?.firstName || "Unknown Parent",
            parentEmail: parent?.email || "-",
            phoneNumber: parent?.phone || "-",
            school: place?.name || "Unknown School",
            remark: kid.remark || "-",
            status: kid.status === 'online' ? 'Active' : 'Inactive',
            avatar: kid.avatarUrl || "/images/layout/logo.png",
            beaconId: kid.beaconId
        }

        console.log(beacon.value)

        parentProfile.value = parent

        // fetch location history
        fetchLocations(beacon.value.beaconId)
    } catch (err) {
        console.error("❌ fetchKidAndParent error:", err)
        errorMessage.value = err.message
    } finally {
        isLoading.value = false
    }
}

// ✅ ดึง location history จาก beacon_zone_hits & beacon_zone_exits
async function fetchLocations(beaconId) {
    if (!beaconId) {
        locations.value = []
        return
    }

    loadingLocations.value = true
    try {
        // เรียก API รวม hits + exits
        const res = await fetch(`${config.apiDomain}/beacons/getZoneEvents/${beaconId}/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
        const json = await res.json()

        if (!json.success) {
            locations.value = []
            return
        }

        const events = json.data || []

        // 🔹 สำหรับแต่ละ event, เรียก API places/getPlace/:userId/:zoneId
        const locationsWithNames = await Promise.all(
            events.map(async (item, index) => {
                const date = item.timestamp?._seconds ? new Date(item.timestamp._seconds * 1000) : new Date()
                let placeName = '-'
                let placeType = 'Other'

                if (item.zoneId) {
                    try {
                        const placeRes = await fetch(`${config.apiDomain}/places/getPlace/${userId}/${item.zoneId}`, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${auth.token}`,
                            },
                        })
                        if (placeRes.ok) {
                            const placeData = await placeRes.json()
                            placeName = placeData.name || '-'
                            placeType = placeData.type || 'Other'
                        }
                    } catch (err) {
                        console.warn(`Failed to fetch place for zoneId ${item.zoneId}:`, err)
                    }
                }

                return {
                    id: index + 1,
                    name: placeName,
                    type: placeType,
                    event: item.eventType === 'hit' ? 'inside' : 'outside',
                    datetime: date
                }
            })
        )

        locations.value = locationsWithNames
    } catch (err) {
        console.error("Fetch locations error:", err)
        locations.value = []
    } finally {
        loadingLocations.value = false
    }
}



function handleDelete() {
    deleteModalOpen.value = false
    router.push("/devices")
}

onMounted(() => {
    fetchKidAndParent()
})

</script>


<template>
    <div class="h-screen p-6">
        <h1 class="text-2xl font-bold mb-4">Device Detail</h1>
        <button @click="router.back()" class="text-blue-500 mb-4 text-lg">&lt; Back</button>

        <div v-if="isLoading" class="text-center py-10 text-gray-500">Loading...</div>
        <div v-else-if="errorMessage" class="text-center py-10 text-red-500">{{ errorMessage }}</div>

        <div v-else>
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

            <!-- Info Tab -->
            <div v-if="currentTab === 'info' && beacon" class="bg-white p-6 rounded-xl shadow space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="flex gap-3">
                            <h2 class="text-xl font-bold">{{ beacon.name }}</h2>
                            <span class="text-sm text-white px-2 py-1 rounded-full"
                                :class="beacon.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'">
                                {{ beacon.status }}
                            </span>
                        </div>
                        <div class="text-sm text-gray-500 mt-1">Beacon ID: {{ beacon.id }}</div>
                    </div>
                </div>

                <img :src="beacon.avatar" alt="avatar" class="w-20 h-20 rounded-full" />

                <div>
                    <p><strong>Parent Name:</strong> {{ beacon.parentName }}</p>
                    <p><strong>Email:</strong> {{ beacon.parentEmail }}</p>
                    <p><strong>Phone:</strong> {{ beacon.phoneNumber }}</p>
                    <p><strong>School:</strong> {{ beacon.school }}</p>
                    <p><strong>Remark:</strong> {{ beacon.remark }}</p>
                </div>

                <button @click="deleteModalOpen = true" class="text-blue-500 font-bold underline mt-2">
                    Delete Device
                </button>
            </div>



            <!-- Location Tab -->
            <div v-if="currentTab === 'location'" class="p-6 bg-white rounded-xl shadow">
                <h1 class="text-2xl font-bold mb-6">Location History</h1>

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

            <DeleteStudentModal v-if="beacon" v-model="deleteModalOpen" :kid="{ id: beacon.id, name: beacon.name }"
                @deleted="handleDelete" />

        </div>
    </div>
</template>
