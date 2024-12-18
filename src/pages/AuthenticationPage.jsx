import React, { useEffect, useState } from "react";
import OtpField from "react-otp-field";
import LoadItems from "@/components/LoadItems";
import secureLocalStorage from "react-secure-storage";
import { useResendOTPMutation, useVerifyOTPMutation } from "../redux/apiSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setUserToken } from "../redux/authSlice";
import Swal from "sweetalert2";

function AuthenticationPage() {
  const [otpCode, setOTPCode] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON?.parse(secureLocalStorage?.getItem("userToken"))?.token;

  const [verifyOTP, { data, isSuccess, isLoading, isError, error }] =
    useVerifyOTPMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpCode) {
      await verifyOTP({ otp: otpCode });
    } else {
      toast.error("Otp is required", {
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
      if (data?.data) {
        dispatch(
          setUser({
            user: data?.data?.user,
            two_factor: false,
            institution: data?.data?.institution,
            selectedTemplate: data?.data?.selectedTemplate,
          })
        );
        dispatch(
          setUserToken({
            token: data?.data?.token,
          })
        );
        Swal.fire({
          title: "Success",
          text: "2fa authentication done successfully",
          icon: "success",
          button: "OK",
          confirmButtonColor: "#ff0404",
        }).then((isOkay) => {
          if (isOkay) {
            switch (data?.data?.institution?.status) {
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
          }
        });
      }
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  const [
    resendOTP,
    {
      data: resendData,
      isSuccess: isResendSuccess,
      isLoading: isResendLoading,
      isError: isResendError,
      error: resendError,
    },
  ] = useResendOTPMutation();

  const handleResendOTP = async () => {
    await resendOTP({ token });
  };

  useEffect(() => {
    if (isResendSuccess && resendData) {
      toast.success(resendData?.message, {
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
  }, [isResendSuccess, resendData]);

  useEffect(() => {
    if (resendError) {
      toast.error(resendError?.data?.message);
    }
  }, [resendError]);

  return (
    <>
      <div className="w-full md:w-[70vw] bg-[#000000] md:rounded-[0.7vw] rounded-[1.5vw] md:mt-[1vw] mt-[2vw] md:p-[1vw] px-[3vw] pb-[2vw] pt-[2vw]">
        <div className="flex justify-between items-center">
          <h4 className="text-[#ffffff] md:text-[1vw] text-[3vw]">
            2FA Authentication (OTP) RECOMMENDED
          </h4>
          {/* <button>
            <i className="bx bx-x text-[#fff] md:text-[1.5vw] text-[4vw]"></i>
          </button> */}
        </div>
        <div className="flex md:items-center flex-text">
          <img
            src="/assets/img/hand.svg"
            alt=""
            className="md:w-[8vw] w-[15vw]"
          />
          <div>
            <h4 className="text-[#ffffff] md:text-[0.9vw] text-[3vw]">
              As we are constantly improving privacy, security and integrity,{" "}
              <span className="font-[600]">Bacchecker</span> establishes OTP -
              One-Time-Password
              <br />
              Password providing the option to use one-time passwords generated
              by <span className="font-[600]">Bacchecker</span> to your account.{" "}
              <br />
            </h4>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="md:px-[1vw] px-[5vw] w-full overflow-auto md:w-[30vw]"
      >
        <div className="w-full md:mt-[3vw] mt-[8vw] flex items-center justify-center flex-col gap-[0.5vw]">
          <div className="md:w-[6vw] w-[20vw]">
            <img
              src="/assets/img/message.svg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="md:text-[1vw] text-[3.5vw]">
            Please enter the <span className="text-[#ff0404]">6</span> digits
            code sent to <span className="text-[#ff0404]">email</span>
          </h4>
        </div>
        <div className="md:mt-[2vw] mt-[8vw] flex justify-center items-center md:gap-[2vw] gap-[4vw]">
          <OtpField
            value={otpCode}
            onChange={setOTPCode}
            numInputs={6}
            regex={/^([0-9]{0,})$/}
            isTypeNumber
            inputProps={{
              className:
                "otp-input text-[#ff0000] text-center md:w-[3vw] w-[10vw] md:h-[3vw] h-[10vw] md:text-[1.1vw] text-[5vw] focus:outline-none border-2 bg-[#E9E9E9] border-[#E5E5E5] md:rounded-[0.3vw] rounded-[1vw]",
              disabled: false,
            }}
          />
        </div>

        <button
          type="submit"
          className="bg-[#FF0404] md:my-[2vw!important] my-[6vw!important] w-full flex justify-center items-center md:py-[0.7vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[1vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300"
        >
          <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadItems color={"#ffffff"} size={15} />
                <h4>Submitting...</h4>
              </div>
            ) : (
              <h4>Submit</h4>
            )}
          </h4>
        </button>
        <div className="w-full text-center">
          <h4 className="md:text-[1vw] text-[3.5vw] md:my-[1vw!important] my-[3vw!important] flex items-center">
            Didn't receive an email ?
            <button
              onClick={handleResendOTP}
              type="button"
              className="text-[#ff0000] ml-[1vw]"
            >
              {isResendLoading ? (
                <div className="flex items-center justify-center gap-[0.5vw]">
                  <LoadItems color={"#ff0404"} size={10} />
                  <h4>Resending...</h4>
                </div>
              ) : (
                <h4>Resend</h4>
              )}
            </button>
          </h4>
        </div>
      </form>
    </>
  );
}

export default AuthenticationPage;
