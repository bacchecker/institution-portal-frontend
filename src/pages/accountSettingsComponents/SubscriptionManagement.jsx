import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Divider,
  Chip,
  Select,
  SelectItem,
  Tooltip,
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

// ISO country names for display
const countryNames = {
  US: "United States",
  GB: "United Kingdom",
  GH: "Ghana",
  NG: "Nigeria",
  KE: "Kenya",
  ZA: "South Africa",
  IN: "India",
  CA: "Canada",
  DE: "Germany",
  // Add more as needed
};

// Country flag emoji function
const getFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

export default function SubscriptionManagement() {
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [setupIntentSecret, setSetupIntentSecret] = useState(null);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(null);
  const [addPaymentMethodLoading, setAddPaymentMethodLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
    fetchAvailablePlans();
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    // Refetch plans when location changes
    if (selectedLocation) {
      fetchAvailablePlans(selectedLocation);
    }
  }, [selectedLocation]);

  const fetchSubscriptionData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/institution/subscriptions/active");

      if (response.data.success) {
        console.log("Active Subscription:", response.data.data);
        setActiveSubscription(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      toast.error("Failed to load subscription information");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePlans = async (countryCode = null) => {
    setLocationLoading(true);
    try {
      // Include country parameter if specified
      const params = countryCode ? { country: countryCode } : {};
      const response = await axios.get("/institution/subscriptions/plans", {
        params,
      });
      console.log("Plans:", response.data);

      if (response.data.success) {
        setAvailablePlans(response.data.data.plans);

        // Set user location from API response if not already set
        if (!userLocation && response.data.data.user_location) {
          setUserLocation(response.data.data.user_location);
          if (!selectedLocation) {
            setSelectedLocation(response.data.data.user_location);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load subscription plans");
    } finally {
      setLocationLoading(false);
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
      setAddPaymentMethodLoading(true);
      const response = await axios.post(
        "/institution/subscriptions/setup-intent"
      );
      if (response.data.success) {
        setSetupIntentSecret(response.data.client_secret);
      }
    } catch (error) {
      console.error("Error creating setup intent:", error);
      toast.error("Failed to initialize payment setup");
    } finally {
      setAddPaymentMethodLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    await fetchPaymentMethods(); // Refresh payment methods list
    await fetchSubscriptionData(); // Refresh subscription data if needed
  };

  const subscribeToNewPlan = async (planId) => {
    try {
      console.log(`Subscribing to plan ID: ${planId}`);
      setSubscribeLoading(planId);

      // Check if we have payment methods first
      if (paymentMethods.length === 0) {
        // Create a setup intent for adding payment method first
        await createSetupIntent();
        setSelectedPlanId(planId);
        return;
      }

      // Pass the country code in the request to ensure correct pricing
      const response = await axios.post(
        "/institution/subscriptions/subscribe",
        {
          plan_id: planId,
          payment_method_id: paymentMethods[0]?.id, // Use the first payment method
          country: selectedLocation, // Include the selected location/country
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
    } finally {
      setSubscribeLoading(null);
    }
  };

  const cancelSubscription = async () => {
    if (!activeSubscription) return;

    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    setCancelLoading(true);
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
    } finally {
      setCancelLoading(false);
    }
  };

  const resumeSubscription = async () => {
    if (!activeSubscription) return;

    setResumeLoading(true);
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
    } finally {
      setResumeLoading(false);
    }
  };

  const clearSetupIntent = () => {
    setSetupIntentSecret(null);
    setSelectedPlanId(null);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
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
          onSuccess={handlePaymentSuccess}
          onCancel={clearSetupIntent}
          setSetupIntentSecret={setSetupIntentSecret}
          setSelectedPlanId={setSelectedPlanId}
          selectedLocation={selectedLocation}
        />
      </Elements>
    );
  }

  // List of common countries for the selector
  const commonCountries = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "GH", name: "Ghana" },
    { code: "NG", name: "Nigeria" },
    { code: "KE", name: "Kenya" },
    { code: "ZA", name: "South Africa" },
    { code: "IN", name: "India" },
    { code: "CA", name: "Canada" },
    { code: "DE", name: "Germany" },
    // Add more as needed
  ];

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
                    ${activeSubscription.subscription.amount} /{" "}
                    {activeSubscription.plan.billing_period || "monthly"}
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
                    color="danger"
                    onPress={resumeSubscription}
                    className="w-full md:w-auto"
                    isLoading={resumeLoading}
                  >
                    {resumeLoading ? "Resuming..." : "Resume Subscription"}
                  </Button>
                ) : (
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={cancelSubscription}
                    className="w-full md:w-auto"
                    isLoading={cancelLoading}
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

      <div className="flex flex-col mt-8">
        <h3 className="text-xl font-bold">Available Plans</h3>

        <div className="flex gap-2">
          {userLocation && (
            <div className="mr-2 flex items-center">
              <Tooltip content="Your detected location">
                <span className="text-sm text-gray-500">
                  {getFlagEmoji(userLocation)}{" "}
                  {countryNames[userLocation] || userLocation}
                </span>
              </Tooltip>
            </div>
          )}

          <Select
            size="sm"
            label="View pricing for"
            className="max-w-xs"
            selectedKeys={selectedLocation ? [selectedLocation] : []}
            onChange={handleLocationChange}
            isLoading={locationLoading}
          >
            {commonCountries.map((country) => (
              <SelectItem
                key={country.code}
                value={country.code}
                textValue={country.name}
              >
                <div className="flex items-center gap-2">
                  <span>{getFlagEmoji(country.code)}</span>
                  <span>{country.name}</span>
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availablePlans.map((plan) => {
          const hasLocationPricing =
            plan.has_location_pricing && plan.original_amount;
          const discount = hasLocationPricing
            ? Math.round(
                ((plan.original_amount - plan.amount) / plan.original_amount) *
                  100
              )
            : 0;

          return (
            <Card key={plan.id} className="w-full">
              <CardHeader className="flex flex-col items-start">
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {hasLocationPricing && discount > 0 && (
                    <Chip color="success" size="sm">
                      {discount}% off
                    </Chip>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold">${plan.amount}</p>
                  {hasLocationPricing && plan.original_amount > plan.amount && (
                    <p className="text-sm text-gray-500 line-through">
                      ${plan.original_amount}
                    </p>
                  )}
                  <span className="text-sm text-gray-500">
                    / monthly
                    {/* / {plan.billing_period} */}
                  </span>
                </div>
                {plan.applied_country && (
                  <div className="mt-1 text-sm">
                    <span className="text-success font-medium flex items-center gap-1">
                      {getFlagEmoji(plan.applied_country)}
                      <span>
                        Price for{" "}
                        {countryNames[plan.applied_country] ||
                          plan.applied_country}
                      </span>
                    </span>
                  </div>
                )}
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
                  color="danger"
                  className="w-full mt-4"
                  onPress={() => subscribeToNewPlan(plan.id)}
                  disabled={
                    (activeSubscription?.plan.id === plan.id &&
                      !activeSubscription.is_canceled) ||
                    subscribeLoading === plan.id
                  }
                  isLoading={subscribeLoading === plan.id}
                >
                  {activeSubscription?.plan.id === plan.id &&
                  !activeSubscription.is_canceled
                    ? "Current Plan"
                    : subscribeLoading === plan.id
                    ? "Subscribing..."
                    : "Subscribe"}
                </Button>
              </CardBody>
            </Card>
          );
        })}
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
                isLoading={addPaymentMethodLoading}
              >
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="mb-4">No payment methods available</p>
              <Button
                color="danger"
                onPress={createSetupIntent}
                isLoading={addPaymentMethodLoading}
              >
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
  selectedLocation,
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
            country: selectedLocation, // Include the selected country
          }
        );

        console.log("Subscription completion response:", response.data);

        if (response.data.success) {
          toast.success("Subscription created successfully");
          // Clear the setup intent first
          setSetupIntentSecret(null);
          setSelectedPlanId(null);
          // Then call onSuccess to refresh data
          await onSuccess();
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
        await onSuccess();
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
          <Button color="danger" type="submit" disabled={!stripe || loading}>
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
  selectedLocation: PropTypes.string,
};
