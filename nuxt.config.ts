// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  // build: {
  //   transpile: ['vue3-colorpicker']
  // },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@hebilicious/vue-query-nuxt',
    "@uploadthing/nuxt"
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  runtimeConfig: {
    public: {
      unsplashAccessKey: process.env.NUXT_PUBLIC_UNSPLASH_ACCESS_KEY,
      // clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      // cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      // cloudApiKey: process.env.CLOUDINARY_API_KEY,
      // appUrl: process.env.APP_URL,
    }
  },
})