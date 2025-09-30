<template>
    <div class="p-6">
        <!-- Page Title -->
        <h1 class="text-2xl font-bold mb-6">Schools</h1>

        <!-- Search & Filters -->
        <div class="bg-white p-4 rounded-xl shadow mb-4">
            <div class="flex flex-wrap gap-3 items-center">
                <input type="text" placeholder="Search" class="border rounded-lg px-3 py-2 flex-1" />

                <select class="border rounded-lg px-3 py-2">
                    <option>School Type</option>
                    <option>Public</option>
                    <option>Private</option>
                    <option>International</option>
                </select>

                <select class="border rounded-lg px-3 py-2">
                    <option>Education Level</option>
                    <option>Elementary</option>
                    <option>Middle</option>
                    <option>High</option>
                </select>

                <select class="border rounded-lg px-3 py-2">
                    <option>Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>

                <button class="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Search
                </button>
            </div>

            <div class="flex gap-3 mt-4">
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    + Create School
                </button>
                <button class="bg-sky-500 text-white px-4 py-2 rounded-lg">
                    + Add School Admin
                </button>
            </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="p-3"><input type="checkbox" /></th>
                        <th class="p-3">Action</th>
                        <th class="p-3">School ID</th>
                        <th class="p-3">School Name</th>
                        <th class="p-3">School Type</th>
                        <th class="p-3">Education Level</th>
                        <th class="p-3">Devices(Students)</th>
                        <th class="p-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="school in schools" :key="school.id" class="border-t hover:bg-gray-50">
                        <td class="p-3"><input type="checkbox" /></td>
                        <td class="p-3 flex gap-2">
                            <button class="bg-blue-500 text-white px-2 py-1 rounded">👁</button>
                            <button class="bg-green-500 text-white px-2 py-1 rounded">✏</button>
                            <button class="bg-red-500 text-white px-2 py-1 rounded">🗑</button>
                        </td>
                        <td class="p-3">{{ school.id }}</td>
                        <td class="p-3">{{ school.name }}</td>
                        <td class="p-3">{{ school.type }}</td>
                        <td class="p-3">{{ school.level }}</td>
                        <td class="p-3">{{ school.devices }}</td>
                        <td class="p-3">
                            <span class="px-2 py-1 rounded text-white text-sm"
                                :class="school.status === 'Active' ? 'bg-green-500' : 'bg-red-500'">
                                {{ school.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="flex justify-between items-center p-4">
                <button class="text-gray-500">&lt; Previous</button>
                <div class="flex gap-2">
                    <button v-for="page in [1, 2, 3, 4, 5]" :key="page" class="px-3 py-1 rounded"
                        :class="page === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'">
                        {{ page }}
                    </button>
                    <span>...</span>
                    <button class="px-3 py-1 bg-gray-200 rounded">11</button>
                </div>
                <button class="text-gray-500">Next &gt;</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const schools = [
    { id: "00001", name: "Piyo Piyo Elementary School", type: "Public", level: "Elementary", devices: 345, status: "Active" },
    { id: "00002", name: "Sunnydale High School", type: "Public", level: "High", devices: 1200, status: "Inactive" },
    { id: "00003", name: "Greenwood Middle School", type: "Public", level: "Middle", devices: 600, status: "Active" },
    { id: "00004", name: "Oakridge Academy", type: "Private", level: "Elementary", devices: 230, status: "Active" },
    { id: "00005", name: "Westfield High School", type: "Public", level: "High", devices: 1100, status: "Active" },
    { id: "00006", name: "Riverside Charter School", type: "Private", level: "Elementary", devices: 400, status: "Inactive" },
    { id: "00007", name: "Maple Leaf International School", type: "International", level: "High", devices: 800, status: "Active" },
    { id: "00008", name: "Cedar Valley School for Arts", type: "Private", level: "Middle", devices: 300, status: "Active" },
    { id: "00009", name: "Pine Tree Academy", type: "Private", level: "Elementary", devices: 250, status: "Active" },
    { id: "00010", name: "Blue Ocean School", type: "Public", level: "High", devices: 950, status: "Active" },
]
</script>
