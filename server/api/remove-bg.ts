import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
});

export default defineEventHandler(async (event) => {

    const { auth } = event.context;

    // const userId = auth?.userId;

    const { image } = await readBody(event);

    // if (!(userId)) {
    //     throw createError({
    //         statusCode: 401,
    //         statusMessage: "Unauthorized"
    //     });
    // }

    if (!image) {
        throw createError({
            statusCode: 400,
            statusMessage: "Image is required"
        });
    }

    // const freeTrial = await checkApiLimit(userId);
    // const isPro = await checkSubscription(userId);

    // if (!freeTrial && !isPro) {
    //     throw createError({
    //         statusCode: 403,
    //         statusMessage: "Free trial has expired. Please upgrade to pro.",
    //     });
    // }

    const input = {
        image,
    };

    try {
        const output = await replicate.run("cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003", { input });
        return output;

    } catch (error) {
        console.log("[REMOVE_IMAGE_BG_ERROR]", error);
        return createError({
            statusCode: 500,
            statusMessage: "Internal Error"
        });
    }
}); 