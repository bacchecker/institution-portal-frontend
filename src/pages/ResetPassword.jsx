import React, { useEffect, useState } from "react";
import LeftDivLoginSignup from "./loginComponents/LeftDivLoginSignup";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../redux/apiSlice";
import LoadItems from "@/components/LoadItems";
import { toast } from "sonner";

function ResetPassword() {
  const initialState = {
    email: "",
  };
  const [userInput, setUserInput] = useState(initialState);

  const handleUserInput = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };
  const [forgotPassword, { data, isSuccess, isLoading, isError, error }] =
    useForgotPasswordMutation();

  const handleResetPassword = async (e) => {
    const { email } = userInput;
    e.preventDefault();
    await forgotPassword({ email });
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message, {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);
  return (
    <div className="flex w-full h-[100vh]">
      <LeftDivLoginSignup />
      <form
        onSubmit={handleResetPassword}
        className="w-full md:w-[50%] flex md:mt-[3%] mt-[20%] flex-col md:px-[10vw] px-[5vw]"
      >
        <div className="text-center flex flex-col items-center justify-center">
          <img
            src="/assets/img/logo.svg"
            alt=""
            className="md:w-[8vw] w-[33vw]"
          />
          <h4 className="md:text-[1.2vw] text-[5vw] md:mt-[1vw!important] mt-[2vw!important] font-[700!important]">
            Forgot your password?
          </h4>
          <h3 className="md:text-[1.1vw] text-[4vw] md:mt-[1vw!important] mt-[2vw!important] font-[300!important]">
            Enter the email associated with your account.
          </h3>
        </div>

        <div className="md:mt-[4vw] mt-[10vw]">
          <h4 className="md:text-[1vw] text-[4vw] mb-1">Email</h4>
          <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
            <input
              type="email"
              placeholder="eg. baccheckker@email.com"
              name="email"
              value={userInput.email}
              required
              onChange={handleUserInput}
              className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:py-[0.7vw] py-[3vw] md:mt-[2vw] mt-[5vw] md:text-[0.9vw] text-[3.5vw] text-white md:rounded-[0.3vw] rounded-[1.5vw] bg-[#FF0000] hover:bg-[#ef4242] transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadItems color={"#ffffff"} size={15} />
              <h4>Sending...</h4>
            </div>
          ) : (
            <h4>Send Reset Link</h4>
          )}
        </button>
        <div className="w-full text-center">
          <Link to="/">
            <h4 className="md:text-[1vw] text-[3.5vw] md:my-[1vw!important] my-[3vw!important] text-[#ff0000]">
              Wait, I remember the my password
            </h4>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
