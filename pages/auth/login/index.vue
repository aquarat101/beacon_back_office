<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
    layout: false
})

const email = ref('')
const password = ref('')
const router = useRouter()

const handleSubmit = () => {
    console.log('Email:', email.value)
    console.log('Password:', password.value)
    router.push('/') // ไปหน้า homepage
}
</script>

<template>
    <div class="flex h-screen overflow-hidden">
        <!-- Left side image -->
        <div class="flex w-1/2 h-full justify-center items-center bg-blue-200">
            <img src="/images/login.png" alt="login" class="max-h-[40%] object-contain">
        </div>

        <!-- Right side login form -->
        <div class="w-1/2 h-full flex justify-center items-center bg-white">
            <div class="w-full max-w-md px-6">
                <h2 class="text-3xl font-bold text-gray-900 mb-6">Log In</h2>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" v-model="email" required placeholder="you@example.com"
                            class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" v-model="password" required placeholder="••••••••"
                            class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300" />
                        <div class="text-right mt-1">
                            <NuxtLink to="/forgot-password" class="text-sm text-blue-600 hover:underline">Forgot your
                                password?</NuxtLink>
                        </div>
                    </div>

                    <button type="submit"
                        class="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500">
                        Sign In
                    </button>
                </form>

                <p class="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?
                    <NuxtLink to="/signup" class="text-blue-600 hover:underline">Sign Up</NuxtLink>
                </p>
            </div>
        </div>
    </div>
</template>
