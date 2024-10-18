import React, { Component, useRef, useState } from "react";
import axios from "../../axiosConfig";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../components/input-otp";
import useAuthStore from "../../store/authStore";

const VerifyOTP = () => {
  const [otp, setOtp] = useState();
  const navigate = useNavigate(); // Assuming you're using react-router for navigation
  const { isAuthenticated } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/otp/verify", { otp });
      const responseData = response.data.data;
      toast.success(response.data.message);

      if (responseData.institution.profile_complete === "yes") {
        navigate("/dashboard", {
          state: { institutionData: responseData.institution },
        });
      } else {
        navigate("/account-setup/profile", {
          state: { institutionData: responseData.institution },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white px-8 pb-8 pt-4 rounded-lg shadow-lg">
        <div className="text-center text-yellow-100 mb-4">
          <div className="flex items-center justify-center mx-auto w-20 h-20">
            <img src="/images/bclogo.jpg" alt="BacChecker Logo" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          OTP Verification
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2 mb-6">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
