<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DeleteKidModal from '~/components/DeleteKidModal.vue'

const router = useRouter()

// modal
const deleteModalOpen = ref(false)
const selectedKid = ref(null) // 🟢 kid ที่จะลบ

// data
const kids = ref([])
const isLoading = ref(false)
const errorMessage = ref("")

// pagination
const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(kids.value.length / pageSize))

const paginatedKids = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return kids.value.slice(start, start + pageSize)
})

// pagination UI
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
    if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// fetch kids
async function fetchKids() {
    try {
        isLoading.value = true
        const { public: config } = useRuntimeConfig()
        const res = await fetch(`${config.apiDomain}/kids/getAllKids`)
        if (!res.ok) throw new Error("Failed to fetch kids")
        const data = await res.json()
        const rawKids = data.kids || []

        // fetch place + parent
        const kidsWithExtraData = await Promise.all(
            rawKids.map(async kid => {
                let placeName = "Unknown place"
                let parentName = "Unknown parent"

                try {
                    const placeRes = await fetch(`${config.apiDomain}/places/getPlace/${kid.userId}/${kid.lastZoneId}`)
                    if (placeRes.ok) {
                        const placeData = await placeRes.json()
                        placeName = placeData?.place?.name || placeData?.name || "Unknown place"
                    }
                } catch { }

                try {
                    const userRes = await fetch(`${config.apiDomain}/users/get/${kid.userId}`)
                    if (userRes.ok) {
                        const userData = await userRes.json()
                        parentName = userData?.user?.firstName || userData?.firstName || "Unknown parent"
                    }
                } catch { }

                return {
                    ...kid,
                    placeName,
                    parentName,
                }
            })
        )

        kids.value = kidsWithExtraData
    } catch (err) {
        errorMessage.value = err.message
    } finally {
        isLoading.value = false
    }
}

function openDeleteModal(kid) {
    selectedKid.value = kid
    deleteModalOpen.value = true
}


onMounted(fetchKids)

// 🔹 ลบสำเร็จ → รีเฟรช list
function handleDeleted(kid) {
    kids.value = kids.value.filter(k => k.id !== kid.id)
}

</script>

<template>
    <div class="p-6">
        <h1 class="text-4xl font-bold mb-6 ml-2 mt-2">Kids</h1>

        <div class="bg-white p-4 rounded-xl shadow mb-4 flex gap-3 items-center">
            <input type="text" placeholder="Search" class="border rounded-lg px-3 py-2 flex-1" />
            <button class="bg-color-main2 text-white px-4 py-2 rounded-lg">Search</button>
        </div>

        <div v-if="isLoading" class="text-center py-10 text-gray-500">Loading kids...</div>
        <div v-else-if="errorMessage" class="text-center text-red-500 py-10">{{ errorMessage }}</div>

        <div v-else class="bg-white rounded-xl shadow overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="p-3 text-center">Action</th>
                        <th class="p-3 text-center">Beacon ID</th>
                        <th class="p-3 text-center">Device Name</th>
                        <th class="p-3 text-center">Parent</th>
                        <th class="p-3 text-center">School</th>
                        <th class="p-3 text-center">Location (Last update)</th>
                        <th class="p-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="kid in paginatedKids" :key="kid.beaconId" class="border-t hover:bg-gray-50">
                        <td class="p-3 text-center">
                            <div class="flex justify-center gap-2">
                                <button class="bg-color-main3 text-white px-2 py-1 rounded"
                                    @click="router.push({ path: `/devices/detail/${kid.id}`, query: { userId: kid.userId } })">
                                    <img src="/images/eye.png" alt="eye" class="w-5 h-5" />
                                </button>
                                <button class="bg-color-main-red text-white px-2 py-1 rounded"
                                    @click="openDeleteModal(kid)">
                                    <img src="/images/trash.png" alt="delete" class="w-5 h-5" />
                                </button>
                            </div>
                        </td>

                        <td class="p-3 text-center">{{ kid.beaconId }}</td>
                        <td class="p-3 text-center">{{ kid.name }}</td>
                        <td class="p-3 text-center">{{ kid.parentName }}</td>
                        <td class="p-3 text-center">{{ kid.placeName }}</td>
                        <td class="p-3 text-center">{{ kid.lastLat?.toFixed(6) }}, {{ kid.lastLng?.toFixed(6) }}</td>
                        <td class="p-3 text-center">
                            <span class="px-4 py-1 rounded-full text-white text-sm"
                                :class="kid.status === 'online' ? 'bg-green-500' : 'bg-red-400'">
                                {{ kid.status === 'online' ? 'Active' : 'Inactive' }}
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
                        :disabled="page === '...'"
                        :class="page === currentPage ? 'bg-blue-500 text-white' : page === '...' ? 'bg-transparent text-gray-500 cursor-default' : 'bg-white text-color-main2'"
                        @click="goToPage(page)">
                        {{ page }}
                    </button>
                </div>
                <button class="text-color-main2 disabled:text-gray-600" :disabled="currentPage === totalPages"
                    @click="goToPage(currentPage + 1)">
                    Next &gt;
                </button>
            </div>
        </div>

        <DeleteKidModal v-model="deleteModalOpen" :kid="selectedKid" @deleted="handleDeleted" />
    </div>
</template>
