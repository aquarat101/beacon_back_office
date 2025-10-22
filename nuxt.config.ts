// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Piyo Backoffice',
      titleTemplate: '%s - Piyo Backoffice',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Piyo Piyo Backoffice Management System' },
      ],
    }
  },

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