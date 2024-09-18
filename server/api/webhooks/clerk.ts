import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

export default defineEventHandler(async (event) => {

    const { data, type: eventType } = await readBody(event);

    const { id, email_addresses, first_name } = data;

    if (!id) {
        setResponseStatus(event, 403)
        return ''
    }

    if (eventType === 'user.created') {
        try {
            const emailAddress = email_addresses?.[0]?.email_address;

            const query = await db
                .select()
                .from(users)
                .where(eq(users.email, emailAddress));

            if (query[0]) {
                return createError({
                    statusCode: 400,
                    statusMessage: 'Email already in use'
                })
            }

            const response = await db.insert(users).values({
                id,
                email: emailAddress,
                name: first_name || ''
            });

            console.log('response', response);

            return { success: true }


        } catch (error) {
            return createError({
                statusCode: 500,
                statusMessage: error?.message
            })
        }
    }


});
