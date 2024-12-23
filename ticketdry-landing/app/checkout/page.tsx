"use client"

import React, { forwardRef, useRef, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentInfo from '@/components/PaymentInfo';
import UserInfo from '@/components/UserInfo';
import TermsAndConditions from '@/components/TermsAndConditions';
import Cart from '@/components/Cart';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Event } from '@/components/FeaturedEvents';
import { loadStripe} from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import AdditionalGuests from '@/components/AdditionalGuests';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(publishableKey || '');

const CheckoutForm = forwardRef<HTMLFormElement>((props, ref) => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const stripe = useStripe();
  const elements = useElements();
  const methods = useForm();
  const { handleSubmit } = methods;
  const router = useRouter();

  const [eventData, setEventData] = useState<Event>();
  const [showModal, setShowModal] = useState(false);
  const [attendeesNumber, setAttendeesNumber] = useState(1);
  const [attendeesNames, setAttendeesNames] = useState<string[]>([]);

  const onSubmit = handleSubmit(async (data) => {
    setShowModal(true);
  
    let totalPrice = 0;
    if (eventData?.price && eventData?.commission) {
      totalPrice = eventData.price + eventData.commission;
    }

  
    data = {
      ...data,
      eventId: eventId,
      amount: totalPrice,
      currency: 'eur',
      attendeesNames: attendeesNames,
    };
  
    // Get the card information from Stripe
    const cardNumberElement = elements?.getElement(CardNumberElement);
    if (!cardNumberElement) {
      return;
    }
    console.log(data);
    // Make a request to the backend to handle payment and client addition in one step
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
  
    if (result.error) {
      console.log(result.error.message);
    } else {
      // Confirm the payment with Stripe using the client secret
      if (!stripe) throw new Error('Stripe not initialized');
      const paymentResult = await stripe.confirmCardPayment(result.clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: `${data.name} ${data.surname}`,
          },
        },
      });
  
      if (paymentResult?.error) {
        console.log(paymentResult.error.message);
      } else {
        // Redirect to success page
        router.push('/payment-success');
      }
    }
  
    setShowModal(false);
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/id/${eventId}`);
        const data = await response.json();
        setEventData(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvent();
  }, [eventId]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <FormProvider {...methods}>
        <form ref={ref} onSubmit={onSubmit} className="flex-grow container mx-auto py-8 px-6 md:px-12 lg:px-16 flex flex-col md:flex-row h-full">
          <div className="w-full md:w-2/3 md:pr-8 mb-24 md:mb-0">
            <PaymentInfo />
            <UserInfo />
            <AdditionalGuests attendees={attendeesNumber} attendeesNames={attendeesNames} setAttendeesNames={setAttendeesNames}/>
            <TermsAndConditions />

            <Button variant="outline" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
            </Button>
          </div>
          <Cart
            dateOfEvent={eventData?.dateOfEvent || ''}
            name={eventData?.name || ''}
            price={eventData?.price || 0}
            photo={eventData?.photo || ''}
            commission={eventData?.commission || 0}
            attendees={attendeesNumber}
            setAttendees={setAttendeesNumber}
          />
        </form>
      </FormProvider>
      <Footer />

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Procesando pago</DialogTitle>
            <DialogDescription>
              Espera unos segundos
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin h-10 w-10" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

CheckoutForm.displayName = 'CheckoutForm';

export default function CheckoutPage() {

  const ref = useRef<HTMLFormElement>(null);

  return (
    <Elements stripe={stripePromise}>
      <Suspense fallback={<div>Loading...</div>}>
        <CheckoutForm ref={ref} />
      </Suspense>
    </Elements>
  );
}
