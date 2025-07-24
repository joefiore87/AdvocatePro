import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestoreAdmin } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

interface PaymentData {
  customerId: string;
  email: string;
  sessionId: string;
  paymentStatus: string;
  purchaseDate: Date;
  expirationDate: Date;
  amountPaid: number;
  firebaseUid?: string;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    const firestore = await getFirestoreAdmin();
    if (!firestore) {
      console.error('Firestore not initialized');
      return NextResponse.json(
        { error: 'Service unavailable' },
        { status: 503 }
      );
    }
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.payment_status === 'paid') {
          const customerEmail = session.customer_details?.email;
          
          if (!customerEmail) {
            console.error('No customer email found in session');
            break;
          }
          
          // Calculate expiration date (1 year from purchase)
          const purchaseDate = new Date(session.created * 1000);
          const expirationDate = new Date(purchaseDate);
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);
          
          const paymentData: PaymentData = {
            customerId: session.customer?.toString() || session.client_reference_id || 'unknown',
            email: customerEmail,
            sessionId: session.id,
            paymentStatus: session.payment_status,
            purchaseDate: purchaseDate,
            expirationDate: expirationDate,
            amountPaid: session.amount_total || 0,
            firebaseUid: session.metadata?.firebaseUid || session.client_reference_id || undefined
          };
          
          // Store payment record in Firestore
          await firestore
            .collection('payments')
            .doc(customerEmail)
            .set(paymentData);
          
          console.log(`Payment processed for ${customerEmail}`);
        }
        
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
