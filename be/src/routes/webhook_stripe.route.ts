import express, { Request, Response, Router } from 'express';
import Stripe from 'stripe';
import { TransactionService } from '../services/transaction.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

const app = express();
const router = Router()

const transactionService = new TransactionService();

app.post(
    '/',
    // Stripe requires the raw body to construct the event
    express.raw({ type: 'application/json' }),
    async (req: express.Request, res: express.Response) => {
        const sig = req.headers['stripe-signature'];

        console.log("runinggg...");


        let event: Stripe.Event;
        if (sig && webhookSecret) {
            try {
                event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            } catch (err: any) {
                // On error, log and return the error message
                console.log(`❌ Error message: ${err.message}`);
                res.status(400).send(`Webhook Error: ${err.message}`);
                return;
            }

            const stripeObject: Stripe.Checkout.Session = event.data.object as Stripe.Checkout.Session;

            // Cast event data to Stripe object
            if (event.type === 'checkout.session.completed') {

                const orderID = stripeObject.metadata?.orderId

                if (orderID) {

                    await transactionService.updatePaymentStatus({
                        orderId: orderID,
                        status: stripeObject.status!,
                        payment_status: stripeObject.payment_status!,
                        payment_method: stripeObject.payment_method_types[0]
                    });
                } else {
                    console.warn("Order ID not found in PaymentIntent metadata");
                }
            } else {
                console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
            }

            res.json({ received: true });
        }
    }
);

export default app;
