<script setup>
const router = useRouter()
const { public: config } = useRuntimeConfig()
const { selectedAvatar,form , isLoading , fetchUserById , getSchool , handleSave , confirmAvatar } = useSchoolUsers(
  config.apiDomain
);
  const avatars = [
    "/image-avatars/1.png",
    "/image-avatars/2.png",
    "/image-avatars/3.png",
    "/image-avatars/4.png",
    "/image-avatars/5.png",
    "/image-avatars/6.png",
  ];
// const schoolTypes = ["Piyo Piyo Elementary School", "Privi", "Chonburi"]
const statusOptions = ["Active", "Inactive"]
const showAvatarPopup = ref(false)

onMounted(() => {
    fetchUserById()
    getSchool()
})

</script>

<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Edit User Detail</h1>
        <button @click="router.back()" class="text-blue-500 mb-4 text-lg">&lt; Back</button>

        <div v-if="isLoading" class="text-center py-10 text-gray-500">Loading...</div>

        <div v-else class="bg-white shadow rounded-xl p-6">
            <!-- ✅ ส่วน Avatar -->
            <div class="flex items-center mb-6">
                <div class="relative">
                    <img :src="form.avatar || '/images/layout/logo.png'" alt="User Avatar"
                        class="w-24 h-24 rounded-full border object-cover" />
                    <button @click="showAvatarPopup = true"
                        class="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded-full shadow hover:bg-blue-600">
                        <img src="/images/edit.png" alt="edit" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- ฟอร์ม -->
            <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">User ID</label>
                    <input v-model="form.id" type="text" disabled
                        class="w-full border rounded-lg p-2 bg-gray-100 text-gray-400" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Name</label>
                    <input v-model="form.name" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input v-model="form.email" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Phone number</label>
                    <input v-model="form.phoneNumber" type="text" class="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Role</label>
                    <input v-model="form.role" type="text" disabled
                        class="w-full border rounded-lg p-2 bg-gray-100 text-gray-400" />

                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">School</label>
                    <input v-model="form.school" disabled
                        class="w-full border rounded-lg p-2 bg-gray-100 text-gray-400" />

                    </input>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Status</label>
                    <select v-model="form.status" class="w-full border rounded-lg p-2">
                        <option v-for="s in statusOptions" :key="s">{{ s }}</option>
                    </select>
                </div>
            </form>

            <div class="flex justify-end mt-6 gap-2">
                <button type="button" @click="router.push('/schools')"
                    class="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200">
                    Cancel
                </button>
                <button type="button" @click="handleSave"
                    class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                    Save
                </button>
            </div>
        </div>

        <!-- ✅ Avatar Popup -->
        <div v-if="showAvatarPopup" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl p-4 w-80">
                <h2 class="font-bold text-lg text-center mb-4">Select Avatar</h2>
                <div class="grid grid-cols-3 gap-4">
                    <div v-for="avatar in avatars" :key="avatar"
                        class="relative cursor-pointer p-1 rounded-full border-2 transition-all duration-200 hover:border-blue-400 hover:border-4"
                        :class="{ 'border-blue-600 border-4': avatar === selectedAvatar }"
                        @click="selectedAvatar = avatar">
                        <img :src="avatar" class="w-full h-full rounded-full object-cover" />
                        <div v-if="avatar === selectedAvatar"
                            class="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                            <img src="/image-avatars/selected_avatar.png" class="w-1/2 h-1/2 opacity-70" />
                        </div>
                    </div>
                </div>
                <div class="flex justify-between mt-6">
                    <button class="px-4 py-2 rounded bg-gray-200" @click="showAvatarPopup = false">Cancel</button>
                    <button class="px-4 py-2 rounded bg-blue-600 text-white" @click="confirmAvatar">Select</button>
                </div>
            </div>
        </div>
    </div>
</template>
