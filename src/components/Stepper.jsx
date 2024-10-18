import React, { useState, useRef, Suspense, lazy } from "react";
import { FaUser, FaGraduationCap, FaBriefcase } from "react-icons/fa";
import Spinner from "./Spinner";
import {
  IoCheckmarkDoneCircleSharp,
  IoDocuments,
  IoDocumentText,
} from "react-icons/io5";
import { GiFinishLine } from "react-icons/gi";

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
    const currentRef = stepRefs[activeStep];

    if (currentRef.current) {
      const isSubmitted = await currentRef.current.submitForm();
      if (isSubmitted) {
        setActiveStep((prevStep) => prevStep + 1); // Only increment if submission was successful
        window.scrollTo(0, 0); // Scroll to the top if submission is successful
      }
    }
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
      <div className="flex items-center justify-around py-4 bg-blue-300 shadow-lg text-white rounded-lg">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          return (
            <div key={index} className="flex flex-col items-center">
              <StepIcon
                className={`w-10 h-10 p-2 rounded-full border-2 
                  ${
                    activeStep >= index
                      ? "bg-gradient-to-tr from-black via-red-700 to-red-600 text-white border-white"
                      : "bg-blue-100 text-blue-300 border-blue-300"
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
      <div className="px-8 py-6">
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
          {activeStep === 0 && (
            <StepComponent
              ref={institutionDataRef}
              onNext={handleNext}
              onSavingChange={handleSavingChange}
            />
          )}
          {activeStep === 1 && (
            <StepComponent
              ref={institutionDocTypesRef}
              onNext={handleNext}
              onSavingChange={handleSavingChange}
            />
          )}
          {activeStep === 2 && (
            <StepComponent ref={letterTemplateRef} onNext={handleNext} />
          )}
          {activeStep === 3 && (
            <StepComponent
              ref={finalRef}
              onNext={handleNext}
              onSavingChange={handleSavingChange}
            />
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
          className="px-4 py-2 bg-green-700 text-white rounded-lg shadow"
          onClick={handleNext}
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="flex items-center space-x-2">
              <Spinner size="w-6 h-6" />
              <span>Saving...</span>
            </div>
          ) : activeStep === 2 ? (
            "Continue"
          ) : activeStep === steps.length - 1 ? (
            "Complete Account Setup"
          ) : (
            "Save and Progress"
          )}
        </button>
      </div>

      {activeStep === steps.length && (
        <div className="text-center p-4">
          <p className="text-lg font-semibold">
            All steps completed - you're finished!
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow mt-4"
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
