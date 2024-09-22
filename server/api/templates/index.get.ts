import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { getAuth } from '#clerk';
import { eq, asc, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const { userId } = getAuth(event);
    const query = await getQuery(event);

    if (!userId) {
        setResponseStatus(event, 403)
        return;
    }

    try {

        const limit = Number(query?.limit);
        const page = Number(query?.page);

        const response = await db
            .select()
            .from(projects)
            .where(eq(projects.isTemplate, true))
            .limit(limit)
            .offset((page - 1) * limit)
            .orderBy(
                asc(projects.isPro),
                desc(projects.updatedAt),
            );

        return response;
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }

}); 