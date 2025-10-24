<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddDeviceModal from '~/components/AddDeviceModal.vue'
import DeleteKidModal from '~/components/DeleteKidModal.vue'
import DeleteKidMultiModal from '~/components/DeleteKidMultiModal.vue'

const { public: config } = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const schoolId = route.params.id

// modal
const deleteModalOpen = ref(false)
const deleteMultiModalOpen = ref(false)  // สำหรับ multi delete
const addDeviceModalOpen = ref(false)
const selectedKid = ref(null)

// search
const searchQueryInput = ref("")
const activeSearchQuery = ref("")

function handleSearch() {
    activeSearchQuery.value = searchQueryInput.value
    currentPage.value = 1
}

// data
const kids = ref([])
const isLoading = ref(false)
const errorMessage = ref("")

// fetch kids
async function fetchKids() {
    try {
        const res = await fetch(`${config.apiDomain}/schools/getAllStudent/${schoolId}`)
        const json = await res.json()
        if (!json.success) return console.warn("No students found")
        const studentRefs = json.data
        if (studentRefs.length === 0) {
            kids.value = []
            return
        }

        const kidIds = studentRefs.map(s => s.kidId)
        const kidsRes = await fetch(`${config.apiDomain}/kids/getMultiKid`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: kidIds })
        })
        const kidsJson = await kidsRes.json()
        if (!kidsJson.success) return console.warn("No kids data found")

        kids.value = kidsJson.data.map(kid => ({
            id: kid.id,
            userId: kid.userId,
            beaconId: kid.beaconId,
            name: kid.name,
            parentName: kid.parentName || '-',
            placeName: kid.placeName || '-',
            lastLat: kid.lastLat || null,
            lastLng: kid.lastLng || null,
            status: kid.status || 'Inactive'
        }))


    } catch (err) {
        console.error("🔥 Error fetching students:", err)
    }
}

function handleCreated() {
    fetchKids()
}

// ---------------- Selection ----------------
const selectedKids = ref([])

const allKidsSelected = computed({
    get: () => paginatedKids.value.length > 0 && paginatedKids.value.every(k => selectedKids.value.includes(k.id)),
    set: (val) => {
        const ids = paginatedKids.value.map(k => k.id)
        if (val) selectedKids.value = Array.from(new Set([...selectedKids.value, ...ids]))
        else selectedKids.value = selectedKids.value.filter(id => !ids.includes(id))
    }
})

function toggleKidSelection(id) {
    if (selectedKids.value.includes(id)) selectedKids.value = selectedKids.value.filter(i => i !== id)
    else selectedKids.value.push(id)
}

// ---------------- Multi Delete ----------------
const selectedKidsForDelete = computed(() =>
    kids.value.filter(k => selectedKids.value.includes(k.id))
)

function confirmDeleteSelected() {
    if (selectedKids.value.length === 0) return
    deleteMultiModalOpen.value = true
}

function handleDeletedMulti() {
    kids.value = kids.value.filter(k => !selectedKids.value.includes(k.id))
    selectedKids.value = []
}


// pagination
const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(filteredKids.value.length / pageSize))

// ✅ filter kids by *name only*
const filteredKids = computed(() => {
    if (!activeSearchQuery.value.trim()) return kids.value
    const q = activeSearchQuery.value.toLowerCase()
    return kids.value.filter(kid =>
        kid.name?.toLowerCase().startsWith(q)
    )
})

// pagination with search
const paginatedKids = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredKids.value.slice(start, start + pageSize)
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


function openDeleteModal(kid) {
    selectedKid.value = kid
    deleteModalOpen.value = true
}

function handleDeleted(kid) {
    kids.value = kids.value.filter(k => k.id !== kid.id)
}

onMounted(fetchKids)
</script>

<template>
    <div class="p-6">
        <h1 class="text-4xl font-bold mb-6 ml-2 mt-2">Kids</h1>

        <div class="bg-white p-4 rounded-xl shadow mb-4">
            <div class="flex flex-wrap gap-3 items-center">
                <input v-model="searchQueryInput" type="text" placeholder="Search by name"
                    class="border rounded-lg px-3 py-2 flex-1" />

                <button @click="handleSearch"
                    class="bg-color-main2 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Search</button>
            </div>

            <div class="flex gap-3 mt-4">
                <button @click="addDeviceModalOpen = true"
                    class="bg-color-main2 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                    + Add device
                </button>

                <button
                    class="flex items-center gap-1 bg-color-main2 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                    <img src="/images/import.png" alt="import" class="w-4 h-4">
                    Import
                </button>

                <!-- multi delete button -->
                <button @click="confirmDeleteSelected"
                    class="flex items-center gap-1 bg-color-main-red text-white px-4 py-2 rounded-lg">
                    <img src="/images/trash.png" alt="trash" class="w-5 h-5">
                    Delete ({{ selectedKids.length }})
                </button>
            </div>
        </div>

        <div v-if="isLoading" class="text-center py-10 text-gray-500">Loading kids...</div>
        <div v-else-if="errorMessage" class="text-center text-red-500 py-10">{{ errorMessage }}</div>
        <div v-else class="bg-white rounded-xl shadow overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="p-3"><input type="checkbox" v-model="allKidsSelected" /></th>
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
                        <td class="p-3"><input type="checkbox" :checked="selectedKids.includes(kid.id)"
                                @change="toggleKidSelection(kid.id)" /></td>

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
                        <td class="p-3 text-center">
                            {{ kid.lastLat?.toFixed(6) || "-" }} | {{ kid.lastLng?.toFixed(6) || "-" }}
                        </td>

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

        <AddDeviceModal v-model="addDeviceModalOpen" :schoolId="schoolId" @created="handleCreated" />

        <DeleteKidModal v-model="deleteModalOpen" :kid="selectedKid" @deleted="handleDeleted" />
        <DeleteKidMultiModal v-model="deleteMultiModalOpen" :kids="selectedKidsForDelete"
            @deleted="handleDeletedMulti" />
    </div>
</template>
