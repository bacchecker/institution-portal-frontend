import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Divider,
  Chip,
} from "@nextui-org/react";
import { toast } from "sonner";
import PropTypes from "prop-types";
import axios from "@/utils/axiosConfig";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

console.log("Stripe Public Key:", import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder"
);

export default function SubscriptionManagement() {
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [setupIntentSecret, setSetupIntentSecret] = useState(null);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    fetchSubscriptionData();
    fetchAvailablePlans();
    fetchPaymentMethods();
  }, []);

  const fetchSubscriptionData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/institution/subscriptions/active");
      console.log("Subscription Data:", response.data);

      if (response.data.success) {
        setActiveSubscription(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      toast.error("Failed to load subscription information");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePlans = async () => {
    try {
      const response = await axios.get("/institution/subscriptions/plans");
      console.log("Plans:", response.data);

      if (response.data.success) {
        setAvailablePlans(response.data.data.plans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load subscription plans");
    }
  };

  const fetchPaymentMethods = async () => {
    setPaymentMethodsLoading(true);
    try {
      const response = await axios.get(
        "/institution/subscriptions/payment-methods"
      );
      console.log("Payment Methods:", response.data);
      if (response.data.success) {
        setPaymentMethods(response.data.data.payment_methods);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setPaymentMethodsLoading(false);
    }
  };

  const createSetupIntent = async () => {
    try {
      const response = await axios.post(
        "/institution/subscriptions/setup-intent"
      );
      if (response.data.success) {
        setSetupIntentSecret(response.data.client_secret);
      }
    } catch (error) {
      console.error("Error creating setup intent:", error);
      toast.error("Failed to initialize payment setup");
    }
  };

  const subscribeToNewPlan = async (planId) => {
    try {
      // Check if we have payment methods first
      if (paymentMethods.length === 0) {
        // Create a setup intent for adding payment method first
        await createSetupIntent();
        setSelectedPlanId(planId);
        return;
      }

      const response = await axios.post(
        "/institution/subscriptions/subscribe",
        {
          plan_id: planId,
          payment_method_id: paymentMethods[0]?.id, // Use the first payment method
        }
      );

      if (response.data.success) {
        if (response.data.requires_payment_method) {
          // Need to set up payment method
          setSetupIntentSecret(response.data.client_secret);
          setSelectedPlanId(planId);
        } else {
          // Subscription created successfully
          toast.success("Subscription created successfully");
          fetchSubscriptionData();
        }
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      toast.error(
        error.response?.data?.message || "Failed to subscribe to plan"
      );
    }
  };

  const cancelSubscription = async () => {
    if (!activeSubscription) return;

    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    try {
      const response = await axios.post("/institution/subscriptions/cancel", {
        subscription_id: activeSubscription.subscription.id,
      });

      if (response.data.success) {
        toast.success("Subscription cancelled successfully");
        fetchSubscriptionData();
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription");
    }
  };

  const resumeSubscription = async () => {
    if (!activeSubscription) return;

    try {
      const response = await axios.post("/institution/subscriptions/resume", {
        subscription_id: activeSubscription.subscription.id,
      });

      if (response.data.success) {
        toast.success("Subscription resumed successfully");
        fetchSubscriptionData();
      }
    } catch (error) {
      console.error("Error resuming subscription:", error);
      toast.error("Failed to resume subscription");
    }
  };

  const clearSetupIntent = () => {
    setSetupIntentSecret(null);
    setSelectedPlanId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }

  if (setupIntentSecret) {
    console.log(
      "Setting up Stripe Elements with client secret:",
      setupIntentSecret
    );
    return (
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: setupIntentSecret,
          appearance: {
            theme: "stripe",
          },
        }}
      >
        <PaymentSetupForm
          planId={selectedPlanId}
          onSuccess={fetchSubscriptionData}
          onCancel={clearSetupIntent}
          setSetupIntentSecret={setSetupIntentSecret}
          setSelectedPlanId={setSelectedPlanId}
        />
      </Elements>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Subscription Management</h2>

      {activeSubscription ? (
        <Card className="w-full">
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Current Subscription</h3>
            <div>
              {activeSubscription.is_canceled ? (
                <Chip color="warning">Cancellation Pending</Chip>
              ) : activeSubscription.is_active ? (
                <Chip color="success">Active</Chip>
              ) : (
                <Chip color="danger">Inactive</Chip>
              )}
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-semibold">
                    {activeSubscription.plan.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-semibold">
                    ${activeSubscription.plan.price} /{" "}
                    {activeSubscription.plan.billing_period}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Credits</p>
                  <p className="font-semibold">
                    {activeSubscription.credit_balance} remaining /{" "}
                    {activeSubscription.plan.total_credit} total
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Renewal Date</p>
                  <p className="font-semibold">
                    {activeSubscription.renewal_date || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                {activeSubscription.is_canceled ? (
                  <Button
                    color="primary"
                    onClick={resumeSubscription}
                    className="w-full md:w-auto"
                  >
                    Resume Subscription
                  </Button>
                ) : (
                  <Button
                    color="danger"
                    variant="flat"
                    onClick={cancelSubscription}
                    className="w-full md:w-auto"
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="w-full">
          <CardBody>
            <div className="text-center p-4">
              <h3 className="text-xl font-semibold mb-2">
                No Active Subscription
              </h3>
              <p className="text-gray-500 mb-4">
                Choose a subscription plan to get started
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      <h3 className="text-xl font-bold mt-8">Available Plans</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availablePlans.map((plan) => (
          <Card key={plan.id} className="w-full">
            <CardHeader className="flex flex-col items-start">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-xl font-bold">
                ${plan.amount}{" "}
                <span className="text-sm text-gray-500">
                  / monthly
                  {/* / {plan.billing_period} */}
                </span>
              </p>
            </CardHeader>
            <Divider />
            <CardBody>
              <ul className="space-y-2">
                <li>• {plan.total_credit} total credits</li>
                <li>• {plan.number_of_users} users</li>
                <li>• {plan.number_of_departments} departments</li>
                {plan.features?.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
              <Button
                color="primary"
                className="w-full mt-4"
                onClick={() => subscribeToNewPlan(plan.id)}
                disabled={
                  activeSubscription?.plan.id === plan.id &&
                  !activeSubscription.is_canceled
                }
              >
                {activeSubscription?.plan.id === plan.id &&
                !activeSubscription.is_canceled
                  ? "Current Plan"
                  : "Subscribe"}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <h3 className="text-xl font-bold mt-8">Payment Methods</h3>
      <Card className="w-full">
        <CardBody>
          {paymentMethodsLoading ? (
            <div className="flex justify-center p-4">
              <Spinner size="sm" color="danger" />
            </div>
          ) : paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-lg">
                      {method.card.brand === "visa"
                        ? "💳 Visa"
                        : method.card.brand === "mastercard"
                        ? "💳 Mastercard"
                        : method.card.brand === "amex"
                        ? "💳 American Express"
                        : "💳 Card"}
                    </div>
                    <div>•••• {method.card.last4}</div>
                    <div className="text-sm text-gray-500">
                      Expires {method.card.exp_month}/{method.card.exp_year}
                    </div>
                  </div>
                  {method.is_default && (
                    <Chip size="sm" color="success">
                      Default
                    </Chip>
                  )}
                </div>
              ))}
              <Button
                color="danger"
                variant="flat"
                className="mt-2"
                onPress={createSetupIntent}
              >
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="mb-4">No payment methods available</p>
              <Button color="danger" onPress={createSetupIntent}>
                Add Payment Method
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function PaymentSetupForm({
  planId,
  onSuccess,
  onCancel,
  setSetupIntentSecret,
  setSelectedPlanId,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      console.log("Starting payment setup confirmation");

      // Complete setup and get the payment method ID
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/account-settings",
        },
        redirect: "if_required",
      });

      console.log("Setup confirmation result:", result);

      if (result.error) {
        console.error("Setup error:", result.error);
        throw new Error(result.error.message);
      }

      // Check if we have the expected setupIntent result structure
      if (!result.setupIntent || !result.setupIntent.payment_method) {
        console.error("Invalid setup result structure:", result);
        throw new Error("Failed to get payment method details");
      }

      if (planId) {
        console.log(
          "Completing subscription with payment method:",
          result.setupIntent.payment_method
        );

        // Complete the subscription with the new payment method
        const response = await axios.post(
          "/institution/subscriptions/complete-subscription",
          {
            plan_id: planId,
            payment_method_id: result.setupIntent.payment_method,
            setup_intent_id: result.setupIntent.id,
          }
        );

        console.log("Subscription completion response:", response.data);

        if (response.data.success) {
          toast.success("Subscription created successfully");
          // Clear the setup intent first
          setSetupIntentSecret(null);
          setSelectedPlanId(null);
          // Then call onSuccess to refresh data
          onSuccess();
        } else {
          throw new Error(
            response.data.message || "Failed to complete subscription"
          );
        }
      } else {
        // Just added a payment method - refresh the list
        console.log("Payment method added successfully");
        toast.success("Payment method added successfully");
        // Clear the setup intent first
        setSetupIntentSecret(null);
        // Then call onSuccess to refresh data
        onSuccess();
      }
    } catch (error) {
      console.error("Payment error details:", error);
      // Display more specific error message
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during payment processing";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {planId ? "Set Up Payment for Subscription" : "Add Payment Method"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 border rounded-md">
          <PaymentElement />
        </div>

        {errorMessage && (
          <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            color="danger"
            variant="flat"
            onPress={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={!stripe || loading}>
            {loading ? (
              <Spinner size="sm" color="white" />
            ) : (
              "Save Payment Method"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

PaymentSetupForm.propTypes = {
  planId: PropTypes.string,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  setSetupIntentSecret: PropTypes.func.isRequired,
  setSelectedPlanId: PropTypes.func.isRequired,
};
