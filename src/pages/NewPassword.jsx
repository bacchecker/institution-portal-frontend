import React, { useEffect, useState } from "react";
import LeftDivLoginSignup from "./loginComponents/LeftDivLoginSignup";
import { useResetPasswordMutation } from "../redux/apiSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import hasSpecialCharAndUpperCase from "@/components/HasSpecialCharAndUpperCase";
import LoadItems from "@/components/LoadItems";
import { toast } from "sonner";

function NewPassword() {
  const initialState = {
    password: "",
  };
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const [userInput, setUserInput] = useState(initialState);

  const queryParams = new URLSearchParams(location.search);

  const token = queryParams.get("token");
  const email = queryParams.get("email");

  const handleUserInput = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };
  const colors = [
    "color-1",
    "color-2",
    "color-3",
    "color-4",
    "color-5",
    "color-6",
  ];

  useEffect(() => {
    const divs = document.querySelectorAll(".password-val > div");

    divs.forEach((div, index) => {
      div.className = div.className.replace(/\bcolor-\d+\b|\bgreen\b/g, "");
      if (userInput?.password?.length > index) {
        div.classList.add(colors[index]);
      }
    });
    if (
      userInput?.password?.length >= 8 &&
      hasSpecialCharAndUpperCase(userInput?.password)
    ) {
      divs.forEach((div) => {
        div.className = div.className.replace(/\bcolor-\d+\b/g, "");
        div.classList.add("green");
      });
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [userInput?.password]);

  const [resetPassword, { data, isSuccess, isLoading, isError, error }] =
    useResetPasswordMutation();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { password } = userInput;
    if (password) {
      await resetPassword({
        email,
        password,
        token,
        password_confirmation: password,
      });
    } else {
      toast.error("Password Is required", {
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
  };

  useEffect(() => {
    if (isSuccess && data) {
      navigate("/");
      toast.success("Password successfully reset.")
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
            Enter the new password for your account.
          </h3>
        </div>

        <div className="md:mt-[2vw] mt-[8vw]">
          <h4 className="md:text-[1vw] text-[4vw] mb-1">Password</h4>
          <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
            <button
              type="button"
              className="z-[1] absolute top-[50%] translate-y-[-50%] md:right-[0.5vw] right-[1vw] md:w-[2.2vw] w-[10vw] md:h-[2.2vw] h-[10vw] rounded-[50%] bg-[#EFEFEF] flex justify-center items-center"
            >
              <i
                onClick={() => setShowPassword((prev) => !prev)}
                className={`bx ${
                  showPassword ? "bx-hide" : "bx-show"
                } md:text-[1.5vw] text-[6vw] text-[#2e2e2e] cursor-pointer`}
              ></i>
            </button>
            <input
              type={`${showPassword ? "text" : "password"}`}
              id="password"
              name="password"
              value={userInput?.password || ""}
              onChange={handleUserInput}
              className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              placeholder="password"
            />
          </div>
        </div>
        <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7vw] font-[600]">
          <span className="text-[#ff0404]">Note</span>: Password must be at
          least 8 characters and should include special characters and capital
          letter{" "}
        </h6>
        <div className="flex gap-[1vw] md:mt-[0.5vw] mt-[2vw] justify-center password-val">
          <div className="md:w-[3.5vw] w-[14vw] md:h-[0.55vw] h-[1.5vw] rounded-[1vw] bg-[#f7f7f7]"></div>
          <div className="md:w-[3.5vw] w-[14vw] md:h-[0.55vw] h-[1.5vw] rounded-[1vw] bg-[#f7f7f7]"></div>
          <div className="md:w-[3.5vw] w-[14vw] md:h-[0.55vw] h-[1.5vw] rounded-[1vw] bg-[#f7f7f7]"></div>
          <div className="md:w-[3.5vw] w-[14vw] md:h-[0.55vw] h-[1.5vw] rounded-[1vw] bg-[#f7f7f7]"></div>
          <div className="md:w-[3.5vw] w-[14vw] md:h-[0.55vw] h-[1.5vw] rounded-[1vw] bg-[#f7f7f7]"></div>
          <div className="md:w-[3.5vw] w-[14vw] md:h-[0.55vw] h-[1.5vw] rounded-[1vw] bg-[#f7f7f7]"></div>
        </div>

        <button
          type="submit"
          className="w-full md:py-[0.7vw] py-[3vw] md:mt-[2vw] mt-[5vw] md:text-[0.9vw] text-[3.5vw] text-white md:rounded-[0.3vw] rounded-[1.5vw] bg-[#FF0000] hover:bg-[#ef4242] transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadItems color={"#ffffff"} size={15} />
              <h4>Processing...</h4>
            </div>
          ) : (
            <h4>Reset Password</h4>
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

export default NewPassword;
