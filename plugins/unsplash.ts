import { createApi } from "unsplash-js";

export default defineNuxtPlugin(async (nuxtApp) => {
    const unsplashAccessKey = useRuntimeConfig().public.unsplashAccessKey as string;
    const unsplash = createApi({
        accessKey: unsplashAccessKey,
        fetch: fetch,
    });
    nuxtApp.unsplash = unsplash
});