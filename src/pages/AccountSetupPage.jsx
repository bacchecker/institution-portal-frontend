import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { Card, CardBody } from "@nextui-org/react";
import { FaUser, FaGraduationCap, FaBriefcase } from "react-icons/fa";
import {
  IoCheckmarkDoneCircleSharp,
  IoDocuments,
  IoDocumentText,
} from "react-icons/io5";
import InstitutionDataSetup from "./accountSetupComponents/institutionDataSetup";
import secureLocalStorage from "react-secure-storage";
import InstitutionDocumentTypes from "./accountSetupComponents/InstitutionDocumentTypes";
function AccountSetupPage() {
  const [activeStep, setActiveStep] = useState(1);
  const current_step = secureLocalStorage.getItem("institution")?.current_step;
  console.log("inst", current_step);

  const steps = [
    {
      label: "Institution Data",
      icon: FaUser,
    },
    {
      label: "Institution Document Types",
      icon: IoDocuments,
    },
    {
      label: "Letter Template",
      icon: IoDocumentText,
    },
    {
      label: "Complete Profile",
      icon: IoCheckmarkDoneCircleSharp,
    },
  ];

  return (
    <AuthLayout title="Account Setup">
      <section className="p-3">
        <Card className="dark:bg-slate-900">
          <CardBody className=" ">
            <div className="flex justify-between px-6 pt-4 pb-2 ">
              <div className="">
                <p className="font-bold text-2xl text-uewBlue mb-1">
                  Institution Account Setup
                </p>
                <p className="text-sm text-gray-700 font-normal">
                  Please provide all required details and manage your document
                  types efficiently to activate your institution's account
                </p>
              </div>
            </div>
            <div className="py-2 lg:mx-5 ">
              <div className="flex items-center justify-around py-4 bg-red-300 shadow-lg text-white rounded-lg">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <StepIcon
                        className={`w-10 h-10 p-2 rounded-full border-2 
                  ${
                    parseInt(current_step) === index + 1
                      ? "bg-gradient-to-tr from-black via-[#ff0404] to-[#ff0404] text-white border-white"
                      : "bg-red-100 text-[#fda2a2] border-[#fda2a2]"
                  }`}
                      />
                      <span className="mt-2 text-center text-xs lg:text-sm">
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between mx-5 pt-4 pb-2 border border-[#ff040459] mt-4 rounded-[0.5rem]">
              {parseInt(current_step) === 1 && <InstitutionDataSetup />}
              {parseInt(current_step) === 2 && <InstitutionDocumentTypes />}
            </div>
          </CardBody>
        </Card>
      </section>
    </AuthLayout>
  );
}

export default AccountSetupPage;