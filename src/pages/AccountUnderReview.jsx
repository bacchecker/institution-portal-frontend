import React, { useEffect, useState } from "react";
import IssueTicket from "./accountUnderReviewComponents/IssueTicket";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

function AccountUnderReview() {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const user = JSON?.parse(secureLocalStorage?.getItem("user"));

  return (
    <>
      {user.institution.status === "inactive" ? (
        <>
          <div className="w-full h-[8vw] bg-[#ff0404] relative">
            <div className="bg-[#D9D9D9] absolute-pos-justify-center w-[10vw] h-[10vw] rounded-[50%] mt-[5vw]"></div>
          </div>
          <div className="w-full flex flex-col justify-center mt-[8vw]">
            <h1 className="text-[2vw] font-[600] text-center">
              Account Under Review
            </h1>
            <h4 className="text-[0.9vw] text-center mt-[1vw]">
              Your institution account is currently under review, which usually
              takes 24–28 hours to complete.
            </h4>
            <h4 className="text-[0.9vw] text-center mt-[0.3vw]">
              While we’re working on this, some features may be temporarily
              limited.
            </h4>
            <h4 className="text-[0.9vw] text-center mt-[0.3vw]">
              We’ll update you as soon as the review is finished. Thanks for
              your understanding!
            </h4>
          </div>
          <div className="w-full flex justify-center gap-[1vw] mt-[1vw]">
            <div className="w-[20vw] bg-[#FBFBFB] h-[9vw] rounded-[0.5vw] p-[1vw]">
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
            <div className="w-[20vw] bg-[#FBFBFB] h-[9vw] rounded-[0.5vw] p-[1vw]">
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
            <div className="w-[20vw] bg-[#FBFBFB] h-[9vw] rounded-[0.5vw] p-[1vw]">
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
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-[100vh]">
          <div className="">
            <img src="/assets/img/success.svg" alt="" className="w-[25vw]" />
          </div>
          <div className="">
            <div className="text-center my-2">
              <p className="text-xl font-semibold text-[#ff0404]">
                Your institution profile has been activated
              </p>
            </div>
            <div className="w-full lg:w-[500px] px-2">
              <h4 className="text-justify text-[1vw]">
                You can now proceed to set up your institution account and
                access all available features. We recommend completing the setup
                to take full advantage of our services. If you have any
                questions or need assistance during the setup process, please
                feel free to reach out to our support team. We’re here to help!
                Click on the button below to proceed with setting up your
                account
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
      )}
    </>
  );
}

export default AccountUnderReview;
