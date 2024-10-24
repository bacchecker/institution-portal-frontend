import { Select, SelectItem } from "@nextui-org/react";
import React, { useState } from "react";
import { FaAnglesLeft } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";
import useSWR from "swr";
import axios from "@utils/axiosConfig";
import SunEditor from "suneditor-react";
import ValidationLetterTemplate from "./addLetterTemplateComponents/ValidationLetterTemplate";
import VerificationLetterTemplate from "./addLetterTemplateComponents/VerificationLetterTemplate";

function AddLetterTemplate({ setCurrentScreen }) {
  const [currentTempTab, setCurrentTempTab] = useState(1);
  const handleBackButton = () => {
    secureLocalStorage.setItem("letterTemplateScreen", 1);
    setCurrentScreen(1);
  };

  const {
    data: institutionDocuments,
    error: institutionError,
    isLoading: institutionDocsLoading,
  } = useSWR("/institution/document-types", (url) =>
    axios.get(url).then((res) => res.data)
  );
  console.log("inst", institutionDocuments);

  return (
    <>
      <div className="flex justify-end w-full">
        <button
          type="button"
          onClick={handleBackButton}
          className="flex items-center bg-[#ffffff] border border-[#ff0404] hover:bg-[#ff0404] text-[#ff0404] hover:text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
        >
          <FaAnglesLeft className="mr-2" />
          Back
        </button>
      </div>
      <div className="w-full flex justify-between mt-4">
        <div className="w-[28%] flex flex-col gap-4">
          <div className="w-full flex flex-col gap-2 h-fit border border-[#ff040459] rounded-[0.5rem] p-4">
            <button
              onClick={() => setCurrentTempTab(1)}
              className={`w-full h-fit py-2 rounded-[0.3rem] text-[1rem] ${
                currentTempTab === 1 && "text-white bg-[#ff0404]"
              }`}
            >
              Validation Letter Template
            </button>
            <button
              onClick={() => setCurrentTempTab(2)}
              className={`w-full h-fit py-2 rounded-[0.3rem] text-[1rem] ${
                currentTempTab === 2 && "text-white bg-[#ff0404]"
              }`}
            >
              Verification Letter Template
            </button>
          </div>
          <div className="w-full flex flex-col h-[10rem] gap-2 border border-[#ff040459] rounded-[0.5rem] p-4"></div>
        </div>
        {currentTempTab === 1 && (
          <ValidationLetterTemplate
            institutionDocuments={institutionDocuments}
          />
        )}
        {currentTempTab === 2 && (
          <VerificationLetterTemplate
            institutionDocuments={institutionDocuments}
          />
        )}
      </div>
    </>
  );
}

export default AddLetterTemplate;
