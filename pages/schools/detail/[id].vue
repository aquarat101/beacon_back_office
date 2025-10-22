<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddSchoolAdminModal from "~/components/AddSchoolAdminModal.vue"
import CreateSchoolModal from "~/components/CreateSchoolModal.vue"
import DeleteSchoolModal from '~/components/DeleteSchoolModal.vue'

const { public: config } = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const schoolId = route.params.id

// ---------------- Modal ----------------
const deleteModalOpen = ref(false)
const isCreateSchoolModalOpen = ref(false)
const isAddSchoolAdminModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

// ---------------- Tabs ----------------
const currentTab = ref('info')

// ---------------- Data ----------------
const school = ref(null)
const staffs = ref([])
const students = ref([])

// ---------------- Staff Filter Inputs ----------------
const staffSearchInput = ref('')
const staffRoleInput = ref('')
const staffStatusInput = ref('')

// Active filters (ใช้คำนวณจริง)
const staffSearchActive = ref('')
const staffRoleActive = ref('')
const staffStatusActive = ref('')

// ---------------- Student Filter Inputs ----------------
const studentSearchInput = ref('')
const studentStatusInput = ref('')

// Active filters
const studentSearchActive = ref('')
const studentStatusActive = ref('')

// ---------------- Pagination ----------------
const currentPage = ref(1)
const pageSize = 10

// ---------------- Fetch API ----------------
async function getSchool(id) {
    try {
        const res = await fetch(`${config.apiDomain}/schools/get/${id}`)
        const json = await res.json()
        if (json.success) school.value = json.data
    } catch (err) {
        console.error(err)
    }
}

async function getSchoolStaffs() {
    try {
        const res = await fetch(`${config.apiDomain}/schools/getAllUser`)
        const json = await res.json()
        if (json.success) staffs.value = json.data || []
    } catch (err) {
        console.error(err)
    }
}

async function getStudents() {
    try {
        const res = await fetch(`${config.apiDomain}/schools/${schoolId}/getAllStudent`)
        const json = await res.json()
        if (!json.success) return console.warn("No students found")
        const studentRefs = json.data
        if (studentRefs.length === 0) {
            students.value = []
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

        students.value = kidsJson.data.map(kid => ({
            id: kid.id,
            serialNumber: kid.beaconId,
            deviceName: kid.name,
            school: school.value.schoolName,
            lat: kid.lastLat || "-",
            lng: kid.lastLng || "-",
            status: kid.status || "Active"
        }))

    } catch (err) {
        console.error("🔥 Error fetching students:", err)
    }
}

// ---------------- Filters ----------------
const filteredStaffs = computed(() => {
    return staffs.value.filter(s => {
        const matchesSearch =
            !staffSearchActive.value ||
            s.name.toLowerCase().includes(staffSearchActive.value.toLowerCase()) ||
            s.email.toLowerCase().includes(staffSearchActive.value.toLowerCase())

        const matchesRole =
            !staffRoleActive.value || s.role === staffRoleActive.value

        const matchesStatus =
            !staffStatusActive.value || s.status === staffStatusActive.value

        return matchesSearch && matchesRole && matchesStatus
    })
})

const filteredStudents = computed(() => {
    return students.value.filter(s => {
        const matchesSearch =
            !studentSearchActive.value ||
            s.deviceName.toLowerCase().includes(studentSearchActive.value.toLowerCase()) ||
            s.serialNumber.toLowerCase().includes(studentSearchActive.value.toLowerCase())

        const matchesStatus =
            !studentStatusActive.value || s.status === studentStatusActive.value

        return matchesSearch && matchesStatus
    })
})

// ---------------- Pagination Logic ----------------
const totalPages = computed(() => Math.ceil(
    (currentTab.value === 'staff' ? filteredStaffs.value.length : filteredStudents.value.length) / pageSize
))

const paginatedStaffs = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredStaffs.value.slice(start, start + pageSize)
})

const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredStudents.value.slice(start, start + pageSize)
})

const pageNumbers = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value
    if (total <= 5) for (let i = 1; i <= total; i++) pages.push(i)
    else {
        if (current <= 3) pages.push(1, 2, 3, 4, 5, "...", total)
        else if (current >= total - 2)
            pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total)
        else
            pages.push(1, "...", current - 1, current, current + 1, "...", total)
    }
    return pages
})
function goToPage(page) {
    if (page !== '...' && page >= 1 && page <= totalPages.value)
        currentPage.value = page
}

// ---------------- Search Handlers ----------------
function handleSearchStaff() {
    staffSearchActive.value = staffSearchInput.value
    staffRoleActive.value = staffRoleInput.value
    staffStatusActive.value = staffStatusInput.value
    currentPage.value = 1
}

