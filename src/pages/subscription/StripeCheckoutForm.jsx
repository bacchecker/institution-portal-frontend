import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "sonner";

export default function StripeCheckoutForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const card = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    console.log("PaymentMethod:", paymentMethod);

    if (error) {
      console.error("Stripe error:", error);
      toast.error(error.message || "Payment failed");
    
      // Optional: show full error object in dev
      if (process.env.NODE_ENV === "development") {
        console.error("Full Stripe error object:", error);
      }
    }
     else if (paymentIntent?.status == "succeeded") {
      toast.success("Payment successful!");
      onSuccess?.(); // Run success callback
    } else {
      toast.info("Payment is processing...");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="bg-bChkRed text-white px-4 py-2 rounded-md mt-4"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
