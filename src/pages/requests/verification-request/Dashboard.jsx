import React, { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import axiosDef from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FaCreditCard, FaCrown, FaRegCircleQuestion } from "react-icons/fa6";
import { RiAddBoxFill, RiAlarmWarningFill } from "react-icons/ri";
import { HiMiniUsers } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";
import {
  IoIosArrowDroprightCircle,
  IoIosStar,
  IoMdTrendingUp,
} from "react-icons/io";
import moment from "moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Modal from "@/components/Modal";
import SideModal from "@/components/SideModal";
import { fetchSubscription } from "../../subscription/fetchSubscription";
import StripeCheckoutForm from "../../subscription/StripeCheckoutForm";
import LoadItems from "@/components/LoadItems";
import { toast } from "sonner";
import { GiLaurelCrown, GiUpgrade } from "react-icons/gi";
import secureLocalStorage from "react-secure-storage";

export default function Dashboard() {
  const [receivedRequest, setReceivedRequest] = useState(0);
  const [sentRequest, setSentRequest] = useState(0);
  const [subscription, setSubscription] = useState("");
  const [currentPackage, setCurrentPackage] = useState("");
  const [preferredPlatform, setPreferredPlatform] = useState("paystack");
  const [creditValue, setCreditValue] = useState(0);
  const [tab, setTab] = useState("day");
  const [plans, setPlans] = useState([]);
  const [data, setData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [recentVerifications, setRecentVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSubDrawer, setOpenSubDrawer] = useState(false);
  const [openTopUpDrawer, setOpenTopUpDrawer] = useState(false);
  const [openPaymentDrawer, setOpenPaymentDrawer] = useState(false);
  const [countryNames, setCountryNames] = useState([]);
  const userInstData = JSON.parse(secureLocalStorage.getItem("user") || "{}");
  const [instBill, setInstBill] = useState(
    userInstData?.institution?.billing_address || ""
  );

  const [clientSecret, setClientSecret] = useState(null);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [checked, setChecked] = useState(false);
  //const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  const stripePromise = loadStripe(
    "pk_test_51QwBccH83VZsct6SO27tERuGE1I5mPFIB6BUoZNrdcr1VPPhCf5aTZtzMMXR5ORBjFrejCcTexxJaCyKUGAtQmJq00uoUnSctK"
  );

  const hasValidPackage = () =>
    currentPackage && typeof currentPackage === "object" && subscription?.status === "Active";


  const daysLeft = subscription?.current_period_end
    ? dayjs(subscription.current_period_end).diff(dayjs(), "day")
    : null;

  // Payment States
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    firstName: "",
    lastName: "",
    expirationDate: "",
    cvcCode: "",
    mobileMoneyNumber: "",
    mobileNetwork: "",
    numberOfCredits: 0,
    bonus_amount: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();
  
  const handleEcheckChange = async (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);

    if (isChecked) {
      setLoading(true);
      try {
        const response = await axios.post("/institution/dont-show-echeck-modal");
        toast.success(response.data.message);
      } catch (error) {
        toast.error("Failed to update eCheck modal setting:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setPaymentData(paymentData);
  }, [paymentData]);

  useEffect(() => {
    if (instBill === "Ghana") {
      setPreferredPlatform("paystack");
    } else {
      setPreferredPlatform("stripe");
    }
  }, [instBill]);

  useEffect(() => {
    if (preferredPlatform === "stripe") {
      setSelectedPayment("card");
    }
  }, [preferredPlatform]);

  useEffect(() => {
    axiosDef
      .get("https://restcountries.com/v3.1/all?fields=cca2,idd,name")
      .then((res) => {
        const names = res.data
          .map((country) => ({
            name: country.name.common,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountryNames(names);
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  const pages = [
    <div className="w-full flex flex-col justify-center h-full">
      <div className="w-full bg-black rounded-md h-48"></div>
      <div className="w-full flex justify-between">
        {checked == 0 && (
          <label className="w-full flex items-center space-x-2 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={checked}
              onChange={handleEcheckChange}
              className="form-checkbox accent-bChkRed"
            />
            <span className=" text-bChkRed">Don't show this again</span>
          </label>
        )}
        
        <button
          type="button"
          onClick={() => {
            setOpenDrawer(false);
          }}
          className="w-full flex justify-end mt-1 font-normal underline"
        >
          Skip
        </button>
      </div>
      
      <div className="font-normal">
        <p className="font-semibold text-black my-3 text-lg">
          Welcome to E-Check
        </p>
        <p className="text-sm mb-2">
          E-Check is an advanced document verification solution offered by
          BacChecker, designed to streamline and simplify the verification
          process between institutions and document owners.
        </p>
        <p className="text-sm">
          This service enables institutions to verify documents such as
          certificates, transcripts, or other credentials efficiently, securely,
          and with minimal effort.
        </p>
      </div>
    </div>,
    <div className="w-full flex flex-col justify-center h-full">
      <div className="w-full bg-black rounded-md h-48"></div>
      <button
        type="button"
        onClick={() => {
          setOpenDrawer(false);
        }}
        className="w-full flex justify-end mt-1 font-normal underline"
      >
        Skip
      </button>
      <div className="font-normal pb-16">
        <p className="font-semibold text-black mb-3 text-lg">
          How Does E-Check Work?
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          {/* Step 1 */}
          <li>
            <span className="font-medium text-black">Send Request</span>
            <ul className="list-disc list-inside pl-5 mt-1 space-y-1 text-gray-600">
              <li>
                An institution initiates a verification request using E-Check.
              </li>
              <li>
                The request includes details of the document to be verified.
              </li>
            </ul>
          </li>
          {/* Step 2 */}
          <li>
            <span className="font-medium text-black">
              Document Owner Notification
            </span>
            <ul className="list-disc list-inside pl-5 mt-1 space-y-1 text-gray-600">
              <li>
                The document owner receives an email notification with a secure
                link to approve or decline the request.
              </li>
              <li>
                The document owner has full control to approve or decline the
                verification request.
              </li>
            </ul>
          </li>
          {/* Step 3 */}
          <li>
            <span className="font-medium text-black">Approval or Decline</span>
            <ul className="list-disc list-inside pl-5 mt-1 space-y-1 text-gray-600">
              <li>
                Once approved, the requesting institution is notified, and the
                verification is completed by the receving institution.
              </li>
            </ul>
          </li>
        </ol>
      </div>
    </div>,
    <div className="w-full flex flex-col items-center justify-center h-full">
      
      <div className="max-w-md mx-auto mt-6 px-6 py-10 bg-white rounded-xl border border-gray-200">
      {/* Title */}
      <div className="text-base font-semibold text-gray-900 text-center mb-2">BacChecker E-Check Plan</div>
      <div className="text-xs text-center text-gray-600 font-light mb-4">Manage your E-Check subscription</div>

      {/* Badge and Plan Status */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 flex items-center justify-center rounded-full border-4 border-bChkRed bg-white mb-2">
          <GiLaurelCrown size={36} className="text-bChkRed" />
        </div>
        <div className="text-sm text-gray-900 font-semibold">Active Plan</div>
      </div>

      {/* Plan Name */}
      <div className="text-center font-semibold text-lg mb-4 text-bChkRed">
        <p>
          {typeof currentPackage === "object"
            ? currentPackage.name.endsWith("Package")
              ? currentPackage.name
              : `${currentPackage.name} Package`
            : "No Package"}
        </p>

      </div>

      <div className="relative bg-gray-100 p-4 rounded-md text-sm text-center mb-4">
        <div className="absolute top-2 right-2">
          <FaRegCircleQuestion className="text-gray-400" />
        </div>

        {currentPackage && typeof currentPackage === "object" ? (
          <>
            <p className="mb-1">
              Your current <strong>{currentPackage.name} Plan</strong> will renew in{" "}
              <strong>{daysLeft} day{daysLeft !== 1 ? "s" : ""}</strong>.
            </p>
            <p className="text-gray-500 text-xs">
              You will be automatically billed <strong>${subscription.amount}</strong>.
            </p>

            {/* <ul className="mt-4 text-left text-xs text-gray-700 list-disc list-inside">
              <li>
                Departments Allowed: <strong>{currentPackage.number_of_departments}</strong>
              </li>
              <li>
                Users Allowed: <strong>{currentPackage.number_of_users}</strong>
              </li>
              <li>
                Total Credits: <strong>{currentPackage.total_credit}</strong>
              </li>
            </ul> */}
          </>
        ) : (
          <>
            <p className="mb-1 font-medium text-gray-800">
              You don’t have an active subscription plan.
            </p>
            <p className="text-gray-500 text-xs">
              Subscribe to a plan to access our eCheck services and unlock premium features.
            </p>
          </>
        )}
      </div>

      {/* Button */}
      <div className="flex">
        <button
          onClick={() => navigate("/account-settings?tab=subscription")}
          className="w-full bg-bChkRed text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-80 transition-colors"
        >
          {hasValidPackage() ? "Upgrade Plan" : "Subscribe to a Plan"}
        </button>
      </div>

    </div>
    </div>
  ];

  const handlePrevious = () => {
    if (currentPage - 1 > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage - 1 < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "/institution/verification/dashboard-data",
          {
            params: {
              page: currentPage,
            },
          }
        );
        console.log(response.data);

        setRecentVerifications(response.data.recent_verifications);
        setSentRequest(response.data.sent_requests);
        setReceivedRequest(response.data.received_requests);
        setSubscription(response.data.subscription);
        setCurrentPackage(response.data.current_package || "No Package");
        setCreditValue(response.data.current_package?.topup_credit_value);
        const resData = response.data.results;
        if (tab === "day") {
          setData(
            resData.day.map((item) => ({
              name: moment(item.date).format("MMM D"),
              Receiving: item.receiving,
              Sending: item.sending,
            }))
          );
        } else if (tab === "week") {
          setData(
            resData.week.map((item) => ({
              name: `Week ${item.week.slice(-2)}`,
              Receiving: item.receiving,
              Sending: item.sending,
            }))
          );
        } else if (tab === "month") {
          setData(
            resData.month.map((item) => ({
              name: moment(item.month, "YYYY-MM").format("MMM"),
              Receiving: item.receiving,
              Sending: item.sending,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tab]);
  useEffect(() => {
    const handleECheckModal = async () => {
      const subscription = await fetchSubscription();

      const totalCredit = subscription?.subscription?.total_credit || 0;
      const inRequest = subscription?.received_requests || 0;
      const dontShow = subscription?.institution?.echeck_modal || 0;

      if (totalCredit < 1 && inRequest < 1 && dontShow == 1) {
        setOpenDrawer(true);
      } else {
        setOpenDrawer(false);
      }

      if(dontShow == 0) {
        setChecked(true);
      }
    };
    handleECheckModal();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/institution/subscription-plans");
      const planResponse = response.data.plans;
      setPlans(planResponse.data);
      setCurrentPage(planResponse.current_page);
      setLastPage(planResponse.last_page);
      setTotalPages(Math.ceil(planResponse.total / planResponse.per_page));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreditChange = (e) => {
    const { name, value } = e.target;

    // Ensure that only numbers are entered for credits
    if (name === "numberOfCredits" && !/^\d*$/.test(value)) {
      return; // Prevent non-numeric input
    }

    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
      ...(name === "numberOfCredits" && {
        amount: value ? value * creditValue : 0, // Multiply credits by creditValue
      }),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    if (selectedPayment === "card" && preferredPlatform == "paystack") {
      if (!paymentDetails.cardNumber) {
        toast.error("Card details are required.");
        setIsSaving(false);
        return;
      }
    }

    if (selectedPayment === "mobile_money") {
      if (!paymentDetails.mobileNetwork || !paymentDetails.mobileNumber) {
        toast.error("Mobile money details are required.");
        setIsSaving(false);
        return;
      }
    }
    const payload = {
      subscription_plan_id: paymentData?.id,
      channel: selectedPayment,
      payment_type: "subscription",
      amount: paymentData?.amount,
      platform: preferredPlatform,
      ...(selectedPayment === "card" &&
        preferredPlatform === "paystack" && {
          payment_method: "card",
          payment_detail: {
            number: paymentDetails.cardNumber,
            exp_month: paymentDetails.expiryMonth,
            exp_year: paymentDetails.expiryYear,
            cvc: paymentDetails.cvcCode,
          },
        }),
      ...(selectedPayment === "mobile_money" && {
        payment_method: paymentDetails.mobileNetwork,
        payment_detail: paymentDetails.mobileNumber,
      }),
    };

    try {
      const response = await axios.post("/payments/initiate", payload);
      if (response.data.status === "success") {
        if (preferredPlatform === "paystack") {
          window.location.href = response?.data?.authorization_url;
        } else if (preferredPlatform === "stripe") {
          window.location.href = response?.data?.url;
        }
      }
      setIsSaving(false);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setIsSaving(false);
    }
  };

  const handleTopupSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    if (selectedPayment === "card" && preferredPlatform == "paystack") {
      if (!paymentDetails.cardNumber) {
        toast.error("Card details are required.");
        setIsSaving(false);
        return;
      }
    }

    if (selectedPayment === "mobile_money") {
      if (!paymentDetails.mobileNetwork || !paymentDetails.mobileNumber) {
        toast.error("Mobile money details are required.");
        setIsSaving(false);
        return;
      }
    }
    const payload = {
      subscription_plan_id: paymentData?.id,
      channel: selectedPayment,
      payment_type: "subscription-top-up",
      amount: paymentDetails?.amount,
      bonus_amount: paymentDetails?.bonus_amount,
      credit_amount: paymentDetails?.numberOfCredits,
      platform: preferredPlatform,
      ...(selectedPayment === "card" &&
        preferredPlatform == "paystack" && {
          payment_method: "card",
          payment_detail: {
            number: paymentDetails.cardNumber,
            exp_month: paymentDetails.expiryMonth,
            exp_year: paymentDetails.expiryYear,
            cvc: paymentDetails.cvcCode,
          },
        }),
      ...(selectedPayment === "mobile_money" && {
        payment_method: paymentDetails.mobileNetwork,
        payment_detail: paymentDetails.mobileNumber,
      }),
    };

    try {
      const response = await axios.post("/payments/initiate", payload);
      if (response.data.status === "success") {
        if (preferredPlatform === "paystack") {
          window.location.href = response?.data?.authorization_url;
        } else if (preferredPlatform === "stripe") {
          window.location.href = response?.data?.url;
        }
      }
      //toast.success("Payment successful!");
      setIsSaving(false);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="bg-white text-sm w-full">
        <div className="w-full flex justify-between pl-2">
          <button
            type="button"
            onClick={() => {
              setOpenDrawer(true);
            }}
            className="bg-black flex space-x-1 items-center rounded-md px-3 py-1 uppercase text-sm text-white"
          >
            <p>Learn More</p>
            <IoIosArrowDroprightCircle size={20} />
          </button>
          {/* <div className=" flex justify-end pr-2 space-x-2">
            <button
              type="button"
              onClick={() => {
                setOpenSubDrawer(true);
              }}
              className="bg-black flex space-x-1 items-center rounded-md px-3 py-1 uppercase text-sm text-white"
            >
              <GiUpgrade size={16} />
              <p>
                {currentPackage == "No Package"
                  ? "Subscribe to a Package"
                  : "Upgrade Package"}
              </p>
            </button>
            {currentPackage != "No Package" && (
              <button
                type="button"
                onClick={() => {
                  setOpenTopUpDrawer(true);
                }}
                className="bg-bChkRed flex space-x-1 items-center rounded-md px-3 py-1 uppercase text-sm text-white"
              >
                <RiAddBoxFill size={21} />
                <p>Top Up Credits</p>
              </button>
            )}
          </div> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-black gap-2 lg:gap-4 p-2">
          <div className="flex flex-col justify-center bg-yellow-100 rounded-md p-8">
            <div className="flex space-x-4">
              <div className="bg-yellow-200 text-yellow-300 h-10 w-10 rounded-full flex items-center justify-center">
                <HiMiniUsers size={18} />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="font-medium text-sm">Number of requests sent</p>
                <div className="flex items-center space-x-3">
                  <p className="text-xl font-semibold">{sentRequest}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs">+11.21</p>
                    <IoMdTrendingUp />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-blue-100 rounded-md p-8">
            <div className="flex space-x-4">
              <div className="bg-blue-200 text-blue-400 h-10 w-10 rounded-full flex items-center justify-center">
                <HiMiniUsers size={18} />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="font-medium text-sm">
                  Number of requests received
                </p>
                <div className="flex items-center space-x-3">
                  <p className="text-black text-xl font-semibold">
                    {receivedRequest}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs">+11.21</p>
                    <IoMdTrendingUp />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-purple-200 rounded-md px-8 py-6">
            <div className="w-full flex justify-end mb-2">
              <div className="flex items-center space-x-2 text-green-600 bg-green-100 border border-green-600 rounded-full px-4 py-1">
                <p>
                  {typeof currentPackage === "object"
                    ? currentPackage.name.endsWith("Package")
                      ? currentPackage.name
                      : `${currentPackage.name} Package`
                    : "No Package"}
                </p>


                <FaCrown size={20} className="text-yellow-400" />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="bg-purple-300 text-purple-500 h-10 w-12 rounded-full flex items-center justify-center">
                <FaCreditCard size={16} />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="font-medium">E-check subscription balance</p>
                <div className="w-full flex items-center justify-between">
                  <p className="text-black text-xl font-semibold">
                    {subscription?.credit_balance || 0} Credits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 xl:grid-cols-5 gap-3 px-2 mt-1">
          <div className="col-span-3 border border-gray-100 shadow rounded-md pr-2">
            <div className="w-full flex justify-between p-5">
              <p className="font-medium text-base text-black">
                Verification Request
              </p>
              <div className="mb-4 text-center bg-gray-200 rounded-md p-1">
                <button
                  type="button"
                  onClick={() => setTab("day")}
                  className={`mx-2 px-4 py-1 rounded border text-xs ${
                    tab === "day"
                      ? "bg-white text-purple-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  Day
                </button>
                <button
                  type="button"
                  onClick={() => setTab("week")}
                  className={`mx-2 px-4 py-1 rounded border text-xs ${
                    tab === "week"
                      ? "bg-white text-purple-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTab("month")}
                  className={`mx-2 px-4 py-1 rounded border text-xs ${
                    tab === "month"
                      ? "bg-white text-purple-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  Month
                </button>
              </div>
            </div>

            {/* Chart */}
            {loading ? (
              <p style={{ textAlign: "center" }}>Loading...</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={{ fontSize: "14px" }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Receiving"
                    stroke="#2AC670"
                    strokeWidth={3}
                    activeDot={{ r: 5 }}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Sending"
                    stroke="#FDAD15"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="col-span-3 xl:col-span-2 p-4 rounded-md border border-gray-200">
            <p className="text-base font-medium text-black">
              Recent Verification Received
            </p>

            <div className="relative overflow-x-auto mt-4">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 border-b">
                  <tr>
                    <th scope="col" className="pr-2 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-2 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-2 py-3">
                      Document Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentVerifications.map((verification) => (
                    <tr
                      key={verification.id}
                      className="bg-white text-xs border-b hover:bg-gray-100"
                    >
                      <td
                        scope="row"
                        className="pr-2 py-4 flex items-center space-x-1 font-medium text-gray-900 whitespace-nowrap"
                      >
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md border border-gray-100">
                          {verification?.sending_institution?.logo && (
                            <img
                              src={`https://admin-dev.baccheck.online/storage/${verification?.sending_institution?.logo}`}
                              alt=""
                              className="w-full h-full object-cover rounded-md"
                            />
                          )}
                        </div>
                        <p>{verification.sending_institution.name}</p>
                      </td>
                      <td className="px-2 py-4">
                        {verification.doc_owner_email.length > 15
                          ? `${verification.doc_owner_email.slice(0, 15)}...`
                          : verification.doc_owner_email}
                      </td>

                      <td className="px-2 py-4">
                        {/* <FaFilePdf size={20} className="text-bChkRed"/> */}
                        <p>{verification.document_type.name}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal
          isOpen={openDrawer}
          setIsOpen={setOpenDrawer}
          classNames="w-[98vw] md:w-[80vw] xl:w-[70vw] z-10 rounded-md"
        >
          {/* Overlay to detect outside clicks */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={() => setOpenDrawer(false)} // Close modal when clicking outside
          >
            {/* Prevent click inside modal from closing it */}
            <div
              className="h-[90vh] flex flex-col relative bg-white rounded-lg w-[98vw] md:w-[80vw] xl:w-[70vw] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Content */}
              <div className="w-full mx-auto p-2 rounded-md flex-1 overflow-y-auto">
                <div className="w-full rounded-lg overflow-hidden flex justify-center items-center">
                  <div className="w-full font-semibold text-gray-700">
                    {pages[currentPage - 1]}
                  </div>
                </div>
              </div>

              {/* Indicators and Navigation */}
              <div className="w-full absolute bottom-0 left-0 bg-white py-4 mt-2">
                <div className="flex justify-between items-center px-4">
                  {/* Previous Button */}
                  {currentPage - 1 > 0 ? (
                    <button
                      className="bg-bChkRed text-white px-6 py-1 rounded-sm text-xs hover:bg-red-500"
                      onClick={handlePrevious}
                    >
                      Previous
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {/* Indicators */}
                  <div className="flex space-x-2">
                    {pages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-8 h-1 transition-all rounded-xl ${
                          currentPage - 1 === index
                            ? "bg-bChkRed"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    ))}
                  </div>

                  {/* Next Button */}
                  {currentPage - 1 < pages.length - 1 ? (
                    <button
                      type="button"
                      className="bg-bChkRed text-white px-6 py-1 rounded-sm text-xs hover:bg-red-500"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="bg-bChkRed text-white px-6 py-1 rounded-sm text-xs hover:bg-red-500"
                      onClick={() => setOpenDrawer(false)}
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>

      </div>
    </>
  );
}
