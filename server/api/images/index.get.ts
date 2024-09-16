import { createApi } from "unsplash-js";

export default defineEventHandler(async (event) => {
    const unsplashAccessKey = useRuntimeConfig().public.unsplashAccessKey as string;
    const DEFAULT_COUNT = 50;
    const DEFAULT_COLLECTION_IDS = ["317099"];

    const unsplash = createApi({
        accessKey: unsplashAccessKey,
        fetch: fetch,
    });


    const images = await unsplash.photos.getRandom({
        collectionIds: DEFAULT_COLLECTION_IDS,
        count: DEFAULT_COUNT,
    });

    if (images.errors) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Something went wrong'
        });
    }

    let response = images.response;

    if (!Array.isArray(response)) {
        response = [response];
    }

    return { data: response };

}); 