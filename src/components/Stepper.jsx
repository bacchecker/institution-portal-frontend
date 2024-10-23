import React, { useState, useRef, Suspense, lazy } from "react";
import { FaUser, FaGraduationCap, FaBriefcase } from "react-icons/fa";
import Spinner from "./Spinner";
import {
  IoCheckmarkDoneCircleSharp,
  IoDocuments,
  IoDocumentText,
} from "react-icons/io5";
import { GiFinishLine } from "react-icons/gi";
import { FaAnglesRight } from "react-icons/fa6";

const steps = [
  {
    label: "Institution Data",
    icon: FaUser,
    component: lazy(() => import("../pages/complete-profile/InstitutionData")),
  },
  {
    label: "Institution Document Types",
    icon: IoDocuments,
    component: lazy(() =>
      import("../pages/complete-profile/InstitutionDocTypes")
    ),
  },
  {
    label: "Letter Template",
    icon: IoDocumentText,
    component: lazy(() => import("../pages/complete-profile/LetterTemplate")),
  },
  {
    label: "Complete Profile",
    icon: IoCheckmarkDoneCircleSharp,
    component: lazy(() => import("../pages/complete-profile/Final")),
  },
];

const HorizontalLinearStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [submitHandlers, setSubmitHandlers] = useState({});

  const institutionDataRef = useRef();
  const institutionDocTypesRef = useRef();
  const letterTemplateRef = useRef();
  const finalRef = useRef();

  const stepRefs = [
    institutionDataRef,
    institutionDocTypesRef,
    letterTemplateRef,
    finalRef,
  ];

  const handleSavingChange = (saving) => {
    setIsSaving(saving);
  };

  const handleNext = async () => {
    if (submitHandlers[activeStep]) {

      const isSubmitted = await submitHandlers[activeStep]();
      
      if (isSubmitted) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else {
      // If no submitHandler is defined, just move to the next step
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const passHandleSubmit = (stepIndex, handleSubmit) => {
    setSubmitHandlers((prevHandlers) => ({
      ...prevHandlers,
      [stepIndex]: handleSubmit,
    }));
  };


  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const StepComponent = steps[activeStep].component;

  return (
    <div className="w-full">
      {/* Stepper */}
      <div className="flex items-center justify-around py-4 bg-red-300 shadow-lg text-white rounded-lg">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          return (
            <div key={index} className="flex flex-col items-center">
              <StepIcon
                className={`w-10 h-10 p-2 rounded-full border-2 
                  ${
                    activeStep >= index
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

      {/* Step Content */}
      <div className="">
        <Suspense
          fallback={
            <div
              role="status"
              className="w-full p-4 space-y-4 border border-gray-200 divide-y bg-gray-100 rounded shadow animate-pulse md:p-6 "
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          }
        >
          {steps.map((step, index) =>
            index === activeStep ? (
              <step.component
                key={index}
                ref={stepRefs[index]}
                passHandleSubmit={passHandleSubmit}
                stepIndex={index}
                onSavingChange={handleSavingChange}
              />
            ) : null
          )}
        </Suspense>
      </div>

      {/* Stepper Navigation */}
      <div className="flex justify-between px-8 py-4">
        <button
          className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow ${
            activeStep === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </button>

        <button
          className={`px-4 py-2 rounded-lg shadow ${
            isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-[#ff0404] hover:bg-[#ff0404] text-white"
          }`}
          onClick={handleNext}
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="flex items-center space-x-2">
              <Spinner size="w-4 h-4" />
              <span>Saving...</span>
            </div>
          ) : activeStep === steps.length - 1 ? (
            "Complete Account Setup"
          ) : (
            <div className="flex items-center space-x-2">
              
              <span>Save and Progress</span>
              <FaAnglesRight />
            </div>
          )}
        </button>

      </div>

      {activeStep === steps.length && (
        <div className="text-center p-4">
          <p className="text-lg font-semibold">
            All steps completed - you're finished!
          </p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow mt-4"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default HorizontalLinearStepper;
