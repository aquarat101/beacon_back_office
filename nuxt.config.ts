// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiDomain: process.env.API_DOMAIN || 'http://localhost:3001',
    },
  },

  css: ['~/assets/css/tailwind.css', '~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
})