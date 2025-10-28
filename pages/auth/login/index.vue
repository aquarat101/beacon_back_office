<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  layout: false,
});

const { public: config } = useRuntimeConfig();

const user = ref({});
const schoolId = ref("");

const email = ref("");
const password = ref("");
const isPasswordVisible = ref(false);
const loading = ref(false);
const showModal = ref(false);
const modalMessage = ref("");
const errorMessage = ref("");
const router = useRouter();

const handleSubmit = async () => {
  errorMessage.value = "";
  try {
    showModal.value = true;
    modalMessage.value = "Logging in...";
    loading.value = true;

    const { data, error } = await useFetch(`${config.apiDomain}/auth/login`, {
      method: "POST",
      body: { email: email.value, password: password.value },
    });

    if (error.value) throw error.value.data?.message || "Login failed";

    // 🔹 เก็บลง localStorage
    localStorage.setItem("token", data.value.token);
    localStorage.setItem("user", JSON.stringify(data.value.user));
    localStorage.setItem("schoolId", data.value.user.school || "");
    localStorage.setItem("schoolName", data.value.user.schoolName || "");

    // localStorage.setItem('token', data.value.token)
    // localStorage.setItem('user', JSON.stringify(data.value.user))

    modalMessage.value = "✅ Login successfully!!!";

    let resolvedSchoolId = "";
    console.log("School name : ", data.value.user.school);
    if (data.value.user.school) {
      try {
        const res = await fetch(
          `${config.apiDomain}/schools/getSchoolIdByName/${data.value.user.school}`
        );
        if (res.ok) {
          const schoolData = await res.json();
          console.log("School data : ", schoolData);
          resolvedSchoolId = schoolData.schoolId;
          localStorage.setItem("schoolId", resolvedSchoolId);
        } else {
          console.warn(
            "❗ School not found from name:",
            data.value.user.school
          );
          localStorage.setItem("schoolId", "");
        }
      } catch (err) {
        console.error("Error fetching schoolId:", err);
        localStorage.setItem("schoolId", "");
      }
    }

    console.log("DATA : ", data.value);
    console.log("DATA ROLE : ", data.value.user.role);

    if (
      data.value.user.role === "school_admin" ||
      data.value.user.role === "school_staff"
    ) {
      setTimeout(() => {
        showModal.value = false;
        router.push(`/dashboard/${resolvedSchoolId}`);
      }, 1500);
    } else if (data.value.user.role === "super_admin") {
      // -- Super Admin Role --
      setTimeout(() => {
        showModal.value = false;
        router.push(`/dashboard/`);
      }, 1500);
    } else {
      alert("Can't access with user role");
      console.log("Error, user role");
      showModal.value = false;
    }

    // if (process.client) {
    //     const storedUser = localStorage.getItem('user')
    //     if (storedUser) {
    //         user.value = JSON.parse(storedUser)
    //     }

    //     if (user.role === "school_admin" || user.role === "school_staff") {
    //         setTimeout(() => {
    //             showModal.value = false
    //             router.push(`/dashboard/${data.value.user.school}`)
    //         }, 1500)

    //     } else { // -- Super Admin Role --
    //         setTimeout(() => {
    //             showModal.value = false
    //             router.push(`/dashboard/`)
    //         }, 1500)

    //     }
    // }
  } catch (err) {
    showModal.value = false;
    errorMessage.value = err.message || "Server error";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <div class="flex w-1/2 h-full justify-center items-center bg-blue-200">
      <img src="/images/login.png" alt="login" class="w-full h-full" />
    </div>

    <div class="w-1/2 h-full flex justify-center items-center bg-white">
      <div class="w-full max-w-md px-6">
        <h2 class="text-4xl font-bold text-color-main3 mb-6">Log In</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-500">Email</label>
            <input
              type="email"
              v-model="email"
              required
              class="mt-1 block w-full px-4 py-2 border rounded-md border-gray-300"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-500">Password</label>
            <div class="relative">
              <input
                :type="isPasswordVisible ? 'text' : 'password'"
                v-model="password"
                required
                class="mt-1 block w-full px-4 py-2 border rounded-md border-gray-300 pr-10"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                @click="isPasswordVisible = !isPasswordVisible"
              >
                {{ isPasswordVisible ? "Hide" : "Show" }}
              </button>
            </div>
          </div>

          <p v-if="errorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            class="w-1/2 py-3 px-4 bg-color-main2 text-white font-normal rounded-full shadow hover:bg-blue-700"
            :disabled="loading"
          >
            {{ loading ? "Logging in..." : "Sign In" }}
          </button>
        </form>

        <p class="mt-2 text-left text-sm text-gray-600">
          Don't have an account?
          <NuxtLink to="/auth/signup" class="text-blue-600 underline"
            >Sign Up</NuxtLink
          >
        </p>
      </div>
    </div>

    <!-- Modal Loading -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg p-6 flex flex-col items-center shadow-lg w-64"
      >
        <div
          class="loader border-t-4 border-blue-500 rounded-full w-10 h-10 mb-3 animate-spin"
          v-if="loading"
        ></div>
        <p class="text-gray-700 text-center font-medium">{{ modalMessage }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top-color: #3b82f6;
  border-radius: 50%;
}
</style>
