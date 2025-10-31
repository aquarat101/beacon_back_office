<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const { public: config } = useRuntimeConfig()

const route = useRoute()
const router = useRouter()

// state
const logs = ref([])

// pagination
const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(logs.value.length / pageSize))

const paginatedLogs = computed(() => {
    if (!logs.value || !logs.value.length) return []
    const start = (currentPage.value - 1) * pageSize
    return logs.value.slice(start, start + pageSize)
})

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
    return new Date(date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
    }) + ", " + new Date(date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    })
}

// fetch data from API
async function fetchLogs() {
    try {
        const res = await fetch(`${config.apiDomain}/systemBof/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
        const data = await res.json()
        console.log("✅ Logs data:", data)

        // ✅ แปลงข้อมูลจาก API ให้ตรงกับตาราง
        logs.value = (data.logs || []).map((item, index) => ({
            id: index + 1,
            datetime: item.timestamp,
            log: item.action,
            user: `Super ${item.targetName} Chan`,  // ตัวอย่างใน UI
            role: item.actorRole === "super_admin" ? "Super Admin" : item.actorRole
        }))
    } catch (error) {
        console.error("Failed to fetch logs:", error)
    }
}

onMounted(() => {
    fetchLogs()
})
</script>

<template>
    <div class="p-6 bg-white rounded-xl">
        <!-- Page Title -->
        <h1 class="text-2xl font-bold mb-6">System Log</h1>

        <!-- Table -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
            <table class="w-full border-collapse">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="pl-10 p-3 text-left">Date/Time</th>
                        <th class="p-3 text-left">Log</th>
                        <th class="p-3 text-center">User</th>
                        <th class="pr-10 p-3 text-right">Role</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="log in paginatedLogs" :key="log.id" class="border-t hover:bg-gray-50">
                        <td class="pl-10 p-3 text-left">{{ formatDate(log.datetime) }}</td>
                        <td class="p-3 text-left">{{ log.log }}</td>
                        <td class="p-3 text-center">{{ log.user }}</td>
                        <td class="pr-10 p-3 text-right capitalize">{{ log.role }}</td>
                    </tr>
                    <tr v-if="!logs.length">
                        <td colspan="4" class="text-center text-gray-500 py-6">No logs found</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div v-if="logs.length" class="flex justify-end items-center p-4">
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