function handleSearchStudent() {
    studentSearchActive.value = studentSearchInput.value
    studentStatusActive.value = studentStatusInput.value
    currentPage.value = 1
}

// ---------------- Handlers ----------------
function handleCreated(data) { console.log("🎉 School created:", data) }
function handleAdded(data) { console.log("🎉 Admin added:", data) }
function handleDeleted() { console.log("Deleted") }
function handleDelete() { console.log('Deleted school:', school.value); router.push('/schools') }

// ---------------- Load ----------------
onMounted(async () => {
    await getSchoolStaffs()
    await getSchool(schoolId)
    await getStudents()
})
</script>



<template>
    <div class="h-screen p-6">
        <!-- Back button -->
        <h1 class="text-2xl font-bold mb-4">School Detail</h1>

        <button @click="router.back()" class="text-blue-500 mb-4 text-lg">&lt; Back</button>

        <!-- Tabs -->
        <div class="flex border-b mb-5">
            <button :class="currentTab === 'info' ? 'border-b-2 border-blue-500 pb-2' : 'pb-2'"
                @click="currentTab = 'info'" class="px-4">
                Information Detail
            </button>
            <button :class="currentTab === 'staff' ? 'border-b-2 border-blue-500 pb-2' : 'pb-2'"
                @click="currentTab = 'staff'" class="px-4">
                Staffs list
            </button>
            <button :class="currentTab === 'students' ? 'border-b-2 border-blue-500 pb-2' : 'pb-2'"
                @click="currentTab = 'students'" class="px-4">
                Students list
            </button>
        </div>

        <!-- Info tab -->
        <div v-if="currentTab === 'info'" class="bg-white p-6 rounded-xl shadow">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <div class="flex gap-3">
                        <h2 class="text-xl font-bold">{{ school?.schoolName ?? "no name" }}</h2>

                        <div class="flex items-center px-4 rounded-2xl text-white text-sm"
                            :class="school?.status === 'Active' ? 'bg-green-500' : 'bg-red-500'">
                            {{ school?.status }}
                        </div>
                    </div>

                    <div class="text-sm text-gray-500 mt-1">School ID: {{ school?.id }}</div>
                </div>
                <button class="flex bg-color-main2 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    @click="$router.push(`/schools/edit/${school.id}`)">
                    <img src="/images/edit.png" alt="edit" class="w-5 h-5 mr-1 mt-0.5">
                    Edit
                </button>
            </div>

            <div class="flex gap-6">
                <img src="/images/layout/logo.png" alt="school" class="w-24 h-24 rounded-full" />

                <div class="flex-1">
                    <p><strong>School Type</strong> <br> {{ school?.schoolType }}</p>
                    <p class="mt-2"><strong>Education Level</strong> <br> {{ school?.educationLevel }}</p>
                    <p class="mt-2"><strong>Address</strong> <br> {{ school?.address }}</p>
                    <p class="mt-2"><strong>Latitude / Longitude</strong> <br> {{ school?.latitude }} / {{
                        school?.longtitude }}</p>
                    <p class="mt-2"><strong>Contact Number</strong> <br> {{ school?.contactNumber }}</p>
                    <p class="mt-2"><strong>School Email</strong> <br> {{ school?.schoolEmail }}</p>
                    <p class="mt-2"><strong>Website</strong> <br>
                        <a :href="school?.website" class="text-blue-500" target="_blank">{{ school?.website }}</a>
                    </p>

                    <button @click="deleteModalOpen = true" class="text-blue-500 font-bold mt-4 underline">
                        Delete School
                    </button>
                </div>
            </div>
        </div>




        <!-- Staffs tab -->
        <div v-if="currentTab === 'staff'" class="bg-white p-6 rounded-xl shadow">

            <div class="">
                <!-- Page Title -->
                <div>
                    <div class="flex gap-4">
                        <h2 class="text-xl font-bold">Staff list</h2>

                        <div class="flex items-center px-4 rounded-2xl bg-color-main3 text-white text-sm">
                            0123
                        </div>
                    </div>
                </div>

                <!-- Search & Filters -->
                <div class="bg-white pt-3 rounded-xl mb-4">
                    <div class="flex flex-wrap gap-3 items-center">
                        <input type="text" v-model="staffSearchInput" placeholder="Search by name/email"
                            class="border rounded-lg px-3 py-2 flex-1" />

                        <select v-model="staffRoleInput" class="border rounded-lg px-3 py-2">
                            <option value="">Role</option>
                            <option>Admin</option>
                            <option>Staff</option>
                            <option>User</option>
                        </select>

                        <select v-model="staffStatusInput" class="border rounded-lg px-3 py-2">
                            <option value="">Status</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>

                        <button class="bg-color-main2 text-white px-4 py-2 rounded-lg" @click="handleSearchStaff">
                            Search
                        </button>
                    </div>

                    <div class="flex gap-3 mt-4">
                        <button @click="isAddSchoolAdminModalOpen = true"
                            class="flex items-center gap-1 bg-color-main2 text-white px-4 py-2 rounded-lg">
                            <img src="/images/person_plus.png" alt="person_plus" class="w-4 h-4" />
                            Add School Admin
                        </button>

                        <button @click="isDeleteModalOpen = true"
                            class="flex items-center gap-1 bg-color-main-red text-white px-4 py-2 rounded-lg">
                            <img src="/images/trash.png" alt="trash" class="w-5 h-5" />
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
                                            @click="$router.push(`/schools/detail/staff_detail/${staff.id}`)">
                                            <img src="/images/eye.png" alt="eye" class="w-5 h-5" />
                                        </button>

                                        <button class="bg-color-main3 text-white px-2 py-1 rounded"
                                            @click="$router.push(`/schools/detail/staff_edit/${staff.id}`)">
                                            <img src="/images/edit.png" alt="edit" class="w-5 h-5" />
                                        </button>

                                        <button class="bg-color-main-red text-white px-2 py-1 rounded"
                                            @click="isDeleteModalOpen = true">
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
            <DeleteSchoolModal v-model="isDeleteModalOpen" @deleted="handleDeleted" />
        </div>




        <!-- Students tab -->
        <div v-if="currentTab === 'students'" class="bg-white p-6 rounded-xl shadow">
            <div class="">
                <!-- Page Title -->
                <div>
                    <div class="flex gap-4">
                        <h2 class="text-xl font-bold">Students list</h2>

                        <div class="flex items-center px-4 rounded-2xl bg-color-main3 text-white text-sm">
                            0123
                        </div>
                    </div>
                </div>

                <!-- Search & Filters -->
                <div class="bg-white pt-3 rounded-xl mb-4">
                    <div class="flex flex-wrap gap-3 items-center">
                        <input type="text" v-model="studentSearchInput" placeholder="Search by device name/serial"
                            class="border rounded-lg px-3 py-2 flex-1" />

                        <select v-model="studentStatusInput" class="border rounded-lg px-3 py-2">
                            <option value="">Status</option>
                            <option>online</option>
                            <option>offline</option>
                        </select>

                        <button class="bg-color-main2 text-white px-4 py-2 rounded-lg" @click="handleSearchStudent">
                            Search
                        </button>
                    </div>

                    <div class="flex gap-3 mt-4">
                        <button @click="isDeleteModalOpen = true"
                            class="flex items-center gap-1 bg-color-main-red text-white px-4 py-2 rounded-lg">
                            <img src="/images/trash.png" alt="trash" class="w-5 h-5" />
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
                                <th class="p-3 text-center">Serial Number</th>
                                <th class="p-3 text-center">Device Name</th>
                                <th class="p-3 text-center">School</th>
                                <th class="p-3 text-center">Location (Last update)</th>
                                <th class="p-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="student in paginatedStudents" :key="student.id"
                                class="border-t hover:bg-gray-50">
                                <td class="p-3"><input type="checkbox" /></td>

                                <!-- Action buttons -->
                                <td class="p-3 text-center">
                                    <div class="flex justify-center gap-2">
                                        <button class="bg-color-main3 text-white px-2 py-1 rounded" @click="$router.push({
                                            path: `/schools/detail/student_detail/${student.id}`, query: {
                                                schoolId: schoolId,
                                            }
                                        })">
                                            <img src="/images/eye.png" alt="eye" class="w-5 h-5" />
                                        </button>
                                        <button class="bg-color-main-red text-white px-2 py-1 rounded"
                                            @click="isDeleteModalOpen = true">
                                            <img src="/images/trash.png" alt="delete" class="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>

                                <td class="p-3 text-center">{{ student.serialNumber }}</td>
                                <td class="p-3 text-center">{{ student.deviceName }}</td>
                                <td class="p-3 text-center">{{ student.school }}</td>
                                <td class="p-3 text-center">{{ student.lat }} , {{ student.lng }}</td>

                                <td class="p-3 text-center">
                                    <span class="px-4 py-1 rounded-full text-white text-sm"
                                        :class="student.status === 'Active' ? 'bg-green-500' : 'bg-color-main-red'">
                                        {{ student.status }}
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
            <DeleteSchoolModal v-model="isDeleteModalOpen" @deleted="handleDeleted" />
        </div>

        <!-- Delete modal -->
        <DeleteSchoolModal v-model="deleteModalOpen" :school="school" @deleted="handleDelete" />
    </div>
</template>
