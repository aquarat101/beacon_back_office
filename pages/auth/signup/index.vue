<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
    layout: false
})

const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isPasswordVisible = ref(false) // state สำหรับโชว์/ซ่อน password
const isConfirmPasswordVisible = ref(false)


const handleSubmit = () => {
    console.log('Email:', email.value)
    console.log('Password:', password.value)
    router.push('/auth/login') // ไปหน้า homepage
}
</script>

<template>
    <div class="flex h-screen overflow-hidden">
        <!-- Left side image -->
        <div class="flex w-1/2 h-full justify-center items-center bg-blue-200">
            <img src="/images/login.png" alt="login" class="w-full h-full">
        </div>

        <!-- Right side login form -->
        <div class="w-1/2 h-full flex justify-center items-center bg-white">
            <div class="w-full max-w-md px-6">
                <h2 class="text-4xl font-bold text-color-main3 mb-6">Register</h2>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-normal text-gray-500">Email</label>
                        <input type="email" v-model="email" required placeholder="you@example.com"
                            class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300" />
                    </div>

                    <!-- Password -->
                    <div>
                        <label class="block text-sm font-normal text-gray-500">Password</label>
                        <div class="relative">
                            <input :type="isPasswordVisible ? 'text' : 'password'" v-model="password" required
                                placeholder="••••••••"
                                class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 pr-10" />

                            <!-- ปุ่ม toggle -->
                            <button type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                @click="isPasswordVisible = !isPasswordVisible">
                                <span v-if="isPasswordVisible" class="hover:underline">Hide</span>
                                <span v-else class="hover:underline">Hide</span>
                            </button>
                        </div>
                    </div>

                    <!-- Confirm password -->
                    <div>
                        <label class="block text-sm font-normal text-gray-500">Confirm password</label>
                        <div class="relative">
                            <input :type="isConfirmPasswordVisible ? 'text' : 'password'" v-model="confirmPassword"
                                required placeholder="••••••••"
                                class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 pr-10" />

                            <!-- ปุ่ม toggle -->
                            <button type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                @click="isConfirmPasswordVisible = !isConfirmPasswordVisible">
                                <span v-if="isConfirmPasswordVisible" class="hover:underline">Hide</span>
                                <span v-else class="hover:underline">Hide</span>
                            </button>
                        </div>
                    </div>


                    <div class="text-right mt-1">
                        <NuxtLink to="/forgot-password" class="text-sm text-blue-600 underline">
                            Forgot your password?
                        </NuxtLink>
                    </div>

                    <!-- Submit -->
                    <button type="submit"
                        class="w-1/2 py-3 px-4 bg-color-main2 text-white font-normal rounded-full shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500">
                        Sign Up
                    </button>
                </form>

                <p class="mt-2 text-left text-sm text-gray-600">
                    Already have an account?
                    <NuxtLink to="/auth/login" class="text-blue-600 underline">Sign in</NuxtLink>
                </p>
            </div>
        </div>
    </div>
</template>
