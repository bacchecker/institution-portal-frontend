import React, { Component } from "react";
import axios from "../../axiosConfig";
import withRouter from "../../components/withRouter";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { LuEye, LuEyeOff } from "react-icons/lu";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: "",
      password: "",
      passwordError: "",
      recaptcha_token: null,
      showPassword: false,
      account_type: "",
      isLoading: false,
    };
    this.recaptchaRef = React.createRef();
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  onRecaptchaChange = (token) => {
    this.setState({ recaptcha_token: token });
  };

  loginUser = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const { email, password, recaptcha_token } = this.state;

    if (!recaptcha_token) {
      toast.error("Please complete the reCAPTCHA");
      this.setState({ isLoading: false });
      return;
    }

    try {
      const response = await axios.post("/auth/login", {
        email: email,
        password: password,
        recaptcha_token: recaptcha_token,
      });
      const responseData = response.data.data;

      localStorage.setItem("authToken", responseData.token);
      localStorage.setItem("account_type", responseData.user.account_type);
      this.setState({ isLoading: false });

      const account_type = localStorage.getItem("account_type");
      
      if(responseData.institution.status == 'inactive'){
        toast.error('Your account is currently under review by our management team we will revert to you once the review is complete.')
        return
      }

      if (account_type == "institution") {
        toast.success(response.data.message, {});
        if (responseData.two_factor == false) {
          this.props.navigate("/verify-otp");
        }
        if (responseData.institution.profile_complete == "yes") {
          this.props.navigate("/dashboard");
        } else {
          this.props.navigate("/account-profile");
        }
      } else {
        toast.error("Your are not an institution");
        this.setState({ isLoading: false });
      }
    } catch (error) {
      toast.error(error.response.data.message, {});
      this.recaptchaRef.current.reset();
      this.setState({ isLoading: false });
    }
  };

  state = {};
  render() {
    const {
      email,
      password,
      emailError,
      passwordError,
      showPassword,
      isLoading,
    } = this.state;
    return (
      <>
        <div className="h-screen w-full flex justify-center items-center md:px-4 lg:px-0 bg-white md:bg-gray-100">
          <div className="md:w-2/5 lg:w-1/3 2xl:w-1/4 w-full pb-10 md:px-4 lg:px-6 bg-white md:shadow-xl">
            <form className="mt-6">
              <div className="text-center text-yellow-100">
                <div className="flex items-center justify-center mx-auto w-32 h-32">
                  <img src="/images/bclogo.jpg" alt="BacChecker Logo" />
                </div>
              </div>
              <div className="flex flex-col text-center mt-4">
                <p className="font-bold text-gray-700 text-base">Login to your account</p>
                <p className="text-gray-700 text-xs">Access your Institution account by logging in</p>
              </div>
              <div className="relative my-6 mx-5 md:mx-0">
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  className="block rounded-md px-2.5 pb-1 pt-5 pl-10 w-full text-sm text-gray-900 bg-blue-50 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-person w-5 h-5"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                  </svg>
                </div>
                <div className="text-xs text-red-600 italic">{emailError}</div>
                <label
                  htmlFor="floating_filled"
                  className="absolute text-base text-gray-500 duration-300 pl-10 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Email
                </label>
              </div>
              <div className="relative my-6 mx-5 md:mx-0">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                  className="block rounded-md pr-6 pb-1 pt-5 pl-10 w-full text-sm text-gray-900 bg-blue-50 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-lock w-5 h-5"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                  </svg>
                </div>
                <div className="flex absolute inset-y-0 items-center right-0 pr-4">
                  {!showPassword ? (
                    <LuEye size={24} onClick={this.handleClickShowPassword} className="cursor-pointer text-gray-700"/>
                  ) : (
                    <LuEyeOff size={24} onClick={this.handleClickShowPassword} className="cursor-pointer text-gray-700"/>
                  )}
                </div>
                <div className="text-sm text-red-600 italic">
                  {passwordError}
                </div>
                <label
                  htmlFor="floating_filled"
                  className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 pl-10 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Password
                </label>
              </div>
              <div className="px-2 pb-2">
                <ReCAPTCHA
                  sitekey="6LeT50QqAAAAAOjlgT3V74eIOT3DwvtemCjWOM-K"
                  onChange={this.onRecaptchaChange}
                  ref={this.recaptchaRef}
                />
              </div>

              <div className="md:px-0 px-5">
                <button
                  type="submit"
                  onClick={this.loginUser}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center mr-2 ${
                    isLoading
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "hover:bg-buttonLog bg-bChkRed text-white"
                  }  rounded-md py-2.5 md:mb-1 mb-5 ${
                    isLoading ? "cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Spinner size='w-5 h-5 mr-2'/>
                      Logging In...
                    </>
                  ) : (
                    "Log In"
                  )}
                </button>
              </div>
              <p className="text-center text-sm text-gray-600">
                Forgot your Password?{" "}
                <a href="https://backend.baccheck.online/forgot-password" className="text-red-600">
                  Reset
                </a>
              </p>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Login);
