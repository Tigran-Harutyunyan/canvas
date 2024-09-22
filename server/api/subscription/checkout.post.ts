import { getAuth, clerkClient } from '#clerk';
import Stripe from "stripe";

const STRIPE_API_KEY = useRuntimeConfig().stripeKey as string;
const APP_URL = useRuntimeConfig().public.appUrl as string;
const STRIPE_PRICE_ID = useRuntimeConfig().stripePriceId as string;

const stripe = new Stripe(STRIPE_API_KEY, {
    apiVersion: "2024-06-20",
    typescript: true,
});

export default defineEventHandler(async (event) => {
    const { userId } = getAuth(event);

    if (!userId) {
        setResponseStatus(event, 403);
        return;
    }

    const user = await clerkClient(event).users.getUser(userId);

    try {

        const session = await stripe.checkout.sessions.create({
            success_url: `${APP_URL}?success=1`,
            cancel_url: `${APP_URL}?canceled=1`,
            payment_method_types: ["card", "paypal"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress || "",
            line_items: [
                {
                    price: STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
            },
        });

        return { url: session.url };
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }

});



