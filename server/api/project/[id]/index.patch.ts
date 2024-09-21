import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { getAuth } from '#clerk';
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const { userId } = getAuth(event)
    const params = event.context.params;

    const { values } = await readBody(event);

    if (!userId) {
        setResponseStatus(event, 403)
        return;
    }

    try {

        const response = await db
            .update(projects)
            .set({
                ...values,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(projects.id, params?.id as string),
                    eq(projects.userId, userId),
                ),
            )
            .returning();

        if (response?.length === 0) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            });
        }

        return response[0];
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }

}); 