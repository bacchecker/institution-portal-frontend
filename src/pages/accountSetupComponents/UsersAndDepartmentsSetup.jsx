import { Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";

function UsersAndDepartmentsSetup({ setActiveStep }) {
  const [isSaving, setSaving] = useState(false);
  const institution = secureLocalStorage.getItem("institution");
  const setInstitution = (newInstitution) => {
    secureLocalStorage.setItem("institution", newInstitution);
  };
  const handleBackButton = () => {
    const updatedInstitution = {
      ...institution,
      current_step: "3",
    };

    setInstitution(updatedInstitution);
    secureLocalStorage.setItem("institution", updatedInstitution);
    setActiveStep(3);
  };
  const handleSubmit = async () => {
    // if (letterTemplates?.data?.length === 0) {
    //   toast.error("Add at least One letter template", {
    //     position: "top-right",
    //     autoClose: 1202,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    // } else {
    //   setSaving(true);
    //   const data = {
    //     step: 4,
    //   };
    //   try {
    //     const response = await axios.post(
    //       "/institution/account-setup/next-step",
    //       data
    //     );
    //     toast.success(
    //       "Institution Document Type(s) Letter Templates created successfully"
    //     );
    //     const updatedInstitution = {
    //       ...institution,
    //       current_step: "4",
    //     };
    //     setInstitution(updatedInstitution);
    //     secureLocalStorage.setItem("institution", updatedInstitution);
    //     setActiveStep(4);
    //     setSaving(false);
    //   } catch (error) {
    //     toast.error(error.response?.data?.message || "An error occurred");
    //     setSaving(false);
    //   } finally {
    //     setSaving(false);
    //     return true;
    //   }
    // }
  };
  return (
    <div className="w-full px-5 pb-4">
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
    </div>
  );
}

export default UsersAndDepartmentsSetup;
