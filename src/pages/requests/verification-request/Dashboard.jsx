import React, { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  FaCreditCard,
  FaCrown,
} from "react-icons/fa6";
import { RiAddBoxFill, RiAlarmWarningFill } from "react-icons/ri";
import { HiMiniUsers } from "react-icons/hi2";
import { IoIosArrowDroprightCircle, IoIosStar, IoMdTrendingUp } from "react-icons/io";
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
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import LoadItems from "@/components/LoadItems";
import { toast } from "sonner";
import { GiUpgrade } from "react-icons/gi";

export default function Dashboard() {
  const [receivedRequest, setReceivedRequest] = useState(0);
  const [sentRequest, setSentRequest] = useState(0);
  const [subscription, setSubscription] = useState("");
  const [currentPackage, setCurrentPackage] = useState("");
  const [preferredPlatform, setPreferredPlatform] = useState("stripe");
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

  const [clientSecret, setClientSecret] = useState(null);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const stripePromise = loadStripe("pk_test_51R6UPMGfpcTSeSCYZFlk5zGIgl2l7xEV0IcNTEmi0XObDS3DfbRCQOKiBZjOdaSOGxDvpIykgAI1OKh3xn6Oq1ty00rF3VL1NJ");
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
  useEffect(() => {
    setPaymentData(paymentData);
  }, [paymentData]);

  const pages = [
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
    <div className="w-full flex flex-col justify-center h-full">
      <div className="">
        <p className="font-semibold mb-1 text-lg">Choose Plan</p>
        <p className="w-full xl:w-2/3 text-xs">
          E-Check makes document verification fast, secure, and hassle-free.
          Choose a plan that fits your needs and start verifying instantly!
        </p>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5 mt-4 lg:mt-8">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              role="status"
              className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
            >
              <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                <svg
                  className="w-10 h-10 text-gray-200 dark:text-gray-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 20"
                >
                  <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                </svg>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center mt-8">
          <div className="md:!h-[40vh] h-[30vh] flex flex-col gap-8 items-center justify-center">
            <img
              src="/assets/img/no-data.svg"
              alt="No data"
              className="w-1/4 md:w-[10%] h-auto"
            />
            <p className="text-center text-slate-500 font-montserrat font-medium text-base -mt-6">
              No plans available at the moment. Please check back later.
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`grid ${
            plans.length === 1
              ? "grid-cols-1"
              : plans.length === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-2 lg:grid-cols-3"
          } gap-3 lg:gap-5 mt-4 lg:mt-8`}
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="w-full rounded-xl px-3 lg:px-5 py-5 lg:py-7 bg-gray-100 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="w-full flex flex-col text-[13px] pb-3 border-b mb-2">
                <p className="text-center">{plan?.name}</p>
                <p className="font-semibold text-base text-center">
                  GH₵ {plan?.amount}
                </p>
                <p className="font-light text-center -mt-1">{plan?.expires_in} Days</p>
              </div>
              <div className="my-2">
                <p className="font-semibold text-xs">Description</p>
                <p className="text-gray-500 text-xs text-justify mt-2">
                  {plan?.description}
                </p>
              </div>
              <div className="flex flex-col space-y-1 mt-4 text-xs">
                <p className="font-semibold">Package Benefits</p>
                <div className="flex space-x-1.5 text-xs">
                  <IoIosStar className="text-yellow-500" />
                  <p>{plan?.number_of_departments} Departments {plan?.number_of_users} Users</p>
                </div>
                <div className="flex space-x-1.5 text-xs">
                    <IoIosStar className="text-yellow-500" />
                    <p>{plan?.credit} Credits</p>
                </div>
                <div className="flex space-x-1.5 text-xs">
                  <IoIosStar className="text-yellow-500" />
                  <p>{plan?.bonus} Bonus</p>
                </div>
                <div className="flex space-x-1.5 text-xs">
                  <IoIosStar className="text-yellow-500" />
                  <p>{plan?.total_credit} Total Credits</p>
                </div>
              </div>
              {currentPackage == plan?.name ? (
                <div className="border border-bChkRed rounded-md text-xs p-2 text-gray-700 font-medium">
                  <div className="flex space-x-2 items-center text-xs">
                    <RiAlarmWarningFill />
                    Note
                  </div>
                  You are subscribed to this package, you cannot choose the same plan
                </div>
              ):(
                <button
                  type="button"
                  onClick={() => {
                    setPaymentData(plan);

                    setOpenPaymentDrawer(true);
                    setOpenSubDrawer(false);
                  }}
                  className="w-full hover:text-white text-gray-500 hover:bg-gray-500 bg-gray-300 rounded-md mt-6 py-2 text-xs"
                >
                  Choose Plan
                </button>
              )}
              
            </div>
          ))}
        </div>
      )}
    </div>,
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
        setRecentVerifications(response.data.recent_verifications);
        setSentRequest(response.data.sent_requests);
        setReceivedRequest(response.data.received_requests);
        setSubscription(response.data.subscription);
        const currentPackage = typeof response.data.current_package === 'string'
          ? response.data.current_package
          : response.data.current_package?.name;

        setCurrentPackage(currentPackage);
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
      
      if (totalCredit < 1 && inRequest < 1) {
        setOpenDrawer(true);
      } else {
        setOpenDrawer(false);
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
    if (name === 'numberOfCredits' && !/^\d*$/.test(value)) {
      return; // Prevent non-numeric input
    }
  
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
      ...(name === 'numberOfCredits' && {
        amount: value ? value * creditValue : 0, // Multiply credits by creditValue
      }),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    if (selectedPayment === "card" && preferredPlatform == 'paystack') {
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
      ...(selectedPayment === "card" && {
        payment_method: 'card',
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
          setClientSecret(response.data.clientSecret);
          setShowStripeForm(true);
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
    if (selectedPayment === "card" && preferredPlatform == 'paystack') {
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
      ...(selectedPayment === "card" && preferredPlatform == 'paystack' &&  {
        payment_method: 'card',
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
          setClientSecret(response.data.clientSecret);
          setShowStripeForm(true);
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
            className="border border-gray-400 flex space-x-1 items-center rounded-full px-3 py-1 uppercase text-sm text-gray-600"
          >
            
            <p>
              Learn More
            </p>
            <IoIosArrowDroprightCircle size={20}/>
          </button>
          <div className=" flex justify-end pr-2 space-x-2">
            <button
              type="button"
              onClick={() => {
                setOpenSubDrawer(true);
              }}
              className="bg-black flex space-x-1 items-center rounded-md px-3 py-1 uppercase text-sm text-white"
            >
              <GiUpgrade size={16}/>
              <p>
                {currentPackage == "No Package" ? "Subscribe to a Package" : "Upgrade Package"}
              </p>

            </button>
            {currentPackage != "No Package" &&(
              <button
                type="button"
                onClick={() => {
                  setOpenTopUpDrawer(true);
                }}
                className="bg-bChkRed flex space-x-1 items-center rounded-md px-3 py-1 uppercase text-sm text-white"
              >
                <RiAddBoxFill size={21}/>
                <p>Top Up Credits</p>
              </button>
            )}
          </div>
          
          
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
                {typeof currentPackage === 'string' && currentPackage !== 'No Package'
                  ? currentPackage.split(' ').pop() === 'Package'
                    ? currentPackage
                    : `${currentPackage} Package`
                  : 'No Package'}
              </p>

                <FaCrown size={20} className="text-yellow-400"/>
              </div>
            </div>
              
            <div className="flex space-x-4">
              <div className="bg-purple-300 text-purple-500 h-10 w-12 rounded-full flex items-center justify-center">
                <FaCreditCard size={16} />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="font-medium">
                  E-check subscription balance
                </p>
                <div className="w-full flex items-center justify-between">
                  <p className="text-black text-xl font-semibold">
                    {subscription?.balance || 0} Credits
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
            <div className="h-[90vh] flex flex-col relative bg-white rounded-lg w-[98vw] md:w-[80vw] xl:w-[70vw] p-4" onClick={(e) => e.stopPropagation()}>
              
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
                          currentPage - 1 === index ? "bg-bChkRed" : "bg-gray-200"
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

        <Modal
          isOpen={openSubDrawer}
          setIsOpen={setOpenSubDrawer}
          classNames="w-[98vw] md:w-[80vw] xl:w-[70vw] z-10 rounded-md"
        >
          <div className="h-full flex flex-col relative p-4 text-black">
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpenSubDrawer(false);
                }}
              >
                Close
              </button>
            </div>
            <div className="">
              <p className="font-semibold mb-1 text-lg">Choose Plan</p>
              <p className="w-full xl:w-2/3 text-xs">
                E-Check makes document verification fast, secure, and
                hassle-free. Choose a plan that fits your needs and start
                verifying instantly!
              </p>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5 mt-4 lg:mt-6">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    role="status"
                    className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                      <svg
                        className="w-10 h-10 text-gray-200 dark:text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                      >
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                      </svg>
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                ))}
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center mt-8">
                <div className="md:!h-[40vh] h-[30vh] flex flex-col gap-8 items-center justify-center">
                  <img
                    src="/assets/img/no-data.svg"
                    alt="No data"
                    className="w-1/4 md:w-[10%] h-auto"
                  />
                  <p className="text-center text-slate-500 font-montserrat font-medium text-base -mt-6">
                    No plans available at the moment. Please check back later.
                  </p>
                </div>
              </div>
            ) : (
              <div
                className={`grid ${
                  plans.length === 1
                    ? "grid-cols-1"
                    : plans.length === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-2 lg:grid-cols-3"
                } gap-3 lg:gap-5 mt-4 lg:mt-8`}
              >
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="w-full rounded-xl px-3 lg:px-5 py-5 lg:py-7 bg-gray-100 shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="w-full flex flex-col text-[13px] pb-3 border-b mb-2">
                      <p className="text-center">{plan?.name}</p>
                      <p className="font-semibold text-base text-center">
                        GH₵ {plan?.amount}
                      </p>
                      <p className="font-light text-center -mt-1">{plan?.expires_in} Days</p>
                    </div>
                    <div className="my-2">
                      <p className="font-semibold text-xs">Description</p>
                      <p className="text-gray-500 text-xs text-justify mt-2">
                        {plan?.description}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-1 mt-2 text-xs">
                      <p className="font-semibold">Package Benefits</p>
                      <div className="flex space-x-1.5 text-xs">
                        <IoIosStar className="text-yellow-500" />
                        <p>{plan?.number_of_departments} Departments {plan?.number_of_users} Users</p>
                      </div>
                      <div className="flex space-x-1.5 text-xs">
                          <IoIosStar className="text-yellow-500" />
                          <p>{plan?.credit} Credits</p>
                      </div>
                      <div className="flex space-x-1.5 text-xs">
                        <IoIosStar className="text-yellow-500" />
                        <p>{plan?.bonus} Bonus</p>
                      </div>
                      <div className="flex space-x-1.5 text-xs">
                        <IoIosStar className="text-yellow-500" />
                        <p>{plan?.total_credit} Total Credits</p>
                      </div>
                    </div>
                    {currentPackage == plan?.name ? (
                      <div className="border border-bChkRed rounded-md text-xs p-2 text-gray-700 font-medium">
                        <div className="flex space-x-1 text-sm text-bChkRed font-semibold">
                          <RiAlarmWarningFill size={16}/>
                          <p className="self">Notice</p>
                        </div>
                        You are subscribed to this package, you cannot choose the same plan
                      </div>
                    ):(
                      <button
                      type="button"
                      onClick={() => {
                        setPaymentData(plan);
                        setOpenPaymentDrawer(true);
                        setOpenSubDrawer(false);
                      }}
                      className="w-full hover:text-white text-gray-500 hover:bg-gray-500 bg-gray-300 rounded-md mt-6 py-2 text-xs"
                    >
                      Choose Plan
                    </button>
                    )

                    }
                    
                  </div>
                ))}
              </div>
            )}
            <div className="w-full absolute bottom-0 left-0 bg-white mt-2">
              <div className="flex justify-between items-center px-4">
                {/* Previous Button */}
                <button
                  type="button"
                  disabled={currentPage === 0}
                  className={`${
                    currentPage === 0
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-bChkRed text-white hover:bg-red-500"
                  } px-6 py-1 rounded-sm text-xs`}
                  onClick={handlePrevious}
                >
                  Previous
                </button>

                {/* Page Indicators */}
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-1 transition-all rounded-xl ${
                        currentPage === index ? "bg-bChkRed" : "bg-gray-200"
                      }`}
                    ></div>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  disabled={currentPage === totalPages - 1}
                  className={`${
                    currentPage === totalPages - 1
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-bChkRed text-white hover:bg-red-500"
                  } px-6 py-1 rounded-sm text-xs`}
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </Modal>
        <SideModal
          title={"Top Up Subscription Credits"}
          setOpenModal={setOpenTopUpDrawer}
          openModal={openTopUpDrawer}
          classNames="w-[98vw] md:w-[80vw] xl:w-[60vw] z-10 rounded-md"
        >
          <div className="h-full flex flex-col relative p-4 text-black">
            
            <form
              onSubmit={handleTopupSubmit}
              className="relative space-y-4 h-[85dvh] text-sm"
            >
              <div className="flex flex-col font-semibold py-2">
                <div className="">
                  <h4 className="md:text-[1vw] text-[4vw] mb-1">
                    Number of Credits
                  </h4>
                  <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                      type="number"
                      name="numberOfCredits"
                      value={paymentDetails.numberOfCredits}
                      onChange={handleCreditChange}
                      className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0"
                    />
                  </div>
                </div>
                <div className=" mt-4">
                  <h4 className="md:text-[1vw] text-[4vw]">
                    Bonus Credits
                  </h4>
                  <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                      type="text"
                      readOnly
                      value={paymentDetails.bonus_amount}
                      className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0 read-only:bg-[#d8d8d8]"
                    />
                  </div>
                </div>
                <div className=" mt-4">
                  <h4 className="md:text-[1vw] text-[4vw]">
                    Amount to be Paid
                  </h4>
                  <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                      type="text"
                      readOnly
                      value={paymentDetails.amount}
                      className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0 read-only:bg-[#d8d8d8]"
                    />
                  </div>
                </div>

                <div className="flex flex-row space-x-4 mt-4">
                  <div className="flex items-center">
                    <input
                      id="card-option"
                      type="radio"
                      name="payment"
                      value="card"
                      checked={selectedPayment === "card"}
                      onChange={() => setSelectedPayment("card")}
                      className="w-5 h-5 bg-gray-100 border-gray-300"
                    />
                    <label
                      for="card-option"
                      className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
                    >
                      Debit Card
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="mobile-money-option"
                      type="radio"
                      name="payment"
                      value="mobile_money"
                      checked={selectedPayment === "mobile_money"}
                      onChange={() => setSelectedPayment("mobile_money")}
                      className="w-5 h-5 bg-gray-100 border-gray-300"
                    />
                    <label
                      for="mobile-money-option"
                      className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
                    >
                      Mobile Wallet
                    </label>
                  </div>
                </div>
              </div>

              {/* Additional Fields for Card Payment */}
              {selectedPayment === "card" && preferredPlatform === "paystack" && (
                <div className="">
                  <div className="mb-4">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                      Card Number
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentDetails.cardNumber}
                        onChange={handleInputChange}
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">Expiration Date</h4>
                      <div className="flex gap-2">
                        {/* Expiry Month */}
                        <div className="relative w-1/2 md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                          <input
                            type="number"
                            name="expiryMonth"
                            placeholder="MM"
                            value={paymentDetails.expiryMonth}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (value.length <= 2) {
                                if (value > 12) value = "12"; // Restrict to 12 max
                                if (value < 1 && value !== "") value = "01"; // Restrict to 01 min
                                handleInputChange({ target: { name: "expiryMonth", value } });
                              }
                            }}
                            className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0 text-center"
                          />
                        </div>

                        {/* Expiry Year */}
                        <div className="relative w-1/2 md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                          <input
                            type="number"
                            name="expiryYear"
                            placeholder="YYYY"
                            value={paymentDetails.expiryYear}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (value.length <= 4) {
                                handleInputChange({ target: { name: "expiryYear", value } });
                              }
                            }}
                            className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0 text-center"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">CVC</h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="text"
                          name="cvcCode"
                          value={paymentDetails.cvcCode}
                          onChange={handleInputChange}
                          className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {clientSecret && preferredPlatform === "stripe" && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <Modal
                    isOpen={showStripeForm}
                    setIsOpen={setShowStripeForm}
                    classNames="w-[100vw] bg-red-600 md:w-[80vw] lg:w-[60vw] z-50 rounded-sm"
                  >
                    <div className="p-4">
                      <StripeCheckoutForm onSuccess={() => {
                        setShowStripeForm(false);
                        setClientSecret(null);
                      }} />
                    </div>
                  </Modal>
                </Elements>
              )}


              {/* Additional Fields for Mobile Money */}
              {selectedPayment === "mobile_money" && (
                <div className="space-y-6">
                  <div className="mt-4">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                      Mobile Network
                    </h4>
                    <select
                      name="mobileNetwork"
                      value={paymentDetails.mobileNetwork}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-3 py-2 text-sm rounded-md focus:outline-none"
                    >
                      <option value="">Select Mobile Network</option>
                      <option value="MTN">MTN</option>
                      <option value="Telecel">Telecel</option>
                    </select>
                  </div>

                  <div className="md:mt-[2vw] mt-[10vw]">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                      Mobile Number
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                      <input
                        type="text"
                        name="mobileNumber"
                        value={paymentDetails.mobileNumber}
                        onChange={handleInputChange}
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full absolute flex items-center space-x-2 justify-between pt-2 text-sm bottom-0">
               
                <button
                  type="submit"
                  className="w-full bg-bChkRed text-white py-2 rounded-md hover:bg-red-700"
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadItems color={"#ffffff"} size={15} />
                      <h4 className=" text-[#ffffff]">Completing...</h4>
                    </div>
                  ) : (
                    <h4 className=" text-[#ffffff]">Complete Top-up</h4>
                  )}
                </button>
              </div>
            </form>
          </div>
        </SideModal>
        <Modal
          title="Payment Details"
          isOpen={openPaymentDrawer}
          setIsOpen={setOpenPaymentDrawer}
          classNames="w-[100vw] md:w-[80vw] lg:w-[60vw] z-10 rounded-md"
        >
          <div className="h-full flex flex-col relative p-4">
            <form
              onSubmit={handleFormSubmit}
              className="relative space-y-4 h-full text-sm"
            >
              <div className="flex flex-col font-semibold py-2">
                <div className="">
                  <p className="font-semibold text-black text-base">
                    Add a billing method
                  </p>
                  <p className="font-normal text-black w-full xl:w-2/3">
                    E-Check makes document verification fast, secure and
                    hassle-free. Choose a plan that fits your needs and start
                    verifying instantly
                  </p>
                </div>

                <div className="flex flex-row space-x-4 mt-12">
                  <div className="flex items-center">
                    <input
                      id="card-option"
                      type="radio"
                      name="payment"
                      value="card"
                      checked={selectedPayment === "card"}
                      onChange={() => setSelectedPayment("card")}
                      className="w-5 h-5 bg-gray-100 border-gray-300 accent-bChkRed"
                    />
                    <label
                      for="card-option"
                      className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
                    >
                      Debit Card
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="mobile-money-option"
                      type="radio"
                      name="payment"
                      value="mobile_money"
                      checked={selectedPayment === "mobile_money"}
                      onChange={() => setSelectedPayment("mobile_money")}
                      className="w-5 h-5 bg-gray-100 border-gray-300 accent-bChkRed"
                    />
                    <label
                      for="mobile-money-option"
                      className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
                    >
                      Mobile Wallet
                    </label>
                  </div>
                </div>
              </div>

              {/* Additional Fields for Card Payment */}
              {selectedPayment === "card" && preferredPlatform === "paystack" && (
                <div className="">
                  <div className="mb-5">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                      Card Number
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentDetails.cardNumber}
                        onChange={handleInputChange}
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">
                        First Name
                      </h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="text"
                          name="firstName"
                          value={paymentDetails.firstName}
                          onChange={handleInputChange}
                          className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0"
                        />
                      </div>
                    </div>
                    <div className="">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">
                        Last Name
                      </h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="text"
                          name="lastName"
                          value={paymentDetails.lastName}
                          onChange={handleInputChange}
                          className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0"
                        />
                      </div>
                    </div>
                    <div className="">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">
                        Expiration Date
                      </h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="text"
                          name="expirationDate"
                          value={paymentDetails.expirationDate}
                          onChange={handleInputChange}
                          className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0"
                        />
                      </div>
                    </div>
                    <div className="">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">CVC</h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="text"
                          name="cvcCode"
                          value={paymentDetails.cvcCode}
                          onChange={handleInputChange}
                          className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {clientSecret && preferredPlatform === "stripe" && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <Modal
                    isOpen={showStripeForm}
                    setIsOpen={setShowStripeForm}
                    classNames="w-[100vw] md:w-[80vw] lg:w-[60vw] z-50 rounded-md"
                  >
                    <div className="p-4">
                      <StripeCheckoutForm onSuccess={() => {
                        setShowStripeForm(false);
                        setClientSecret(null);
                      }} />
                    </div>
                  </Modal>
                </Elements>
              )}

              {/* Additional Fields for Mobile Money */}
              {selectedPayment === "mobile_money" && (
                <div className="space-y-6">
                  <div className="md:mt-[2vw] mt-[10vw]">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                      Mobile Network
                    </h4>
                    <select
                      name="mobileNetwork"
                      value={paymentDetails.mobileNetwork}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-3 py-2 text-sm rounded-md focus:outline-none"
                    >
                      <option value="">Select Mobile Network</option>
                      <option value="MTN">MTN</option>
                      <option value="Telecel">Telecel</option>
                    </select>
                  </div>

                  <div className="md:mt-[2vw] mt-[10vw]">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                      Mobile Number
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                      <input
                        type="text"
                        name="mobileNumber"
                        value={paymentDetails.mobileNumber}
                        onChange={handleInputChange}
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full absolute flex items-center space-x-2 justify-between pt-2 text-sm bottom-0">
                <button
                  type="button"
                  className=" bg-bChkRed py-2 px-4 text-white font-medium !rounded-sm"
                  onClick={() => {
                    setOpenPaymentDrawer(false);
                    setOpenSubDrawer(true);
                    setData(null);
                    handleClear();
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 bg-bChkRed text-white py-2 rounded-sm hover:bg-red-700"
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadItems color={"#ffffff"} size={15} />
                      <h4 className=" text-[#ffffff]">Completing...</h4>
                    </div>
                  ) : (
                    <h4 className=" text-[#ffffff]">Complete Subscription</h4>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
}
