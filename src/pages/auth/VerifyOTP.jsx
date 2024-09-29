import React, { Component } from "react";
import axios from "../../axiosConfig";
import { toast } from "react-hot-toast";

class VerifyOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: Array(6).fill(""),
    };
    this.inputRefs = Array(6).fill(null);
  }

  handleChange = (index, e) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const otp = [...this.state.otp];
      otp[index] = value;
      this.setState({ otp }, () => {
        if (index < 5 && value) {
          this.inputRefs[index + 1].focus();
        }
      });
    } else if (value === "") {
      this.clearInput(index);
    }
  };

  clearInput = (index) => {
    const otp = [...this.state.otp];
    otp[index] = "";
    this.setState({ otp }, () => {
      if (index > 0) {
        this.inputRefs[index - 1].focus();
      }
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = this.state.otp.join("");
    try {
      const response = await axios.post("/otp/verify", { otp: otpString });
      const responseData = response.data.data;
      toast.success(response.data.message, {});

      if (responseData.institution.profile_complete == "yes") {
        this.props.navigate("/dashboard", {
          state: {
            institutionData: responseData.institution,
          },
        });
      } else {
        this.props.navigate("/complete-profile", {
          state: {
            institutionData: responseData.institution,
          },
        });
      }
    } catch (error) {
      toast.error(error.response.data.message, {});
    }
  };

  render() {
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
          <form onSubmit={this.handleSubmit}>
            <div className="flex justify-center space-x-2 mb-6">
              {this.state.otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => this.handleChange(index, e)}
                  ref={(ref) => (this.inputRefs[index] = ref)}
                  className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
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
  }
}

export default VerifyOTP;
