<template>
    <div class="flex">
        <!-- Sidebar (fixed) -->
        <aside class="w-64 bg-white shadow flex flex-col fixed top-0 left-0 h-screen">
            <!-- Logo -->
            <div class="flex items-center text-center px-6 py-4 bg-blue-500 text-white font-bold rounded-tr-3xl">
                <img src="/images/logo.png" alt="logo" class="w-14 h-14 rounded-full" />
                <div class="flex flex-col items-start ml-4">
                    <div class="text-xl">Piyo Piyo</div>
                    <div class="text-md font-normal">Back office</div>
                </div>
            </div>

            <!-- Menu -->
            <nav class="flex-1 mt-4">
                <ul>
                    <li>
                        <NuxtLink to="/" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            active-class="bg-blue-50 border-r-4 border-blue-500 text-blue-600">
                            <span>🏠</span>
                            <span>Dashboard</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/schools" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            active-class="bg-blue-50 border-r-4 border-blue-500 text-blue-600">
                            <span>🎓</span>
                            <span>Schools</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/devices" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            active-class="bg-blue-50 border-r-4 border-blue-500 text-blue-600">
                            <span>📱</span>
                            <span>Devices</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/users" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            active-class="bg-blue-50 border-r-4 border-blue-500 text-blue-600">
                            <span>👤</span>
                            <span>Users</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/system-log" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            active-class="bg-blue-50 border-r-4 border-blue-500 text-blue-600">
                            <span>⚙️</span>
                            <span>System Log</span>
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
                <button class="ml-auto text-gray-500 hover:text-black">⏏</button>
            </div>
        </aside>

        <!-- Main content -->
        <main class="flex-1 bg-gray-50 ml-64 h-screen overflow-y-auto">
            <slot />
        </main>
    </div>
</template>
