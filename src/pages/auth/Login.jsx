import React, { Component, useEffect, useRef, useState } from "react";
import axios from "@utils/axiosConfig";
import withRouter from "@components/withRouter";
import ReCAPTCHA from "react-google-recaptcha";
import { IoLockOpen, IoPerson, IoEyeOff, IoEye } from "react-icons/io5";
import { Button, Card, Input, Spinner, Switch } from "@nextui-org/react";
import ThemeSwitcher from "@components/ThemeSwitcher";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@store/authStore";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [isSelected, setIsSelected] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaRef = useRef();
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuthStore();


  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  useEffect(() => {
    secureLocalStorage.clear();
  }, []);

  const loginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
        remember: isSelected,
        recaptcha_token: recaptchaToken,
      });
      let responseData = response.data.data;

      secureLocalStorage.setItem("authToken", responseData.token);
      secureLocalStorage.setItem("user", responseData.user);
      secureLocalStorage.setItem("institution", responseData.institution);
      secureLocalStorage.setItem(
        "selectedTemplate",
        responseData.letter_template
      );
      setIsLoading(false);

      login(responseData.user, responseData.institution, responseData.token);

      if (responseData.user.type === "institution") {
        // Check if OTP verification is required
        if (response.data?.show_otp === true) {
          navigate("/verify-otp");
          toast.success(response.data.message);
          return; // Stop further execution if OTP verification is required
        }

        // Check if the institution is inactive
        if (responseData.institution.status === "inactive") {
          navigate("/account-inactive");
          return; // Stop further execution if account is inactive
        }

        // Check if account setup is done
        if (responseData.institution.setup_done) {
          navigate("/dashboard");
        } else {
          navigate("/account-setup");
        }

        toast.success(response.data.message);
      } else {
        toast.error("You are not an institution");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      recaptchaRef.current.reset();
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen w-full flex flex-col justify-center items-center md:px-4 lg:px-0 dark:bg-slate-950">
        <ThemeSwitcher />
        <Card className="md:w-2/5 lg:w-1/3 2xl:w-1/4 w-full pb-10 md:px-4 lg:px-6 dark:bg-slate-900 md:shadow-xl">
          <form className="mt-6 flex flex-col gap-5 px-2">
            <div className="text-center text-yellow-100">
              <div className="flex items-center justify-center mx-auto w-32 h-32">
                <img src="/images/bclogo.jpg" alt="BacChecker Logo" />
              </div>
            </div>
            <div className="flex flex-col text-center">
              <p className="font-bold text-gray-700 dark:text-white text-base">
                Login to your account
              </p>
              <p className="text-gray-700 dark:text-white text-xs">
                Access your Institution account by logging in
              </p>
            </div>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              className="mt-1 block w-full"
              autoComplete="email"
              autoFocus
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              startContent={<IoPerson />}
              isInvalid={formErrors.email}
              errorMessage={formErrors.email}
            />

            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              label="Password"
              className="mt-1 block w-full"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              startContent={<IoLockOpen />}
              isInvalid={formErrors.password}
              errorMessage={formErrors.password}
              endContent={
                !showPassword ? (
                  <IoEye
                    size={24}
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                ) : (
                  <IoEyeOff
                    size={24}
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                )
              }
            />
            <div className="flex flex-col gap-2">
              <Switch
                size="sm"
                isSelected={isSelected}
                onValueChange={setIsSelected}
                color="danger"
              >
                Remember me
              </Switch>
            </div>

            <div className="flex">
              <ReCAPTCHA
                sitekey="6LeT50QqAAAAAOjlgT3V74eIOT3DwvtemCjWOM-K"
                onChange={onRecaptchaChange}
                ref={recaptchaRef}
                className="mx-auto h-16"
              />
            </div>

            <button
              className={`mt-1 w-full flex items-center justify-center bg-[#ff0404] hover:bg-[#fa4848] text-white px-4 py-2 rounded-md font-medium ${
                isLoading && "cursor-not-allowed bg-[#fa4848]"
              }`}
              onClick={loginUser}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" color="white" />
                  <h4>Processing...</h4>
                </div>
              ) : (
                <h4>Login</h4>
              )}
            </button>
            <p className="text-center text-sm text-gray-600 dark:text-white">
              Don’t have an account?
              <a
                href="https://portal.baccheck.online/sign-up"
                className="text-[#ff0404] ml-[0.2rem]"
              >
                Sign Up
              </a>
            </p>
            <p className="text-center text-sm text-gray-600 dark:text-white">
              Forgot your Password?
              <a
                href="https://backend.baccheck.online/forgot-password"
                className="text-[#ff0404] ml-[0.2rem]"
              >
                Reset
              </a>
            </p>
          </form>
        </Card>
      </div>
    </>
  );
};

export default withRouter(Login);
