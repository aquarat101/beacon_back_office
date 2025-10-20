<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
    layout: false
})

const { public: config } = useRuntimeConfig()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const loading = ref(false)
const showModal = ref(false)
const modalMessage = ref('')
const errorMessage = ref('')

const handleSubmit = async () => {
    errorMessage.value = ''

    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match'
        return
    }

    try {
        showModal.value = true
        modalMessage.value = 'Signing up...'
        loading.value = true

        const { data, error } = await useFetch(`${config.apiDomain}/auth/register`, {
            method: 'POST',
            body: { name: name.value, email: email.value, password: password.value }
        })

        if (error.value) throw error.value.data?.message || 'Registration failed'

        modalMessage.value = '✅ Signup successfully!!!'
        setTimeout(() => {
            showModal.value = false
            router.push('/auth/login')
        }, 1500)
    } catch (err) {
        showModal.value = false
        errorMessage.value = err.message || 'Server error'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="flex h-screen overflow-hidden">
        <!-- Left image -->
        <div class="flex w-1/2 h-full justify-center items-center bg-blue-200">
            <img src="/images/login.png" alt="login" class="w-full h-full" />
        </div>

        <!-- Form -->
        <div class="w-1/2 h-full flex justify-center items-center bg-white">
            <div class="w-full max-w-md px-6">
                <h2 class="text-4xl font-bold text-color-main3 mb-6">Register</h2>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <label class="block text-sm text-gray-500">Name</label>
                        <input v-model="name" type="text" required
                            class="mt-1 block w-full px-4 py-2 border rounded-md border-gray-300" />
                    </div>

                    <div>
                        <label class="block text-sm text-gray-500">Email</label>
                        <input v-model="email" type="email" required
                            class="mt-1 block w-full px-4 py-2 border rounded-md border-gray-300" />
                    </div>

                    <div>
                        <label class="block text-sm text-gray-500">Password</label>
                        <div class="relative">
                            <input :type="isPasswordVisible ? 'text' : 'password'" v-model="password" required
                                class="mt-1 block w-full px-4 py-2 border rounded-md border-gray-300 pr-10" />
                            <button type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                @click="isPasswordVisible = !isPasswordVisible">
                                {{ isPasswordVisible ? 'Hide' : 'Show' }}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-500">Confirm Password</label>
                        <div class="relative">
                            <input :type="isConfirmPasswordVisible ? 'text' : 'password'" v-model="confirmPassword"
                                required class="mt-1 block w-full px-4 py-2 border rounded-md border-gray-300 pr-10" />
                            <button type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                @click="isConfirmPasswordVisible = !isConfirmPasswordVisible">
                                {{ isConfirmPasswordVisible ? 'Hide' : 'Show' }}
                            </button>
                        </div>
                    </div>

                    <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

                    <button type="submit"
                        class="w-1/2 py-3 px-4 bg-color-main2 text-white font-normal rounded-full shadow hover:bg-blue-700"
                        :disabled="loading">
                        {{ loading ? 'Creating...' : 'Sign Up' }}
                    </button>
                </form>

                <p class="mt-2 text-left text-sm text-gray-600">
                    Already have an account?
                    <NuxtLink to="/auth/login" class="text-blue-600 underline">Sign in</NuxtLink>
                </p>
            </div>
        </div>

        <!-- Modal Loading -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 flex flex-col items-center shadow-lg w-64">
                <div class="loader border-t-4 border-blue-500 rounded-full w-10 h-10 mb-3 animate-spin" v-if="loading">
                </div>
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
