import React, {useState, useEffect} from "react";
import axios from "@/utils/axiosConfig";
import Navbar from "@/components/Navbar";
import PermissionWrapper from "@/components/permissions/PermissionWrapper";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { IoIosStar } from "react-icons/io";
import Drawer from "@/components/Drawer";
import LoadItems from "../../components/LoadItems";
import { FaRegCircleCheck } from "react-icons/fa6";

export default function Plans() {

    const [plans, setPlans] = useState([]);

    const [loading, setLoading] = useState(true);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [data, setData] = useState(null);
    // Payment States
    const [selectedPayment, setSelectedPayment] = useState(""); // Track selected payment method
    const [mobileNetwork, setMobileNetwork] = useState("");
    const [cardType, setCardType] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [mobileNumber, setMobileNumber] = useState(""); // Track mobile number
    const [cardDetails, setCardDetails] = useState({
      cardNumber: "",
      cardHolder: "",
      expiry: "",
      cvv: "",
    });

    const handleClear = () => {
      setSelectedPayment(""); // Clear selected payment method
      setMobileNetwork(""); // Clear mobile network
      setMobileNumber(""); // Clear mobile number
      setCardDetails({
        cardType: "",
      }); // Clear card details
    };
    
    // Fetch plans
    const fetchPlans = async () => {
      setLoading(true);
      try {
          const response = await axios.get('/institution/subscription-plans');

          setPlans(response.data.plans);
          setLoading(false);
      } catch (error) {
          console.error('Error fetching plans:', error);
          setLoading(false);
      }
    };


    useEffect(() => {
        fetchPlans();
    }, []);

    const handlePaymentChange = (e) => {
      setSelectedPayment(e.target.value); // Set the selected payment method
    };
  
    const handleFormSubmit = async (e) => {
      e.preventDefault();
    
      const payload = {
        subscription_plan_id: data?.id,
        channel: selectedPayment,
        payment_type: 'subscription',
        amount: data?.amount,
        ...(selectedPayment === "card" && { payment_method: cardType, payment_detail: cardNumber }),
        ...(selectedPayment === "mobile_money" && { payment_method: mobileNetwork, payment_detail: mobileNumber }),
      };
    
      try {
        const response = await axios.post("/payments/initiate", payload);
        if (response.data.status == "success") {
          window.location.href = response?.data?.authorization_url;
        }
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
      }
    }

  return (
    <div title="Subscription Plan" className="bg-white">
    <Navbar />
      <div className="">
        <div className="bg-white rounded-lg p-4 lg:p-10">
          <div className="w-full rounded-lg border-t-4 border-bChkRed p-5 shadow bg-yellow-50 font-normal text-sm">
            <p className="uppercase font-semibold text-lg text-black mb-2">Simplifying Document Verification</p>
            <div className="flex items-center justify-between">
              <p className="w-2/3 text-justify">E-Check is an advanced document verification solution offered by BacChecker, 
                designed to streamline and simplify the verification process between institutions and document owners. 
                This service enables institutions to verify documents such as certificates, transcripts, or other credentials
                efficiently, securely, and with minimal effort.
              </p>
              <div className="flex flex-col space-y-2 self-start">
                <div className="flex space-x-2 text-sm font-semibold">
                  <IoIosStar className="text-yellow-500" />
                  <p>Quick & Reliable</p>
                </div>
                <div className="flex space-x-2 text-sm font-semibold">
                  <IoIosStar className="text-yellow-500" />
                  <p>Cost-Effective Plans</p>
                </div>
                <div className="flex space-x-2 text-sm font-semibold">
                  <IoIosStar className="text-yellow-500" />
                  <p>Robust Security for Data </p>
                </div>
              </div>
            </div>
            
          </div>
          <div className="flex flex-col lg:flex-row lg:justify-between">
            <div className="p-1">
              <h2 className="font-extrabold text-3xl mb-2">Choose your plan</h2>
              <div className="flex space-x-2 items-center">
                <MdOutlineRocketLaunch size={20}/>
                <p className="w-4/5 lg:w-1/2 text-sm">Get the right plan for your institution. Plans can be upgraded in the future</p>
              </div>
            </div>
            <div className="flex items-center rounded-md bg-bChkRed text-white h-8 lg:h-10 self-end px-3 lg:px-4 text-sm lg:text-base">
              Learn More
            </div>
            
          </div>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5 mt-4 lg:mt-10">
              <div role="status" className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
                  <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                      <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                          <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                          <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                      </svg>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="flex items-center mt-4">
                    <svg className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                      </svg>
                      <div>
                          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                          <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      </div>
                  </div>
                  <span className="sr-only">Loading...</span>
              </div>
              <div role="status" className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
                  <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                      <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                          <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                          <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                      </svg>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="flex items-center mt-4">
                    <svg className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                      </svg>
                      <div>
                          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                          <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      </div>
                  </div>
                  <span className="sr-only">Loading...</span>
              </div>
              <div role="status" className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
                  <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                      <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                          <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                          <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                      </svg>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="flex items-center mt-4">
                    <svg className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                      </svg>
                      <div>
                          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                          <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      </div>
                  </div>
                  <span className="sr-only">Loading...</span>
              </div>
            </div>
          ):(
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5 mt-4 lg:mt-10">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-xl shadow-md shadow-gray-400 px-5 py-7"
                >
                  <div className="flex space-x-2 items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-bChkRed"></div>
                    <p>{plan.name}</p>
                  </div>
                  <p className="text-3xl font-semibold text-black mt-2">
                    GH₵ <span>{(plan?.amount)}</span>
                  </p>
                  <div className="flex flex-col space-y-1 mt-4">
                    <div className="flex space-x-2 text-xs">
                      <IoIosStar className="text-yellow-500" />
                      <p>{plan?.credit} Credits</p>
                    </div>
                    <div className="flex space-x-2 text-xs">
                      <IoIosStar className="text-yellow-500" />
                      <p>{plan?.bonus} Bonus</p>
                    </div>
                    <div className="flex space-x-2 text-xs">
                      <IoIosStar className="text-yellow-500" />
                      <p>{plan?.total_credit} Total Credits</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs text-justify mt-2">
                    {plan?.description}
                  </p>
                  <button 
                    onClick={() => {
                      setData(plan);
                      setOpenDrawer(true);
                    }}
                    className="w-full border border-bChkRed hover:text-white text-bChkRed hover:bg-bChkRed bg-white rounded-lg mt-4 py-2 text-sm"
                  >
                    Get Plan
                  </button>
                </div>
              ))}
            </div>
          )}
          
        </div>
      </div>
      <Drawer
        title="Payment Details"
        isOpen={openDrawer}
        setIsOpen={setOpenDrawer}
        classNames="w-[100vw] md:w-[40vw] lg:w-[32vw] xl:w-[28vw] z-10"
      >
        <div className="h-full flex flex-col justify-between">
        <form onSubmit={handleFormSubmit} className="relative space-y-4 h-full text-sm">
          <div className="flex flex-col space-y-3 -mt-5 font-semibold">
            <div className="text-sm border-2 border-green-600 rounded-md p-4">
              <div className="flex items-center justify-between space-x-2 ">
                <div className="flex space-x-3 items-center text-green-700">
                  <FaRegCircleCheck size={24}/>
                  <div className="text-lg">
                    <p>{data?.name}</p>
                  </div>
                </div>
                <div className="text-lg"><span className="text-sm font-normal">GH₵ </span>{data?.amount}</div>
              </div>
              <div className="flex space-x-2 mt-4 justify-end">
                <div className="flex space-x-1 text-xs">
                    <IoIosStar className="text-yellow-500" />
                    <p>{data?.credit} Credits</p>
                </div>
                <div className="flex space-x-1 text-xs">
                    <IoIosStar className="text-yellow-500" />
                    <p>{data?.bonus} Bonus</p>
                </div>
                <div className="flex space-x-1 text-xs">
                    <IoIosStar className="text-yellow-500" />
                    <p>{data?.total_credit} Total Credit</p>
                </div>
              </div>
              
            </div>
            <p className="uppercase text-sm">Select Payment Method</p>

            {/* Card Payment */}
            <div
              className={`flex justify-between items-center rounded-lg p-3 cursor-pointer ${
                selectedPayment === "card" ? "bg-bChkRed text-white" : "bg-gray-100 text-black"
              }`}
              onClick={() => setSelectedPayment("card")}
            >
              <input
                type="radio"
                name="payment"
                value="card"
                checked={selectedPayment === "card"}
                onChange={handlePaymentChange}
                className="hidden"
              />
              <div className="flex items-center space-x-4">
                <p>Card</p>
                <img
                  src="/assets/img/visa-mastercard.svg"
                  alt="Card"
                  className="h-4 w-auto"
                />
              </div>
            </div>

            {/* Mobile Money */}
            <div
              className={`flex justify-between items-center rounded-lg p-3 cursor-pointer ${
                selectedPayment === "mobile_money"
                  ? "bg-bChkRed text-white"
                  : "bg-gray-100 text-black"
              }`}
              onClick={() => setSelectedPayment("mobile_money")}
            >
              <input
                type="radio"
                name="payment"
                value="mobile_money"
                checked={selectedPayment === "mobile_money"}
                onChange={handlePaymentChange}
                className="hidden"
              />
              <div className="flex space-x-4 items-center">
                <p>Mobile Money</p>
                <img
                  src="/assets/img/momo.png"
                  alt="Mobile Money"
                  className="h-4 w-auto"
                />
              </div>
            </div>
          </div>

          {/* Additional Fields for Card Payment */}
          {selectedPayment === "card" && (
            <div className="space-y-3">
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
              >
                <option value="">Select Card Type</option>
                <option value="VISA">VISA</option>
                <option value="Master Card">Master Card</option>
              </select>
              <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
              />
            </div>
          )}

          {/* Additional Fields for Mobile Money */}
          {selectedPayment === "mobile_money" && (
            <div className="space-y-3">
              <select
                value={mobileNetwork}
                onChange={(e) => setMobileNetwork(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
              >
                <option value="">Select Mobile Network</option>
                <option value="MTN">MTN</option>
                <option value="Telecel">Telecel</option>
              </select>
              <input
                type="number"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
              />
            </div>
          )}


        

          <div className="w-full absolute flex items-center space-x-2 justify-center border-t pt-2 text-sm bottom-0">
            <button
              className="w-1/2 bg-black py-2 text-white font-medium !rounded-md"
              onClick={() => {
                setOpenDrawer(false);
                setData(null);
                handleClear()
              }}
            >
              Close
            </button>
            <button
            type="submit"
            className="w-1/2 bg-bChkRed text-white py-2 rounded-md hover:bg-red-700"
          >
            Submit Payment
          </button>
          </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}
