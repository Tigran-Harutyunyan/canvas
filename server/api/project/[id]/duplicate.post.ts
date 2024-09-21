import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { getAuth } from '#clerk';

export default defineEventHandler(async (event) => {
    const { userId } = getAuth(event);
    const params = event.context.params;

    if (!userId) {
        setResponseStatus(event, 403)
        return;
    }

    try {
        const response = await db
            .select()
            .from(projects)
            .where(
                and(
                    eq(projects.id, params?.id as string),
                    eq(projects.userId, userId),
                ),
            );

        if (response.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not found'
            });
        }

        const project = response[0];

        const duplicateData = await db
            .insert(projects)
            .values({
                name: `Copy of ${project.name}`,
                json: project.json,
                width: project.width,
                height: project.height,
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return { ...duplicateData[0] };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }

}); 