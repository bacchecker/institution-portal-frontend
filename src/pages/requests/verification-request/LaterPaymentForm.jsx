import React, { useEffect, useState } from "react";
import SelectInput from "@/components/SelectInput";
import { useInitiatePaymentMutation } from "@/redux/apiSlice";
import LoadItems from "@/components/LoadItems";
import { toast } from "sonner";
import axios from "@/utils/axiosConfig";
import axiosDef from "axios";
import secureLocalStorage from "react-secure-storage";
import { use } from "react";


function LaterPaymentForm({ uniqueRequestedCode, requestBody }) {
  const initialUserInput = {
    payment_detail: "",
  };
  const paymentChannel = [
    { title: "Card", value: "card" },
    { title: "Mobile Money", value: "mobile_money" },
  ];

  const mobileMoneyPaymentMethods = [
    { title: "MTN", value: "MTN" },
    { title: "Telecel", value: "Telecel" },
  ];

  const bankPaymentMethods = [{ title: "VISA", value: "VISA" }];
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState({});
  const [userInput, setUserInput] = useState(initialUserInput);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});
  const [preferredPlatform, setPreferredPlatform] = useState("paystack");
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [currency, setCurrency] = useState("");
  const [instBill, setInstBill] = useState("Ghana");
  const [countryNames, setCountryNames] = useState([]);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await axios.get("/institution/institution-data");
        setInstBill(response?.data?.institutionData?.institution?.billing_address || "");
      } catch (error) {
        console.error("Failed to fetch institution data", error);
      }
    };

    fetchInstitution();
  }, []);
      
  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSeletedPaymentChannel = (item) => {
    setSelectedPaymentChannel(item);
    setSelectedPaymentMethod({});
    setUserInput((userInput) => ({
      ...userInput,
      payment_detail: "",
    }));
  };

  const handleSeletedPaymentMethod = (item) => {
    setSelectedPaymentMethod(item);
  };

  const [initiatePayment, { data, isSuccess, isLoading, error }] =
    useInitiatePaymentMutation();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsProcessing(true);
    
      if (
        selectedPaymentChannel?.value &&
        selectedPaymentMethod?.value &&
        userInput?.payment_detail &&
        preferredPlatform === "paystack"
      ) {
        await initiatePayment({
          channel: selectedPaymentChannel?.value,
          payment_method: selectedPaymentMethod?.value,
          unique_code: uniqueRequestedCode,
          amount: parseFloat(requestBody?.institution_document_type?.verification_fee),
          payment_detail: userInput?.payment_detail,
          payment_type: "verification",
        });
        setIsProcessing(false);
      } else if (preferredPlatform === "stripe") {
        const payload = {
          channel: "card",
          unique_code: uniqueRequestedCode,
          amount: parseFloat(requestBody?.institution_document_type?.foreign_verification_fee),
          payment_type: "verification",
        };
    
        try {
          const response = await axios.post("/stripe/request-payment", payload);
    
          if (response.data.status === "success") {
            window.location.href = response.data.url;
          } else {
            toast.error("Unexpected Stripe response.");
            console.error(response.data);
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || "Stripe Error");
          console.error(error);
        } finally {
          setIsProcessing(false);
        }
      } else {
        toast.error("Fill All Required Fields");
        setIsProcessing(false);
      }
    };
    

  useEffect(() => {
    const handlePaymentRedirect = async () => {
      if (isSuccess && data) {
        try {
        window.location.href = data.authorization_url;
        } catch (error) {
          console.error("Payment failed:", error.response?.data || error.message);
        }
      }
    };
  handlePaymentRedirect();
}, [isSuccess, data]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  useEffect(() => {
    
    if (instBill === "Ghana") {
      setPreferredPlatform("paystack");
      setFinalAmount(requestBody?.institution_document_type?.verification_fee);
      setCurrency("GH₵");
    } else {
      setPreferredPlatform("stripe");
      setFinalAmount(requestBody?.institution_document_type?.foreign_verification_fee);
      setCurrency("$");
    }
  }, [instBill]);
  
  useEffect(() => {
    axiosDef
      .get("https://restcountries.com/v3.1/all?fields=cca2,idd,name")
      .then((res) => {
        const names = res.data
          .map((country) => ({ name: country.name.common }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountryNames(names);
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);
  
  useEffect(() => {
    if (preferredPlatform === "stripe") {
      setSelectedPaymentMethod("card");
    }
  }, [preferredPlatform]);
  return (
    <form className="content" onSubmit={handleSubmit}>
      <h4 className="font-[600] md:text-[1.1vw] text-[4vw] md:my-[1vw!important] my-[4vw!important] md:px-[1vw] px-[5vw]">
        Enter your payment details
      </h4>
      <div className="md:px-[1vw] px-[5vw] w-full overflow-auto">
        <div className="md:mt-[1vw] mt-[10vw]">
          <h4 className="md:text-[1vw] text-[4vw] mb-1">Total Amount</h4>
          <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
            <input
              type="text"
              readOnly
              value={`${currency} ${Number(finalAmount || 0).toFixed(2)}`}
              className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0 read-only:bg-[#d8d8d8]"
            />
          </div>
        </div>
        <div className="w-full mt-2">
          <h4 className="md:text-[1vw] text-[4vw] mb-1">Billing Address</h4>
          <div className="relative w-full md:h-[2.7vw] h-[12vw] flex items-center border overflow-hidden bg-white rounded-sm">
            <select
              className="w-full px-1 md:h-[2.7vw] h-[12vw] md:text-[1vw] text-[3.5vw] bg-white border-r border-gray-300 focus:outline-none rounded-sm"
              value={instBill || ""}
              onChange={(e) => setInstBill(e.target.value)}
            >
              {countryNames.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {preferredPlatform === "paystack" && (
          <>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Select Payment Method<span className="text-[#f1416c]">*</span>
            </h4>
            <SelectInput
              placeholder={"Select Option"}
              data={paymentChannel}
              inputValue={selectedPaymentChannel?.title}
              onItemSelect={handleSeletedPaymentChannel}
              className="custom-dropdown-class display-md-none"
            />
          </div>
          {selectedPaymentChannel?.value && (
            <>
              <div className="md:mt-[2vw] mt-[8vw]">
                <h4 className="md:text-[1vw] text-[4vw] mb-1">
                  {selectedPaymentChannel?.value === "card" ? (
                    <>
                      Select Card Type<span className="text-[#f1416c]">*</span>
                    </>
                  ) : (
                    <>
                      Select Mobile Network
                      <span className="text-[#f1416c]">*</span>
                    </>
                  )}
                </h4>
                <SelectInput
                  placeholder={"Select Option"}
                  data={
                    selectedPaymentChannel?.value === "card"
                      ? bankPaymentMethods
                      : mobileMoneyPaymentMethods
                  }
                  inputValue={selectedPaymentMethod?.title}
                  onItemSelect={handleSeletedPaymentMethod}
                  className="custom-dropdown-class display-md-none"
                />
              </div>
              <div className="md:mt-[2vw] mt-[10vw]">
                <h4 className="md:text-[1vw] text-[4vw] mb-1">
                  {selectedPaymentChannel?.value === "card"
                    ? "Account Number"
                    : "Mobile Money Number"}
                </h4>
                <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5] ">
                  <input
                    type="number"
                    name="payment_detail"
                    value={userInput?.payment_detail}
                    onChange={handleUserInput}
                    className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0 read-only:bg-[#d8d8d8]"
                  />
                </div>
              </div>
            </>
          )}
          </>
        )}

        {preferredPlatform === "stripe" && (
          <div className="p-[2px] rounded-xl bg-gradient-to-r from-bChkRed to-black mt-4">
            <div
              className={`relative p-4 w-full bg-white cursor-pointer rounded-lg ${
                selectedPaymentMethod === "card" ? "border-gradient-to-r from-bChkRed to-black" : "border-gray-300"
              }`}
              onClick={() => setSelectedPaymentMethod("card")}
            >
              <input
                type="radio"
                id="stripe-card"
                name="payment"
                value="card"
                checked={selectedPaymentMethod === "card"}
                onChange={() => setSelectedPaymentMethod("card")}
                className="absolute top-2 left-2 w-5 h-5 accent-bChkRed"
              />
              <label htmlFor="stripe-card" className="block h-full w-full pl-8">
                <div className="font-bold text-[1.2vw]">Debit Card</div>
                <div className="text-gray-500 text-[0.9vw] mt-1">Pay with Visa / MasterCard</div>
              </label>
            </div>
          </div>
        )}


        

        <button
          type="submit"
          disabled={isLoading || isProcessing}
          className="bg-[#FF0404] md:my-[2vw!important] my-[4vw!important] w-full flex justify-center items-center md:py-[0.7vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#fa6767]"
        >
          {isLoading || isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <LoadItems color={"#ffffff"} size={15} />
              <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                Processing...
              </h4>
            </div>
          ) : (
            <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
              Proceed to Pay
            </h4>
          )}
        </button>
      </div>
    </form>
  );
}

export default LaterPaymentForm;
