import React, { Component } from "react";
import axios from "../../axiosConfig";
import withRouter from "../../components/withRouter";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";
import { IoLockOpen, IoPerson, IoEyeOff, IoEye } from "react-icons/io5";
import { Button, Card, Input } from "@nextui-org/react";
import ThemeSwitcher from "../../components/ThemeSwitcher";

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
      type: "",
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
      const response = await axios.post("/auth/institutionLogin", {
        email: email,
        password: password,
        recaptcha_token: recaptcha_token,
      });
      const responseData = response.data.data;

      localStorage.setItem("authToken", responseData.token);
      localStorage.setItem("type", responseData.user.type);
      this.setState({ isLoading: false });

      const type = localStorage.getItem("type");

      if (responseData.institution.status == "inactive") {
        this.props.navigate("/account-inactive");

        return;
      }

      if (type == "institution") {
        toast.success(response.data.message, {});
        if (responseData.two_factor == false) {
          this.props.navigate("/verify-otp");
        }
        if (responseData.institution.profile_complete == "yes") {
          this.props.navigate("/dashboard");
        } else {
          this.props.navigate("/account-setup/profile");
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
                value={email}
                className="mt-1 block w-full"
                autoComplete="email"
                autoFocus
                onChange={(e) => this.setState({ email: e.target.value })}
                startContent={<IoPerson />}
                isInvalid={emailError}
                errorMessage={emailError}
              />

              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                label="Password"
                className="mt-1 block w-full"
                onChange={(e) => this.setState({ password: e.target.value })}
                startContent={<IoLockOpen />}
                isInvalid={emailError}
                errorMessage={emailError}
                endContent={
                  !showPassword ? (
                    <IoEye
                      size={24}
                      onClick={this.handleClickShowPassword}
                      className="cursor-pointer"
                    />
                  ) : (
                    <IoEyeOff
                      size={24}
                      onClick={this.handleClickShowPassword}
                      className="cursor-pointer"
                    />
                  )
                }
              />

              <div className="flex ">
                <ReCAPTCHA
                  sitekey="6LeT50QqAAAAAOjlgT3V74eIOT3DwvtemCjWOM-K"
                  onChange={this.onRecaptchaChange}
                  ref={this.recaptchaRef}
                  className="mx-auto"
                />
              </div>

              <Button
                color="danger"
                onClick={this.loginUser}
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
  }
}

export default withRouter(Login);
