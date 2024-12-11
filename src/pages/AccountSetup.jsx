import React, { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import InstitutionDataSetup from "./accountSetupComponents/InstitutionDataSetup";
import InstitutionDocumentTypes from "./accountSetupComponents/InstitutionDocumentTypes";
import InstitutionDepartments from "./accountSetupComponents/InstitutionDepartments";
import InstitutionPortalUsers from "./accountSetupComponents/InstitutionPortalUsers";

function AccountSetup() {
  const [activeStep, setActiveStep] = useState();
  const current_step = JSON?.parse(secureLocalStorage?.getItem("user"))
    ?.institution?.current_step;

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
      <div className="bg-[#f8f8f8] w-[25%] fixed top-[3.5vw] right-0 h-[100vh] p-[1vw]">
        <div className="w-fit h-fit flex flex-col">
          <div className="w-full  md:h-[3vw] h-[10vw] flex items-center">
            <div className="md:w-[3vw] w-[10vw] h-fit flex justify-center">
              <img
                src={`${
                  parseInt(current_step) === 1 ||
                  (activeStep && activeStep === 1) ||
                  parseInt(current_step) === 2 ||
                  (activeStep && activeStep === 2) ||
                  parseInt(current_step) === 3 ||
                  (activeStep && activeStep === 3) ||
                  parseInt(current_step) === 4 ||
                  activeStep === 4
                    ? "/assets/img/complete1.svg"
                    : "/assets/img/complete.svg"
                }`}
                className="w-[1.5vw]"
              />
            </div>
            <h4
              className={`text-[0.9vw] font-[600]  ${
                parseInt(current_step) === 1 ||
                (activeStep && activeStep === 1) ||
                parseInt(current_step) === 2 ||
                (activeStep && activeStep === 2) ||
                parseInt(current_step) === 3 ||
                (activeStep && activeStep === 3) ||
                parseInt(current_step) === 4 ||
                activeStep === 4
                  ? "text-[#ff0404]"
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
                  parseInt(current_step) === 1 ||
                  (activeStep && activeStep === 1) ||
                  parseInt(current_step) === 2 ||
                  (activeStep && activeStep === 2) ||
                  parseInt(current_step) === 3 ||
                  (activeStep && activeStep === 3) ||
                  parseInt(current_step) === 4 ||
                  activeStep === 4
                    ? "border-[#ff0404]"
                    : "border-[#5F6368]"
                }`}
              ></div>
            </div>
            <h4 className="text-[0.8vw]">
              Provide essential details about <br /> your institution and main
              contact.
            </h4>
          </div>
        </div>
        <div className="w-fit h-fit flex flex-col">
          <div className="w-full  md:h-[3vw] h-[10vw] flex items-center">
            <div className="md:w-[3vw] w-[10vw] h-fit flex justify-center">
              <img
                src={`${
                  parseInt(current_step) === 2 ||
                  (activeStep && activeStep === 2) ||
                  parseInt(current_step) === 3 ||
                  (activeStep && activeStep === 3) ||
                  parseInt(current_step) === 4 ||
                  activeStep === 4
                    ? "/assets/img/complete1.svg"
                    : "/assets/img/complete.svg"
                }`}
                className="w-[1.5vw]"
              />
            </div>
            <h4
              className={`text-[0.9vw] font-[600]  ${
                parseInt(current_step) === 2 ||
                (activeStep && activeStep === 2) ||
                parseInt(current_step) === 3 ||
                (activeStep && activeStep === 3) ||
                parseInt(current_step) === 4 ||
                activeStep === 4
                  ? "text-[#ff0404]"
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
                  parseInt(current_step) === 2 ||
                  (activeStep && activeStep === 2) ||
                  parseInt(current_step) === 3 ||
                  (activeStep && activeStep === 3) ||
                  parseInt(current_step) === 4 ||
                  activeStep === 4
                    ? "border-[#ff0404]"
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
                  parseInt(current_step) === 3 ||
                  (activeStep && activeStep === 3) ||
                  parseInt(current_step) === 4 ||
                  activeStep === 4
                    ? "/assets/img/complete1.svg"
                    : "/assets/img/complete.svg"
                }`}
                className="w-[1.5vw]"
              />
            </div>
            <h4
              className={`text-[0.9vw] font-[600] ${
                parseInt(current_step) === 3 ||
                (activeStep && activeStep === 3) ||
                parseInt(current_step) === 4 ||
                activeStep === 4
                  ? "text-[#ff0404]"
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
                  parseInt(current_step) === 3 ||
                  (activeStep && activeStep === 3) ||
                  parseInt(current_step) === 4 ||
                  activeStep === 4
                    ? "border-[#ff0404]"
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
                  parseInt(current_step) === 4 || activeStep === 4
                    ? "/assets/img/complete1.svg"
                    : "/assets/img/complete.svg"
                }`}
                className="w-[1.5vw]"
              />
            </div>
            <h4
              className={`text-[0.9vw] font-[600] ${
                parseInt(current_step) === 4 || activeStep === 4
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
            className=" bg-[#FF0404] w-fit md:mt-0 mt-[3vw] flex justify-center items-center md:py-[0.7vw] py-[2vw] md:px-[1.5vw] px-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300"
          >
            <h4 className="md:text-[0.9vw] text-[3.5vw] text-[#ffffff]">
              Contact Us
            </h4>
          </button>
          <h4 className="text-[0.9vw]">
            Feel free to contact us and we will always <br /> help you through
            the process
          </h4>
        </div>
      </div>
      {(parseInt(current_step) === 1 || (activeStep && activeStep === 1)) && (
        <InstitutionDataSetup setActiveStep={(e) => setActiveStep(e)} />
      )}
      {(parseInt(current_step) === 2 || activeStep === 2) && (
        <InstitutionDocumentTypes setActiveStep={(e) => setActiveStep(e)} />
      )}
      {(parseInt(current_step) === 3 || activeStep === 3) && (
        <InstitutionDepartments setActiveStep={(e) => setActiveStep(e)} />
      )}
       {(parseInt(current_step) === 4 || activeStep === 4) && (
        <InstitutionPortalUsers setActiveStep={(e) => setActiveStep(e)} />
      )}
    </>
  );
}

export default AccountSetup;
