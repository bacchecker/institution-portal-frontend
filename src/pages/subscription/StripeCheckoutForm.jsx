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
    const result = await stripe.confirmPayment({ elements, redirect: "if_required" });

    if (result.error) {
      toast.error(result.error.message);
    } else if (result.paymentIntent?.status === "succeeded") {
      toast.success("Payment successful!");
      if (onSuccess) onSuccess();
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
