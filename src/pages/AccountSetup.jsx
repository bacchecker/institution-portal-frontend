import React, { useState, useEffect } from "react";
import InstitutionDataSetup from "./accountSetupComponents/InstitutionDataSetup";
import InstitutionDocumentTypes from "./accountSetupComponents/InstitutionDocumentTypes";
import InstitutionDepartments from "./accountSetupComponents/InstitutionDepartments";
import InstitutionPortalUsers from "./accountSetupComponents/InstitutionPortalUsers";
import IssueTicket from "./accountUnderReviewComponents/IssueTicket";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import { useCompleteAccountSetupMutation } from "../redux/apiSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

function AccountSetup() {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON?.parse(secureLocalStorage?.getItem("user"));
  const [activeStep, setActiveStep] = useState(
    user?.institution?.current_step || "1"
  );
  const [isCompleting, setIsCompleting] = useState(false);
  const [completeSetup, { isLoading }] = useCompleteAccountSetupMutation();

  // Update activeStep when current_step changes in local storage, but only if not completing
  useEffect(() => {
    if (!isCompleting) {
      const currentStep = user?.institution?.current_step;
      if (currentStep && currentStep !== activeStep) {
        setActiveStep(currentStep);
      }
    }
  }, [user?.institution?.current_step, isCompleting]);

  const handleCompleteSetup = async () => {
    try {
      setIsCompleting(true);
      // Optimistically update the step to prevent flickering
      setActiveStep("5");
      await completeSetup().unwrap();
      
      // Update local storage immediately
      const updatedUser = {
        ...user,
        institution: {
          ...user.institution,
          setup_done: true,
          current_step: "5",
        },
      };
      secureLocalStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Navigate after a short delay to ensure state is updated
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 500);
    } catch (err) {
      // Revert the step if there's an error
      setActiveStep("4");
      setIsCompleting(false);
      console.error("Failed to complete setup:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to complete setup. Please try again or contact support.",
        icon: "error",
        confirmButtonColor: "#FF0404",
      });
    }
  };

  // Determine if we should show the completion modal
  const showCompletionModal =
    isCompleting || activeStep === "5" || user?.institution?.setup_done;
  // console.log({
  //   activeStep,
  //   showCompletionModal,
  // });

  return (
    <>
      <div className="w-full bg-[#f8f8f8] px-[4vw] py-[0.5vw] fixed top-0 z-[29]">
        <div className="flex items-center">
          <img src="/assets/img/logo1.svg" alt="" className="w-[2vw]" />
          <h4 className="text-[1.2vw] font-[600] text-[#000]">
            Bac<span className="text-[#ff0404]">C</span>hecker
          </h4>
        </div>
      </div>
      {parseInt(activeStep) !== 5 && (
        <div className="bg-[#f8f8f8] w-[25%] fixed top-[3.5vw] right-0 h-[100vh] p-[1vw]">
          <div className="w-fit h-fit flex flex-col">
            <div className="w-full  md:h-[3vw] h-[10vw] flex items-center">
              <div className="md:w-[3vw] w-[10vw] h-fit flex justify-center">
                <img
                  src={`${
                    parseInt(activeStep) === 1
                      ? "/assets/img/complete2.svg"
                      : parseInt(activeStep) === 2 ||
                        parseInt(activeStep) === 3 ||
                        parseInt(activeStep) === 4
                      ? "/assets/img/complete1.svg"
                      : "/assets/img/complete.svg"
                  }`}
                  className="w-[1.5vw]"
                />
              </div>
              <h4
                className={`text-[0.9vw] font-[600]  ${
                  parseInt(activeStep) === 1
                    ? "text-[#ff0404]"
                    : parseInt(activeStep) === 2 ||
                      parseInt(activeStep) === 3 ||
                      parseInt(activeStep) === 4
                    ? "text-[#04a604]"
                    : "text-[#5F6368]"
                }`}
              >
                Institution Data
              </h4>
            </div>
            <div className="flex">
              <div className="md:w-[3vw] w-[10vw] h-fit flex justify-center">
                <div
                  className={`md:h-[4vw] h-[20vw] w-[1px]  border ${
                    parseInt(activeStep) === 1
                      ? "border-[#ff0404]"
                      : parseInt(activeStep) === 2 ||
                        parseInt(activeStep) === 3 ||
                        parseInt(activeStep) === 4
                      ? "border-[#04a604]"
                      : "border-[#5F6368]"
                  }`}
                ></div>
              </div>
              <h4 className="text-[0.8vw]">
                Provide essential details about <br /> your institution.
              </h4>
            </div>
          </div>
          <div className="w-fit h-fit flex flex-col">
            <div className="w-full  md:h-[3vw] h-[10vw] flex items-center">
              <div className="md:w-[3vw] w-[10vw] h-fit flex justify-center">
                <img
                  src={`${
                    parseInt(activeStep) === 2
                      ? "/assets/img/complete2.svg"
                      : parseInt(activeStep) === 3 || parseInt(activeStep) === 4
                      ? "/assets/img/complete1.svg"
                      : "/assets/img/complete.svg"
                  }`}
                  className="w-[1.5vw]"
                />
              </div>
              <h4
                className={`text-[0.9vw] font-[600]  ${
                  parseInt(activeStep) === 2
                    ? "text-[#ff0404]"
                    : parseInt(activeStep) === 3 || parseInt(activeStep) === 4
                    ? "text-[#04a604]"
                    : "text-[#5F6368]"
                }`}
              >
                Institution Document Types
              </h4>
            </div>
            <div className="flex">
              <div className="md:w-[3vw] w-[10vw] h-fit flex justify-center">
                <div
                  className={`md:h-[4vw] h-[20vw] w-[1px] border  ${
                    parseInt(activeStep) === 2
                      ? "border-[#ff0404]"
                      : parseInt(activeStep) === 3 || parseInt(activeStep) === 4
                      ? "border-[#04a604]"
                      : "border-[#5F6368]"
                  }`}
                ></div>
              </div>
              <h4 className="text-[0.8vw]">
                Submit required documents and review <br />
                your information for accuracy.
              </h4>
            </div>
          </div>
          <div className="w-fit h-fit flex flex-col">
            <div className="w-full  md:h-[3vw] h-[10vw] flex items-center">
              <div className="md:w-[3vw] w-[10vw] h-fit flex justify-center">
                <img
                  src={`${
                    parseInt(activeStep) === 3
                      ? "/assets/img/complete2.svg"
                      : parseInt(activeStep) === 4
                      ? "/assets/img/complete1.svg"
                      : "/assets/img/complete.svg"
                  }`}
                  className="w-[1.5vw]"
                />
              </div>
              <h4
                className={`text-[0.9vw] font-[600] ${
                  parseInt(activeStep) === 3
                    ? "text-[#ff0404]"
                    : parseInt(activeStep) === 4
                    ? "text-[#04a604]"
                    : "text-[#5F6368]"
                }`}
              >
                Institution Departments
              </h4>
            </div>
            <div className="flex">
              <div className="md:w-[3vw] w-[10vw] h-fit flex justify-center">
                <div
                  className={`md:h-[4vw] h-[20vw] w-[1px]  border ${
                    parseInt(activeStep) === 3
                      ? "border-[#ff0404]"
                      : parseInt(activeStep) === 4
                      ? "border-[#04a604]"
                      : "border-[#5F6368]"
                  }`}
                ></div>
              </div>
              <h4 className="text-[0.8vw]">
                Personalize your portal and organize <br /> team roles.
              </h4>
            </div>
          </div>
          <div className="w-fit h-fit flex flex-col">
            <div className="w-full  md:h-[3vw] h-[10vw] flex items-center">
              <div className="md:w-[3vw] w-[10vw] h-fit flex justify-center">
                <img
                  src={`${
                    parseInt(activeStep) === 4
                      ? "/assets/img/complete2.svg"
                      : "/assets/img/complete.svg"
                  }`}
                  className="w-[1.5vw]"
                />
              </div>
              <h4
                className={`text-[0.9vw] font-[600] ${
                  parseInt(activeStep) === 4
                    ? "text-[#ff0404]"
                    : "text-[#5F6368]"
                }`}
              >
                Institution Portal Users
              </h4>
            </div>
            <div className="flex">
              <div className="md:w-[3vw] w-[10vw] h-fit flex justify-center">
                <div className="md:h-[2vw] h-[20vw] w-[1px]  border border-[#f8f8f8]"></div>
              </div>
              <h4 className="text-[0.8vw]">
                Add users to various departments <br /> and manage their roles.
              </h4>
            </div>
          </div>
          <div className="flex flex-col mt-[3vw] gap-[0.4vw]">
            <img src="/assets/img/person1.svg" alt="" className="w-[2.5vw]" />
            <h4 className="text-[0.9vw]">Having trouble?</h4>
            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className=" bg-[#FF0404] w-fit md:mt-0 mt-[3vw] flex justify-center items-center md:py-[0.7vw] py-[2vw] md:px-[1.5vw] px-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300"
            >
              <h4 className="md:text-[0.9vw] text-[3.5vw] text-[#ffffff]">
                Issue Ticket
              </h4>
            </button>
            <h4 className="text-[0.9vw]">
              Or email us on{" "}
              <a
                href="mailto:info@bacchecker.online"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#ff0404]"
              >
                info@bacchecker.online
              </a>{" "}
              and we will always help you through the process
            </h4>
          </div>
        </div>
      )}
      {parseInt(activeStep) === 1 && (
        <InstitutionDataSetup setActiveStep={(e) => setActiveStep(e)} />
      )}
      {parseInt(activeStep) === 2 && (
        <InstitutionDocumentTypes setActiveStep={(e) => setActiveStep(e)} />
      )}
      {parseInt(activeStep) === 3 && (
        <InstitutionDepartments setActiveStep={(e) => setActiveStep(e)} />
      )}
      {parseInt(activeStep) === 4 && (
        <InstitutionPortalUsers setActiveStep={(e) => setActiveStep(e)} />
      )}

      <div
        className={`fixed  bg-[#000000dd] z-[30] flex items-center justify-center transition-all duration-300 w-[100vw] h-[100vh] ${
          showCompletionModal
            ? "top-0 left-0 right-0 bottom-0"
            : "top-0 left-[100vw] right-0"
        }`}
      >
        <div className="w-[40vw] bg-[#ffffff] rounded-[0.2vw]">
          <div className="w-full h-[20vw]">
            <img
              src="/assets/img/success.svg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="px-[2vw]">
            <h4 className="text-[1.6vw] font-[700] text-center">
              Congratulations!
            </h4>
            <h4 className="text-[1vw] text-center">
              <span className="font-[500] text-[#ff0404]">
                Your institution account setup is now complete. <br />
              </span>
              Welcome to BacChecker! Your account is ready to use, and you can
              start managing your institution's processes seamlessly. Your
              account is all set up and ready to go.
            </h4>
          </div>
          <div className="w-full border-t px-[4vw]">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleCompleteSetup}
              className="bg-[#FF0404] md:my-[2vw!important] my-[4vw!important] w-full flex justify-center items-center md:py-[0.7vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#fa6767]"
            >
              <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                {isLoading ? "Please wait..." : "Continue to Dashboard"}
              </h4>
            </button>
          </div>
        </div>
      </div>
      {/* </div> */}
      <IssueTicket setOpenModal={setOpenModal} openModal={openModal} />
    </>
  );
}

export default AccountSetup;
