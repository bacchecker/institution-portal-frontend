import React, { Component, useRef, useState } from "react";
import axios from "@utils/axiosConfig";
import withRouter from "@components/withRouter";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";
import { IoLockOpen, IoPerson, IoEyeOff, IoEye } from "react-icons/io5";
import { Button, Card, Input } from "@nextui-org/react";
import ThemeSwitcher from "@components/ThemeSwitcher";
import { Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "@store/authStore";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaRef = useRef();
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuthStore();

  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

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
        recaptcha_token: recaptchaToken,
      });
      let responseData = response.data;

      if (responseData?.show_otp) {
        navigate("/verify-otp");
      }

      console.log(response.data);
      responseData = response.data?.data;

      localStorage.setItem("authToken", responseData.token);
      localStorage.setItem("type", responseData.user.type);
      setIsLoading(false);

      const type = localStorage.getItem("type");

      login(responseData.user, responseData?.institution, responseData.token);

      // if (responseData.institution.status === "inactive") {
      //   navigate("/account-inactive");
      //   return;
      // }

      if (type === "institution") {
        toast.success(response.data.message, {});
        if (responseData.institution.profile_complete === "yes") {
          navigate("/dashboard");
        } else {
          navigate("/account-setup/profile");
        }
      } else {
        toast.error("You are not an institution");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error?.response);
      toast.error(error.response.data.message, {});
      recaptchaRef.current.reset();
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <div className="h-screen w-full flex flex-col justify-center items-center md:px-4 lg:px-0 dark:bg-slate-950">
        <ThemeSwitcher />
        <Card className="md:w-2/5 lg:w-1/3 2xl:w-1/4 w-full pb-10 md:px-4 lg:px-6 dark:bg-slate-900 md:shadow-xl">
          <form className="mt-6 flex flex-col gap-5">
            <div className="text-center text-yellow-100">
              <div className="flex items-center justify-center mx-auto w-32 h-32">
                <img src="/images/bclogo.jpg" alt="BacChecker Logo" />
              </div>
            </div>
            <div className="flex flex-col text-center mt-4">
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

            <div className="flex ">
              <ReCAPTCHA
                sitekey="6LeT50QqAAAAAOjlgT3V74eIOT3DwvtemCjWOM-K"
                onChange={onRecaptchaChange}
                ref={recaptchaRef}
                className="mx-auto"
              />
            </div>

            <Button
              color="danger"
              onClick={loginUser}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Login
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-white">
              Forgot your Password?{" "}
              <a
                href="https://backend.baccheck.online/forgot-password"
                className="text-red-600"
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
