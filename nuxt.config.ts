export default defineNuxtConfig({
  app: {
    head: {
      title: "Piyo Backoffice"
    }
  },

  runtimeConfig: {
    public: {
      apiDomain: process.env.API_DOMAIN || 'http://localhost:3001',
    },
  },

  css: ['~/assets/css/tailwind.css', '~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
})
