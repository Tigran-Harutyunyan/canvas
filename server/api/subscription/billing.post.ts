import { getAuth } from '#clerk';
import { subscriptions } from "@/db/schema";
import Stripe from "stripe";
import { db } from "@/db/drizzle";

const STRIPE_API_KEY = useRuntimeConfig().stripeKey as string;
const APP_URL = useRuntimeConfig().public.appUrl as string;

const stripe = new Stripe(STRIPE_API_KEY, {
    apiVersion: "2024-06-20",
    typescript: true,
});

export default defineEventHandler(async (event) => {
    const { userId } = getAuth(event);

    if (!userId) {
        setResponseStatus(event, 403)
        return;
    }

    try {

        const [subscription] = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.userId, userId));

        if (!subscription) {
            return createError({
                statusCode: 404,
                statusMessage: "No subscription found"
            })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: subscription.customerId,
            return_url: `${APP_URL}`,
        });

        if (!session.url) {
            return createError({
                statusCode: 400,
                statusMessage: "Failed to create session"
            })
        }

        return { url: session.url };
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }

});



