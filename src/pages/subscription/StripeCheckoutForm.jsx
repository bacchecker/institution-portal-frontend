import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "sonner";

export default function StripeCheckoutForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // Optional: for redirect flows
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed");
    } else if (paymentIntent?.status == "succeeded") {
      toast.success("Payment successful!");
      onSuccess?.(); // Run success callback
    } else {
      toast.info("Payment is processing...");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
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
