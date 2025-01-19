import React, { useEffect, useRef, useState } from "react";
import LeftDivLoginSignup from "./loginComponents/LeftDivLoginSignup";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../redux/apiSlice";
import { toast } from "sonner";
import LoadItems from "@/components/LoadItems";
import {
  setUser,
  setUserToken,
  setUserPermissions,
  setIsAdmin,
} from "../redux/authSlice";
import ReCAPTCHA from "react-google-recaptcha";
import {
  resetInputValues,
  resetInstitutionInputValues,
  setApplicantCurrentScreen,
  setCurrentRegScreen,
} from "../redux/baccheckerSlice";

function Login() {
  const initialState = {
    email: "",
    password: "",
    remember: false,
  };
  const [showPassword, setShowPassword] = useState(false);
  const [userInput, setUserInput] = useState(initialState);
  const [token, setToken] = useState("");
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { data, isSuccess, isLoading, isError, error }] =
    useLoginUserMutation();

  const handleUserInput = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleCheckChange = (checked) => {
    setUserInput((userInput) => ({
      ...userInput,
      remember: checked,
    }));
  };

  useEffect(() => {
    secureLocalStorage.clear();
    localStorage.clear();
    dispatch(setCurrentRegScreen("accountType"));
    dispatch(setApplicantCurrentScreen(1));
    dispatch(resetInputValues());
    dispatch(resetInstitutionInputValues());
  }, [localStorage, secureLocalStorage, dispatch]);

  const onRecaptchaChange = (token) => {
    if (token) {
      setToken(token);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, remember } = userInput;
    if (!email || !password) {
      toast.error("Credentials Required", {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (!token) {
      toast.error("Validate Recaptcha", {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      await loginUser({
        email,
        password,
        recaptcha_token: token,
        remember: remember,
      });
    }
  };

  useEffect(() => {
    if (!isSuccess || !data) return;

    const user = data?.data?.user;
    const token = data?.data?.token;
    const permissions = data?.data?.permissions.names;
    const subscription = data?.data?.subscription;
    const institution = data?.data?.institution;
    const selectedTemplate = data?.data?.letter_template;
    const isAdmin = data?.data?.isAdmin;

    if (user?.type?.toLowerCase() !== "user") {
      if (token) {
        const twoFactorEnabled = parseInt(user?.two_factor) === 1;
        if (twoFactorEnabled && data?.show_otp) {
          dispatch(
            setUser({
              user,
              two_factor: true,
              institution,
              subscription,
              selectedTemplate,
            })
          );
          dispatch(
            setUserToken({
              token,
            })
          );
          dispatch(
            setUserPermissions({
              permissions,
            })
          );
          dispatch(
            setIsAdmin({
              isAdmin,
            })
          );
          navigate("/2fa-authentication");
        } else {
          switch (institution?.status) {
            case "inactive":
              navigate("/account-under-review");
              break;
            case "active":
              if (data?.data?.institution?.setup_done) {
                navigate("/dashboard");
              } else {
                navigate("/account-setup");
              }
              break;
            default:
              navigate("/account-setup");
          }
          dispatch(
            setUser({
              user,
              two_factor: false,
              institution,
              selectedTemplate,
            })
          );
          dispatch(
            setUserToken({
              token,
            })
          );
          dispatch(
            setUserPermissions({
              permissions,
            })
          );
          dispatch(
            setIsAdmin({
              isAdmin,
            })
          );
        }
      } else {
        toast.error(
          data?.error || "An error occurred while retrieving your data."
        );
      }
    } else {
      toast.error(
        "Access to this dashboard is restricted. Please ensure you have the appropriate permissions to view this content. If you believe this is an error, contact your administrator for assistance. Thank you!"
      );
    }
  }, [isSuccess, data, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
      if (isError || error) {
        recaptchaRef.current.reset();
      }
    }
  }, [error]);
  return (
    <div className="flex w-full h-[100vh]">
      <LeftDivLoginSignup />
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[50%] flex md:mt-[3%] mt-[20%] flex-col md:px-[10vw] px-[5vw]"
      >
        <div className="text-center flex flex-col items-center justify-center ">
          <img
            src="/assets/img/logo.svg"
            alt=""
            className="md:w-[8vw] w-[33vw]"
          />
          <h4 className="md:text-[1.2vw] text-[5vw] md:mt-[1vw!important] mt-[2vw!important] font-[700!important]">
            Login to your account
          </h4>
          <h3 className="md:text-[1.1vw] text-[4vw] md:mt-[1vw!important] mt-[2vw!important] font-[300!important]">
            Access your Bacchecker account by logging in
          </h3>
        </div>

        <div className="md:mt-[2vw] mt-[10vw]">
          <h4 className="md:text-[1vw] text-[4vw] mb-1">Email</h4>
          <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
            <input
              type="email"
              name="email"
              placeholder="e.g example@gmail.com"
              value={userInput.email}
              onChange={handleUserInput}
              className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
            />
          </div>
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
                } text-[#2e2e2e] md:text-[1.5vw] text-[6vw] cursor-pointer`}
              ></i>
            </button>
            <input
              type={`${showPassword ? "text" : "password"}`}
              id="password"
              name="password"
              className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              placeholder="password"
              value={userInput.password}
              onChange={handleUserInput}
            />
          </div>
        </div>
        <div className="flex md:mt-[1vw] mt-[3vw] items-center mb-[0.5vw]">
          <label
            htmlFor="remember"
            className="flex md:text-[1vw] text-[3vw] md:gap-[1vw] gap-[2vw] cursor-pointer items-center"
          >
            <div className="switch">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={userInput?.remember || false}
                onChange={(e) => handleCheckChange(e.target.checked)}
              />
              <span className="slider"></span>
            </div>
            Remember
          </label>
        </div>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6LeT50QqAAAAAOjlgT3V74eIOT3DwvtemCjWOM-K"
          // sitekey="6LdkckYqAAAAAOe_ZxG43sCjXZ_mH6sxopjEzyto"
          onChange={onRecaptchaChange}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:py-[0.7vw] py-[3vw] md:mt-[1.5vw] mt-[5vw] md:text-[0.9vw] text-[3.5vw] text-white md:rounded-[0.3vw] rounded-[1.5vw] bg-[#FF0000] hover:bg-[#ef4242] transition-all duration-300 disabled:bg-[#ef4242]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadItems color={"#ffffff"} size={15} />
              <h4>Processing...</h4>
            </div>
          ) : (
            <h4>Log In</h4>
          )}
        </button>
        <div className="w-full text-center">
          <h4 className="md:text-[1vw] text-[3.5vw] md:my-[1vw!important] my-[3vw!important]">
            Don’t have an account?
            <Link
              to="https://client-dev.baccheck.online/sign-up"
              className="text-[#ff0404] ml-[0.2rem]"
            >
              <span className="text-[#ff0000] ml-[0.5vw]">Sign Up</span>
            </Link>
          </h4>
          <h3 className="md:text-[1vw] text-[3.5vw]">
            Forgot your password?
            <Link to="/reset-password">
              <span className="text-[#ff0000] ml-[0.5vw]">Reset</span>
            </Link>
          </h3>
        </div>
      </form>
    </div>
  );
}

export default Login;
