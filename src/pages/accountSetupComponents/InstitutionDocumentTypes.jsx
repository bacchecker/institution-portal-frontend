import { Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";

function InstitutionDocumentTypes({setActiveStep}) {
  const [isSaving, setSaving] = useState(false);

  const institution = secureLocalStorage.getItem("institution");
  const setInstitution = (newInstitution) => {
    secureLocalStorage.setItem("institution", newInstitution);
  };

  const handleBackButton = () => {
    const updatedInstitution = {
      ...institution,
      current_step: "1",
    };

    setInstitution(updatedInstitution);
    secureLocalStorage.setItem("institution", updatedInstitution);
    setActiveStep(1);
  };

  console.log("insout", institution);

  return (
    <div className="w-full p-5">
      <div className="flex justify-between w-full mt-[4rem!important]">
        <button
          type="button"
          onClick={handleBackButton}
          className="flex items-center bg-[#ffffff] border border-[#ff0404] hover:bg-[#ff0404] text-[#ff0404] hover:text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
        >
          <FaAnglesLeft className="ml-2" />
          Back
        </button>
        <button
          type="button"
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
    </div>
  );
}

export default InstitutionDocumentTypes;
