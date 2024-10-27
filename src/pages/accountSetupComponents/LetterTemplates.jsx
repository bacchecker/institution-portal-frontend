import { Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";
import LetterTemplatesTable from "./letterTemplateComponents/LetterTemplatesTable";
import AddLetterTemplate from "./letterTemplateComponents/AddLetterTemplate";
import useSWR from "swr";
import axios from "@utils/axiosConfig";
import { toast } from "sonner";
import EditLetterTemplate from "./letterTemplateComponents/EditLetterTemplate";

function LetterTemplates({ setActiveStep }) {
  const [isSaving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [currentScreen, setCurrentScreen] = useState();
  const institution = secureLocalStorage.getItem("institution");
  const letterTemplateScreen = secureLocalStorage.getItem(
    "letterTemplateScreen"
  );

  const setInstitution = (newInstitution) => {
    secureLocalStorage.setItem("institution", newInstitution);
  };

  const handleBackButton = () => {
    const updatedInstitution = {
      ...institution,
      current_step: "2",
    };
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setInstitution(updatedInstitution);
    secureLocalStorage.setItem("institution", updatedInstitution);
    setActiveStep(2);
  };

  const handleCreateLetterTemplates = () => {
    secureLocalStorage.setItem("letterTemplateScreen", 2);
    setCurrentScreen(2);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const {
    data: letterTemplates,
    error: letterTemplatesError,
    isLoading: letterTemplatesLoading,
  } = useSWR("/institution/letter-templates", (url) =>
    axios.get(url).then((res) => res.data)
  );

  const handleSubmit = async () => {
    if (letterTemplates?.data?.length === 0) {
      toast.error("Add at least One letter template", {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      setSaving(true);
      const data = {
        step: 4,
      };
      try {
        const response = await axios.post(
          "/institution/account-setup/next-step",
          data
        );
        toast.success(
          "Institution Document Type(s) Letter Templates created successfully"
        );
        const updatedInstitution = {
          ...institution,
          current_step: "4",
        };
        setInstitution(updatedInstitution);
        secureLocalStorage.setItem("institution", updatedInstitution);
        setActiveStep(4);
        setSaving(false);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        setSaving(false);
      } finally {
        setSaving(false);
        return true;
      }
    }
  };

  console.log("curr",currentScreen);
  

  return (
    <div className="w-full px-5 pb-4">
      {(letterTemplateScreen === 1 || currentScreen === 1) && (
        <>
          <div className="border-b border-[#ff0404] py-4">
            <h4 className="text-[1rem] font-[600] mb-4">
              Institutions utilize specific{" "}
              <span className="text-[#ff0404]">letter templates</span> for{" "}
              <span className="text-[#ff0404]">verification</span> and{" "}
              <span className="text-[#ff0404]">validation</span> processes. Each
              template is designed to clearly communicate the outcome, with
              distinct letters issued for{" "}
              <span className="text-[#ff0404]">successful</span> and{" "}
              <span className="text-[#ff0404]">unsuccessful</span> results. This
              approach ensures clarity and professionalism in communications
              across various contexts. <br />
              <br /> Please use the "
              <span className="text-[#ff0404]">Create Letter Template</span>"
              button to generate the appropriate template for each scenario.
            </h4>
          </div>
          <div className="my-3 w-full flex justify-end mx-auto dark:bg-slate-900 mt-6">
            <div className="flex gap-4 items-center">
              <button
                type="button"
                onClick={handleCreateLetterTemplates}
                className="w-fit flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
              >
                Create Letter Template
              </button>
            </div>
          </div>
          <LetterTemplatesTable
            letterTemplates={letterTemplates}
            letterTemplatesLoading={letterTemplatesLoading}
            setSelectedTemplate={(e) => setSelectedTemplate(e)}
            setCurrentScreen={setCurrentScreen}
          />
        </>
      )}
      {(letterTemplateScreen === 2 || currentScreen === 2) && (
        <AddLetterTemplate setCurrentScreen={setCurrentScreen} />
      )}
      {(letterTemplateScreen === 3 || currentScreen === 3) && (
        <EditLetterTemplate
          setCurrentScreen={setCurrentScreen}
          selectedTemplate={selectedTemplate}
        />
      )}
      {(letterTemplateScreen === 1 || currentScreen === 1) && (
        <>
          <div className="flex justify-between w-full mt-[4rem!important]">
            <button
              type="button"
              onClick={handleBackButton}
              className="flex items-center bg-[#ffffff] border border-[#ff0404] hover:bg-[#ff0404] text-[#ff0404] hover:text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
            >
              <FaAnglesLeft className="mr-2" />
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium ${
                isSaving && "cursor-not-allowed bg-[#f77f7f]"
              }`}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Spinner size="sm" color="white" />
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                <>
                  Save and Continue
                  <FaAnglesRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default LetterTemplates;
