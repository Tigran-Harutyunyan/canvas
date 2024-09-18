import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { getAuth } from '#clerk';

export default defineEventHandler(async (event) => {
    const { userId } = getAuth(event)
    const { data } = await readBody(event);

    if (!userId) {
        setResponseStatus(event, 403)
        return;
    }

    try {

        const response = await db
            .insert(projects)
            .values({
                name: data.name,
                json: data.json,
                width: data.width,
                height: data.height,
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        if (!response[0]) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Something went wrong'
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