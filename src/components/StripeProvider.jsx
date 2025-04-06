// StripeProvider.jsx
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Replace with your actual publishable key
const stripePromise = loadStripe("pk_test_51R6UPMGfpcTSeSCYZFlk5zGIgl2l7xEV0IcNTEmi0XObDS3DfbRCQOKiBZjOdaSOGxDvpIykgAI1OKh3xn6Oq1ty00rF3VL1NJ");

export default function StripeProvider({ children, clientSecret }) {
  const options = {
    clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
