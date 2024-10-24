import React from "react";
import { FaAnglesLeft } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";

function AddLetterTemplate({ setCurrentScreen }) {
  const handleBackButton = () => {
    secureLocalStorage.setItem("letterTemplateScreen", 1);
    setCurrentScreen(1);
  };
  return (
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
  );
}

export default AddLetterTemplate;
