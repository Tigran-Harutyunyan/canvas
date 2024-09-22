import Stripe from "stripe";
import { defineStripeWebhook } from '@fixers/nuxt-stripe/server';
import { subscriptions } from "@/db/schema";
import { db } from "@/db/drizzle";

/**
 * @param event - the H3 event
 * @param stipe - the Stripe instance
 * @param stripeEvent - the Stripe Webhook event
 */

const STRIPE_API_KEY = useRuntimeConfig().stripeKey as string;

const WEBHOOK_SECRET = useRuntimeConfig().stripeWebhookSecret

const stripe = new Stripe(STRIPE_API_KEY, {
  apiVersion: "2024-06-20"
});

const webhookOptions = {
  webhookSecret: WEBHOOK_SECRET,
  stripe,
}

export default defineStripeWebhook(async ({ event }) => {

  if (!isMethod(event, ['POST'])) {
    setResponseStatus(event, 400)

    return { ok: false }
  }

  // 1
  const body = await readRawBody(event, false);

  let stripeEvent: any = body;
  const signature = getHeader(event, 'stripe-signature')


  stripeEvent = stripe.webhooks.constructEvent(
    body,
    signature,
    WEBHOOK_SECRET
  )

  const session = stripeEvent.data.object as Stripe.Checkout.Session;


  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      if (!session?.metadata?.userId) {
        createError({
          statusCode: 400,
          statusMessage: 'User id is required'
        });
      }

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      if (!session?.metadata?.userId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid session'
        });
      }

      await db
        .insert(subscriptions)
        .values({
          status: subscription.status,
          userId: session.metadata.userId,
          subscriptionId: subscription.id,
          customerId: subscription.customer as string,
          priceId: subscription.items.data[0].price.product as string,
          currentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

    }
    case 'invoice.payment_succeeded': {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      if (!session?.metadata?.userId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid session'
        });
      }

      await db
        .update(subscriptions)
        .set({
          status: subscription.status,
          currentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, subscription.id))
    }

    case 'customer.subscription.updated': {

    }

  }

  return {
    hello: 'world'
  }

}, webhookOptions); 