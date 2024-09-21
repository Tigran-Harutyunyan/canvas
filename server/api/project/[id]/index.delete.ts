import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { getAuth } from '#clerk';
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const { userId } = getAuth(event)
    const params = event.context.params;

    if (!userId) {
        setResponseStatus(event, 403)
        return;
    }

    try {

        const response = await db
            .delete(projects)
            .where(
                and(
                    eq(projects.id, params?.id as string),
                    eq(projects.userId, userId)
                ),
            )
            .returning();

        if (response.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not found'
            });
        }

        return { id: params?.id };
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }

}); 