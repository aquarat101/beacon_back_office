<script setup>
import DeleteSchoolUserModal from "~/components/DeleteSchoolUserModal.vue";

const { public: config } = useRuntimeConfig();
const { user, schoolId, isLoading, fetchUser } = useSchoolUsers(
  config.apiDomain
);
const router = useRouter();
const deleteModalOpen = ref(false);

function handleDeleted() {
  alert("User deleted successfully.");
  router.push("/users");
}

onMounted(fetchUser);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">User Detail</h1>
    <button @click="router.back()" class="text-blue-500 mb-4 text-lg">
      &lt; Back
    </button>

    <div v-if="isLoading" class="text-gray-500">Loading...</div>
    <div v-else-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>

    <div v-else-if="user" class="bg-white p-6 rounded-xl shadow relative">
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="flex gap-3 mb-1">
            <h2 class="text-xl font-bold">{{ user.name }}</h2>

            <span
              class="text-sm text-white px-2 py-1 rounded-full"
              :class="user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'"
            >
              {{ user.status }}
            </span>
          </div>

          <div class="text-sm text-gray-500 mt-1">user ID: {{ user.id }}</div>
        </div>

        <button
          class="flex bg-blue-500 text-white px-4 py-2 rounded"
          @click="
            $router.push({
              path: `/users/edit/${user.id}`,
              query: { schoolId: schoolId },
            })
          "
        >
          <img src="/images/edit.png" alt="edit" class="w-5 h-5 mr-1 mt-0.5" />
          Edit
        </button>
      </div>

      <div class="flex flex-col gap-6">
        <img
          :src="user.avatar || '/image-avatars/1.png'"
          alt="user"
          class="w-24 h-24 rounded-full"
        />

        <div class="flex-1">
          <p class="mt-2">
            <strong>Email</strong><br />
            <span class="text-gray-600">{{ user.email }}</span>
          </p>

          <p class="mt-2">
            <strong>Phone Number</strong><br />
            <span class="text-gray-600">{{ user.phone_number }}</span>
          </p>

          <p class="mt-2">
            <strong>Role</strong><br />
            <span class="text-gray-600">{{ user.role }}</span>
          </p>

          <p class="mt-2">
            <strong>School</strong><br />
            <span class="text-gray-600">{{ user.schoolName }}</span>
          </p>

          <button
            @click="deleteModalOpen = true"
            class="text-blue-500 font-semibold mt-6 underline"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ Modal -->
    <DeleteSchoolUserModal
      v-model="deleteModalOpen"
      :schoolUser="user"
      @deleted="handleDeleted"
    />
  </div>
</template>
