<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CreateSchoolModal from "~/components/CreateSchoolModal.vue"
import AddSchoolModal from "~~/components/AddSchoolModal.vue"
import DeleteSchoolModal from '~/components/DeleteSchoolModal.vue'

// route params
const route = useRoute()
const router = useRouter()
const schoolId = route.params.id

// modal delete
const deleteModalOpen = ref(false)

// current tab
const currentTab = ref('info')

const isCreateSchoolModalOpen = ref(false)
const isAddSchoolModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

// mock data
const school = ref({
    id: schoolId,
    name: 'Piyo Piyo Elementary School',
    type: 'Public',
    level: 'Elementary',
    address: 'Worem ipsum dolor sit amet...',
    lat: '0293481',
    lng: '0294820357',
    contactNumber: '021234567890',
    email: 'piyopiyoschool@mail.com',
    website: 'http://www.piyopiyo.ac.th/',
    status: 'Active',
})

const staffs = ref([
    { id: "S001", name: "John Doe", email: "john.doe@mail.com", phone: "0812345678", role: "Admin", status: "Active" },
    { id: "S002", name: "Jane Smith", email: "jane.smith@mail.com", phone: "0898765432", role: "Staff", status: "Inactive" },
    { id: "S003", name: "Somchai Lek", email: "somchai@mail.com", phone: "0801112233", role: "User", status: "Active" },
    { id: "S004", name: "Maria Chan", email: "maria.chan@mail.com", phone: "0823456789", role: "Staff", status: "Active" },
    { id: "S005", name: "Arthit Wong", email: "arthit@mail.com", phone: "0834567890", role: "Admin", status: "Pending" },
    { id: "S006", name: "Linda Lee", email: "linda@mail.com", phone: "0845678901", role: "User", status: "Inactive" },
    { id: "S007", name: "Nattapong J.", email: "nattapong@mail.com", phone: "0856789012", role: "Staff", status: "Active" },
    { id: "S008", name: "Chanida Ph.", email: "chanida@mail.com", phone: "0867890123", role: "User", status: "Pending" },
    { id: "S009", name: "David Tan", email: "david.tan@mail.com", phone: "0878901234", role: "Staff", status: "Inactive" },
    { id: "S010", name: "Apinya S.", email: "apinya@mail.com", phone: "0889012345", role: "Admin", status: "Active" },
    { id: "S011", name: "Kittisak N.", email: "kittisak@mail.com", phone: "0812223344", role: "User", status: "Active" },
    { id: "S012", name: "Woranuch L.", email: "woranuch@mail.com", phone: "0823334455", role: "Staff", status: "Pending" },
    { id: "S013", name: "Michael Chen", email: "michael@mail.com", phone: "0834445566", role: "Admin", status: "Active" },
    { id: "S014", name: "Supaporn K.", email: "supaporn@mail.com", phone: "0845556677", role: "User", status: "Active" },
    { id: "S015", name: "Tawan P.", email: "tawan@mail.com", phone: "0856667788", role: "Staff", status: "Pending" },
    { id: "S016", name: "Alice Wong", email: "alice@mail.com", phone: "0867778899", role: "Admin", status: "Active" },
    { id: "S017", name: "Prasert J.", email: "prasert@mail.com", phone: "0878889900", role: "User", status: "Active" },
    { id: "S018", name: "Yingluck T.", email: "yingluck@mail.com", phone: "0889990011", role: "Staff", status: "Active" },
    { id: "S019", name: "Victor Lim", email: "victor@mail.com", phone: "0890001122", role: "Staff", status: "Pending" },
    { id: "S020", name: "Suchada P.", email: "suchada@mail.com", phone: "0811112233", role: "User", status: "Active" },
    { id: "S021", name: "Jonathan K.", email: "jonathan@mail.com", phone: "0822223344", role: "Staff", status: "Active" },
    { id: "S022", name: "Siriwan L.", email: "siriwan@mail.com", phone: "0833334455", role: "Admin", status: "Pending" },
    { id: "S023", name: "Peter Zhang", email: "peter@mail.com", phone: "0844445566", role: "User", status: "Active" },
    { id: "S024", name: "Kanokwan R.", email: "kanokwan@mail.com", phone: "0855556677", role: "Staff", status: "Active" },
    { id: "S025", name: "Matthew G.", email: "matthew@mail.com", phone: "0866667788", role: "User", status: "Pending" },
    { id: "S026", name: "Sompong T.", email: "sompong@mail.com", phone: "0877778899", role: "Admin", status: "Active" },
    { id: "S027", name: "Nicha W.", email: "nicha@mail.com", phone: "0888889900", role: "Staff", status: "Active" },
    { id: "S028", name: "William C.", email: "william@mail.com", phone: "0899990011", role: "User", status: "Active" },
    { id: "S029", name: "Chaiwat K.", email: "chaiwat@mail.com", phone: "0812349876", role: "Staff", status: "Inactive" },
    { id: "S030", name: "Suda Ph.", email: "suda@mail.com", phone: "0823456781", role: "Admin", status: "Active" },
])

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

