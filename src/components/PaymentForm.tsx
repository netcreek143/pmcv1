import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function PaymentForm({ clientSecret, formData, totalAmount }: { clientSecret: string, formData: any, totalAmount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { items, clearCart } = useCartStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = document.querySelector('form');
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    // First, save the order in our database
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customer: formData,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          total: totalAmount
        })
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || 'Failed to place order. Please try again.');
        setIsLoading(false);
        return;
      }

      const orderData = await res.json();
      const orderId = orderData.id;

      // Then confirm the payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `${window.location.origin}/order-success?order_id=${orderId}`,
        },
      });

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`.
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred");
      } else {
        setMessage("An unexpected error occurred.");
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setMessage('An error occurred while saving your order.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs" as const,
  };

  return (
    <div id="payment-form" className="space-y-6">
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      
      <button 
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-brand transition-colors shadow-lg hover:-translate-y-1 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span id="button-text">
          {isLoading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <><Lock className="h-5 w-5 mr-2 inline" /> Pay Now</>}
        </span>
      </button>
      
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className="text-red-500 text-sm mt-4">{message}</div>}
    </div>
  );
}
