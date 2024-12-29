import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInitiatePaymentMutation } from "@/redux/apiSlice";
import SelectInput from "@/components/SelectInput";
import LoadItems from "@/components/LoadItems";

function NewApplicationForm3({ totalApplicationAmount, uniqueRequestedCode }) {
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

  const [initiatePayment, { data, isSuccess, isLoading, isError, error }] =
    useInitiatePaymentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      selectedPaymentChannel?.value &&
      selectedPaymentMethod?.value &&
      userInput?.payment_detail
    ) {
      await initiatePayment({
        channel: selectedPaymentChannel?.value,
        payment_method: selectedPaymentMethod?.value,
        unique_code: uniqueRequestedCode,
        amount: totalApplicationAmount,
        payment_detail: userInput?.payment_detail,
        payment_type: "validation",
      });
    } else {
      toast.error("Fill All Required Fields");
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      window.location.href = data?.authorization_url;
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  return (
    <form className="content" onSubmit={handleSubmit}>
      <h4 className="font-[600] md:text-[1.1vw] text-[4vw] md:my-[1vw!important] my-[4vw!important] md:px-[1vw] px-[5vw]">
        Enter your payment details
      </h4>
      <div className="md:px-[1vw] px-[5vw] w-full overflow-auto">
        <div className="md:mt-[2vw] mt-[10vw]">
          <h4 className="md:text-[1vw] text-[4vw] mb-1">Total Amount</h4>
          <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
            <input
              type="number"
              readOnly
              value={totalApplicationAmount?.toFixed(2)}
              className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0 read-only:bg-[#d8d8d8]"
            />
          </div>
        </div>
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

        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#FF0404] md:my-[2vw!important] my-[4vw!important] w-full flex justify-center items-center md:py-[0.7vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#fa6767]"
        >
          {isLoading ? (
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

export default NewApplicationForm3;