// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    "@uploadthing/nuxt",
    'vue-clerk/nuxt',
    '@pinia/nuxt',
    '@fixers/nuxt-stripe'
  ],

  clerk: {
    afterSignOutUrl: '/sign-in'
  },
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
      appUrl: process.env.APP_URL,
    },
    stripeKey: process.env.STRIPE_API_KEY,
    stripePriceId: process.env.STRIPE_PRICE_ID,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
})