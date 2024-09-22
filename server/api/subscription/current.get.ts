import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";
import { getAuth } from '#clerk';
import { eq } from "drizzle-orm";
import { checkIsActive } from "@/features/subscriptions/lib";

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

        const active = checkIsActive(subscription);

        return {
            data: {
                ...subscription,
                active,
            },
        };
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }

}); 