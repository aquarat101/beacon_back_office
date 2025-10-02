<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
    { name: 'Dashboard', path: '/dashboard', img: '/images/layout/dashboard.png' },
    { name: 'Schools', path: '/schools', img: '/images/layout/school.png' },
    { name: 'Devices', path: '/devices', img: '/images/layout/device.png' },
    { name: 'Users', path: '/users', img: '/images/layout/user.png' },
    { name: 'System Log', path: '/system_log', img: '/images/layout/system_log.png' }
]
</script>


<template>
    <div class="flex">
        <aside class="w-64 bg-white shadow flex flex-col fixed top-0 left-0 h-screen">
            <!-- Logo -->
            <div class="flex items-center text-center px-6 py-5 bg-color-main2 text-white font-bold rounded-tr-3xl">
                <img src="/images/layout/logo.png" alt="logo" class="w-14 h-14 rounded-full" />
                <div class="flex flex-col items-start ml-4">
                    <div class="text-xl">Piyo Piyo</div>
                    <div class="text-md font-normal">`Back office`</div>
                </div>
            </div>

            <!-- Menu -->
            <nav class="flex-1 mt-2">
                <ul>
                    <li v-for="item in menuItems" :key="item.path">
                        <NuxtLink :to="item.path" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100" :class="{
                            'bg-blue-100 border-r-4 border-blue-500 text-blue-600':
                                item.path === '/'
                                    ? route.path === '/'
                                    : route.path.startsWith(item.path)
                        }">
                            <img :src="(
                                item.path === '/'
                                    ? route.path === '/'
                                    : route.path.startsWith(item.path)
                            ) ? item.img.replace('.png', '_blue.png') : item.img" class="w-6 h-6 object-contain" :alt="item.name" />
                            <span class="pl-1">{{ item.name }}</span>
                        </NuxtLink>
                    </li>
                </ul>
            </nav>

            <!-- Bottom Profile -->
            <div class="mt-auto border-t p-4 flex items-center gap-2 text-sm text-gray-600">
                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    👤
                </div>
                <div>
                    <div class="font-medium">Admin</div>
                    <div class="text-xs">admin@mail.com</div>
                </div>
                <button class="ml-auto text-gray-500 hover:text-black">
                    <img src="/images/layout/log_out.png" alt="log_out" class="w-6 h-6">
                </button>
            </div>
        </aside>

        <!-- Main content -->
        <main class="flex-1 bg-gray-50 ml-64 h-screen overflow-y-auto">
            <slot />
        </main>
    </div>
</template>
