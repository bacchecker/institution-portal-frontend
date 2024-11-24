import React, { Component, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "@utils/axiosConfig";
import { toast } from "sonner";
import { Input, Spinner } from "@nextui-org/react";
import { IoPerson } from "react-icons/io5";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post("/auth/forgot-password", { email });

            toast.success(response.data.message);
            
            if(response.data.status == 'success'){
                navigate("/login")
                return
            }
            
            setIsLoading(false);

        } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        setIsLoading(false);
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white px-8 pb-8 w-full md:w-1/2 lg:w-2/5 xl:w-1/3 pt-4 rounded-lg shadow-lg">
        <div className="text-center text-yellow-100 mb-4">
          <div className="flex items-center justify-center mx-auto w-24 h-24">
            <img src="/images/bclogo.jpg" alt="BacChecker Logo" />
          </div>
        </div>
        <p className="text-gray-700 text-sm mb-2">Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.</p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2 mb-6">
            <Input
                isRequired
                label="Email Address"
                type="email"
                name="email"
                value={email}
                className="mt-1 block w-full"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
                startContent={<IoPerson />}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#ff0404] text-white font-bold rounded-lg hover:bg-[#ff5d5d] focus:outline-none focus:ring-2 focus:ring-[#ff0404]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size="sm" color="white" />
                <h4>Processing...</h4>
              </div>
            ) : (
              <h4>Email Password Reset Link</h4>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
