import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
});

export default defineEventHandler(async (event) => {

    const { auth } = event.context;

    // const userId = auth?.userId;

    const { prompt } = await readBody(event);

    // if (!(userId)) {
    //     throw createError({
    //         statusCode: 401,
    //         statusMessage: "Unauthorized"
    //     });
    // }

    if (!prompt) {
        throw createError({
            statusCode: 400,
            statusMessage: "Prompt are required"
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
        cfg: 3.5,
        steps: 28,
        prompt: prompt,
        aspect_ratio: "3:2",
        output_format: "webp",
        output_quality: 90,
        negative_prompt: "",
        prompt_strength: 0.85
    };

    try {
        const output = await replicate.run("stability-ai/stable-diffusion-3", { input });
        return output;

    } catch (error) {
        console.log("[GENERATE_IMAGE_ERROR]", error);
        return createError({
            statusCode: 500,
            statusMessage: "Internal Error"
        });
    }
}); 