// event handler delete
function handleDelete() {
    console.log('Deleted school:', school.value)
    // สามารถ redirect กลับ list
    router.push('/schools')
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

const paginatedStaffs = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return staffs.value.slice(start, start + pageSize)
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

// mock students data
const students = ref(
    Array.from({ length: 50 }, (_, i) => ({
        id: `ST${String(i + 1).padStart(3, "0")}`,
        serialNumber: `SN${1000 + i}`,
        deviceNumber: `DV${2000 + i}`,
        school: school.value.name,
        location: `Zone ${i % 5 + 1} (${new Date().toLocaleTimeString()})`,
        status: i % 2 === 0 ? "Active" : "Inactive",
    }))
)

const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return students.value.slice(start, start + pageSize)
})

function deleteSchool() { }

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

        <!-- Tab content -->
        <div v-if="currentTab === 'info'" class="bg-white p-6 rounded-xl shadow">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <div class="flex gap-3">
                        <h2 class="text-xl font-bold">{{ school.name }}</h2>

                        <div class="flex items-center px-4 rounded-2xl text-white text-sm"
                            :class="school.status === 'Active' ? 'bg-green-500' : 'bg-red-500'">
                            {{ school.status }}
                        </div>
                    </div>

                    <div class="text-sm text-gray-500 mt-1">School ID: {{ school.id }}</div>
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
                    <p><strong>School Type</strong> <br> {{ school.type }}</p>
                    <p class="mt-2"><strong>Education Level</strong> <br> {{ school.level }}</p>
                    <p class="mt-2"><strong>Address</strong> <br> {{ school.address }}</p>
                    <p class="mt-2"><strong>Latitude / Longitude</strong> <br> {{ school.lat }} / {{ school.lng }}</p>
                    <p class="mt-2"><strong>Contact Number</strong> <br> {{ school.contactNumber }}</p>
                    <p class="mt-2"><strong>School Email</strong> <br> {{ school.email }}</p>
                    <p class="mt-2"><strong>Website</strong> <br>
                        <a :href="school.website" class="text-blue-500" target="_blank">{{ school.website }}</a>
                    </p>

                    <button @click="deleteModalOpen = true" class="text-blue-500 font-bold mt-4 underline">
                        Delete School
                    </button>
                </div>
            </div>
        </div>







        <!-- Placeholder tabs -->
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
                        <input type="text" placeholder="Search" class="border rounded-lg px-3 py-2 flex-1" />

                        <select class="border rounded-lg px-3 py-2 pr-20">
                            <option>Role</option>
                            <option>Admin</option>
                            <option>Staff</option>
                            <option>User</option>
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
                        <button @click="isAddSchoolModalOpen = true"
                            class="flex items-center gap-1 bg-color-main2 text-white px-4 py-2 rounded-lg">
                            <img src="/images/person_plus.png" alt="person_plus" class="w-4 h-4">
                            Add School Admin
                        </button>

                        <button @click="isDeleteModalOpen = true"
                            class="flex items-center gap-1 bg-color-main-red text-white px-4 py-2 rounded-lg">
                            <img src="/images/trash.png" alt="trash" class="w-5 h-5">
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
                                <td class="p-3 text-center">{{ staff.phone }}</td>
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
            <AddSchoolModal v-model="isAddSchoolModalOpen" @added="handleAdded" />
            <DeleteSchoolModal v-model="isDeleteModalOpen" @deleted="handleDeleted" />
        </div>






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
                        <input type="text" placeholder="Search" class="border rounded-lg px-3 py-2 flex-1" />

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
                        <button @click="isDeleteModalOpen = true"
                            class="flex items-center gap-1 bg-color-main-red text-white px-4 py-2 rounded-lg">
                            <img src="/images/trash.png" alt="trash" class="w-5 h-5">
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
                                        <button class="bg-color-main3 text-white px-2 py-1 rounded"
                                            @click="$router.push(`/schools/detail/student_detail/${student.id}`)">
                                            <img src="/images/eye.png" alt="eye" class="w-5 h-5" />
                                        </button>
                                        <button class="bg-color-main-red text-white px-2 py-1 rounded"
                                            @click="isDeleteModalOpen = true">
                                            <img src="/images/trash.png" alt="delete" class="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>

                                <td class="p-3 text-center">{{ student.serialNumber }}</td>
                                <td class="p-3 text-center">{{ student.deviceNumber }}</td>
                                <td class="p-3 text-center">{{ student.school }}</td>
                                <td class="p-3 text-center">{{ student.location }}</td>

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
            <AddSchoolModal v-model="isAddSchoolModalOpen" @added="handleAdded" />
            <DeleteSchoolModal v-model="isDeleteModalOpen" @deleted="handleDeleted" />
        </div>

        <!-- Delete modal -->
        <DeleteSchoolModal v-model="deleteModalOpen" :school="school" @deleted="handleDelete" />
    </div>
</template>
