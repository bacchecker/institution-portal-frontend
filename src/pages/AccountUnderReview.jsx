import React, { useEffect, useState } from "react";
import IssueTicket from "./accountUnderReviewComponents/IssueTicket";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { setUser } from "../redux/authSlice";
import { useDispatch } from "react-redux";

function AccountUnderReview() {
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON?.parse(secureLocalStorage?.getItem("user"));
  const token = JSON?.parse(secureLocalStorage?.getItem("userToken"))?.token;
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  window.Pusher = Pusher;
  window.Echo = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    // wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    // wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    forceTLS: false,
    auth: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    enabledTransports: ["ws", "wss"],
  });

  window.Echo.connector.pusher.connection.bind("error", (error) => {
    console.error("WebSocket connection error:", error);
  });

  // TO DO Private Implementation Later

  useEffect(() => {
    if (user?.institution?.id) {
      window.Echo.channel(`institution.${user?.institution?.id}`).listen(
        "InstitutionActivatedEvent",
        (event) => {
          setMessage(event?.institution);
          if (event?.institution) {
            dispatch(
              setUser({
                user: user?.user,
                two_factor: user.two_factor,
                institution: event?.institution,
                selectedTemplate: user.selectedTemplate,
              })
            );
          }
        }
      );
    }
  }, [user?.institution?.id]);

  return (
    <>
      {message && message?.status === "active" ? (
        <div className="flex flex-col justify-center items-center w-full h-[100vh]">
          <div className="">
            <img src="/assets/img/success.svg" alt="" className="w-[25vw]" />
          </div>
          <div className="">
            <div className="w-full lg:w-[500px] px-2">
              <h4 className="text-justify text-[1vw]">
                <span className="font-[600]">
                  Dear {user?.user?.first_name} {user?.user?.other_name}{" "}
                  {user?.user?.last_name}
                </span>
                , Congratulations! Your institution’s profile has been
                successfully activated. You can now proceed to set up your
                institution account and access all available features. To
                maximize your experience with BacChecker, we recommend
                completing the account setup process promptly. Should you need
                any assistance, our support team is ready to help at any time.
                <span className="text-[#FF0404]">
                  {" "}
                  Click the button below to begin your setup.
                </span>
              </h4>
            </div>
          </div>
          <div className="my-4 flex items-center justify-center">
            <button
              type="button"
              onClick={() => navigate("/account-setup")}
              className=" bg-[#FF0404] w-fit md:mt-0 mt-[3vw] flex justify-center items-center md:py-[0.6vw] py-[2vw] md:px-[1.5vw] px-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300"
            >
              {/* <img src="/assets/img/tickets.svg" alt="" /> */}
              <h4 className="md:text-[0.9vw] text-[3.5vw] text-[#ffffff]">
                Continue to account setup
              </h4>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full h-[8vw] bg-[#ff0404] relative">
            <div className="bg-[#e3e3e3] absolute-pos-justify-center w-[10vw] h-[10vw] rounded-[50%] mt-[5vw] flex justify-center items-center">
              <i class="bx bx-file-find text-[4vw] text-[#ff0404]"></i>
            </div>
          </div>
          <div className="flex flex-col justify-center mt-[8vw]">
            <h1 className="text-[2vw] font-[600] text-center">
              Account Under Review
            </h1>
            <h4 className="text-[0.9vw] text-center mt-[1vw]">
              <span className="font-[600]">
                Dear {user?.user?.first_name} {user?.user?.other_name}{" "}
                {user?.user?.last_name}
              </span>
              , <br />
              Thank you for signing up with BacChecker! Your institution’s
              account is currently under review, which typically takes 24–48
              hours to complete.
            </h4>
            <h4 className="text-[0.9vw] text-center mt-[0.3vw]">
              During this time, some features may be temporarily limited. We’ll
              notify you as soon as the review is finalized.
            </h4>
            <h4 className="text-[0.9vw] text-center mt-[0.3vw]">
              If you have any questions, our support team is here to assist.
              Thank you for your patience and understanding!
            </h4>
          </div>
          <div className="w-full flex justify-center gap-[1vw] mt-[1vw]">
            <div
              className={`w-[20vw] bg-[#FBFBFB] h-[9vw] rounded-[0.5vw] p-[1vw] ${
                activeFeature === 0
                  ? "scale-105 shadow-lg shadow-[#ff0404]/20 border border-[#ff04044c]"
                  : "scale-100"
              }`}
            >
              <div className="flex items-center gap-[0.5vw]">
                <div className="w-[2.5vw] h-[2.5vw] rounded-[50%] bg-[#ff0404] flex items-center justify-center">
                  <img
                    src="/assets/img/document1.svg"
                    alt=""
                    className="w-[1.3vw]"
                  />
                </div>
                <h4 className="text-[0.9vw] font-[600]">
                  Document Requisition
                </h4>
              </div>
              <h4 className="text-[0.8vw] ml-[3vw]">
                Process and submit requested documents to applicant in their
                preferred format (soft copy or hard copy).
              </h4>
            </div>
            <div
              className={`w-[20vw] bg-[#FBFBFB] h-[9vw] rounded-[0.5vw] p-[1vw] ${
                activeFeature === 1
                  ? "scale-105 shadow-lg shadow-[#ff0404]/20 border border-[#ff04044c]"
                  : "scale-100"
              }`}
            >
              <div className="flex items-center gap-[0.5vw]">
                <div className="w-[2.5vw] h-[2.5vw] rounded-[50%] bg-[#ff0404] flex items-center justify-center">
                  <img
                    src="/assets/img/documentV.svg"
                    alt=""
                    className="w-[1.3vw]"
                  />
                </div>
                <h4 className="text-[0.9vw] font-[600]">Document Validation</h4>
              </div>
              <h4 className="text-[0.8vw] ml-[3vw]">
                Validate documents received from applicant to ensure
                authenticity and completeness
              </h4>
            </div>
            <div
              className={`w-[20vw] bg-[#FBFBFB] h-[9vw] rounded-[0.5vw] p-[1vw] ${
                activeFeature === 2
                  ? "scale-105 shadow-lg shadow-[#ff0404]/20 border border-[#ff04044c]"
                  : "scale-100"
              }`}
            >
              <div className="flex items-center gap-[0.5vw]">
                <div className="w-[2.5vw] h-[2.5vw] rounded-[50%] bg-[#ff0404] flex items-center justify-center">
                  <img
                    src="/assets/img/documentVe.svg"
                    alt=""
                    className="w-[1.3vw]"
                  />
                </div>
                <h4 className="text-[0.9vw] font-[600]">
                  Document Verification
                </h4>
              </div>
              <h4 className="text-[0.8vw] ml-[3vw]">
                Verify the accuracy and legitimacy of submitted documents
                through our comprehensive verification process.
              </h4>
            </div>
          </div>
          <div className="w-full flex flex-col justify-center gap-[1vw] items-center mt-[1vw]">
            <h4 className="text-center">
              Need assistance? Our Support Team is here to help!
            </h4>
            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className=" bg-[#FF0404] w-fit md:mt-0 mt-[3vw] flex justify-center items-center md:py-[0.6vw] py-[2vw] md:px-[1.5vw] px-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300"
            >
              <img src="/assets/img/tickets.svg" alt="" />
              <h4 className="md:text-[0.9vw] text-[3.5vw] text-[#ffffff]">
                Issue Ticket
              </h4>
            </button>
            <div className="flex items-center gap-[1vw]">
              <div className="flex items-center gap-[0.2vw]">
                <img
                  src="/assets/img/fe_phone.svg"
                  alt=""
                  className="w-[1.2vw]"
                />
                <h4 className="text-[0.9vw]">0(303)856478996</h4>
              </div>

              <a
                target="blank"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@bacchecker.online"
                className="flex items-center gap-[0.2vw]"
              >
                <img
                  src="/assets/img/iconoir_mail.svg"
                  alt=""
                  className="w-[1.2vw]"
                />
                <h4 className="text-[0.9vw]">info@bacchecker.online</h4>
              </a>
            </div>
          </div>
          <IssueTicket setOpenModal={setOpenModal} openModal={openModal} />
        </>
      )}
    </>
  );
}

export default AccountUnderReview;
