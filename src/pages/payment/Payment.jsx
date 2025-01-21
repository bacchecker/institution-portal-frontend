import React from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const paymentData = location.state?.paymentData;

  return (
    <div className="w-full min-h-screen p-[2vw]">
      <div className="bg-white rounded-[0.5vw] p-[2vw]">
        <h1 className="text-[1.5vw] font-[600] mb-[1vw]">Payment</h1>

        {paymentData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span className="text-[1vw] text-gray-600">Amount:</span>
              <span className="text-[1vw] font-semibold">
                {paymentData.amount}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span className="text-[1vw] text-gray-600">Reference:</span>
              <span className="text-[1vw] font-medium">
                {paymentData.reference}
              </span>
            </div>
            {/* Add payment form or integration here */}
            <button
              className="w-full bg-[#FF0404] text-white py-[0.8vw] rounded-[0.3vw] text-[0.9vw] hover:bg-[#ef4545] transition-all duration-300"
              onClick={() => {
                // Handle payment
                console.log("Processing payment...");
              }}
            >
              Proceed to Payment
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[1vw] text-gray-600">
              No payment information available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
