import React, { useEffect, useState } from "react";
import SideModal from "@/components/SideModal";
import SelectInput from "@/components/SelectInput";
import Swal from "sweetalert2";
import {
  useCreateInstitutionDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
} from "../../../redux/apiSlice";
import LoadItems from "@/components/LoadItems";
import { toast } from "sonner";

function EditDocumentType({ setOpenModal, openModal, selectedDocumentType }) {
  const [userInput, setUserInput] = useState([]);
  const [initialUserInput, setInitialUserInput] = useState([]);
  useEffect(() => {
    if (selectedDocumentType) {
      setUserInput(selectedDocumentType);
      setInitialUserInput(selectedDocumentType);
    }
  }, [selectedDocumentType]);

  const handleUserInput = (e) => {
    const { name, type, checked, value } = e.target;

    setUserInput((prevUserInput) => ({
      ...prevUserInput,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (!openModal) {
      setUserInput(initialUserInput);
    }
  }, [openModal]);

  const [
    updateDocumentType,
    { documentData, isSuccess, isError, error, isLoading },
  ] = useUpdateDocumentTypeMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      base_fee,
      printing_fee,
      validation_fee,
      verification_fee,
      soft_copy,
      hard_copy,
      id,
    } = userInput;

    if (
      base_fee === "" ||
      (hard_copy && printing_fee === "") ||
      validation_fee === "" ||
      verification_fee === "" ||
      (!hard_copy && !soft_copy)
    ) {
      toast.error("Fill All required fields", {
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
      const result = await Swal.fire({
        title: "Are you sure you want to update this document type?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#febf4c",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, I'm sure",
        cancelButtonText: "No, cancel",
      });

      if (result.isConfirmed) {
        try {
          await updateDocumentType({
            id,
            body: {
              base_fee,
              printing_fee: !hard_copy ? 0 : printing_fee,
              validation_fee,
              verification_fee,
              soft_copy,
              hard_copy,
            },
          });
        } catch (error) {
          console.error("Error updating documnent type:", error);
        }
      }
    }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("DocumentTpye Updated Successfully", {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setOpenModal(!openModal);
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError) {
      toast.error(error.data.message, {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [isError]);

  return (
    <SideModal
      title={"Document Type Details"}
      setOpenModal={setOpenModal}
      openModal={openModal}
    >
      <form
        onSubmit={handleSubmit}
        className="md:px-[1vw] px-[5vw] w-full overflow-auto pt-[1vw]"
      >
        <div className="flex flex-col">
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Document Type<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="base_fee"
                value={userInput?.document_type?.name}
                readOnly
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <h4 className="text-[0.9vw] mt-[2vw]">
            Document Formats
            <span className="text-[#ff0404]">*</span>
          </h4>
          <div className="flex w-full items-center gap-[1vw]">
            <div className="flex items-center gap-[0.5vw]">
              <input
                type="checkbox"
                name="soft_copy"
                id="soft_copy1"
                className="checkbox-design"
                checked={userInput.soft_copy}
                onChange={handleUserInput}
              />
              <label
                htmlFor="soft_copy1"
                className="text-[0.9vw] cursor-pointer"
              >
                Soft Copy
              </label>
            </div>
            <div className="flex items-center gap-[0.5vw]">
              <input
                type="checkbox"
                name="hard_copy"
                id="hard_copy1"
                className="checkbox-design"
                checked={userInput.hard_copy}
                onChange={handleUserInput}
              />
              <label
                htmlFor="hard_copy1"
                className="text-[0.9vw] cursor-pointer"
              >
                Hard Copy
              </label>
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[10vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Document Request Fee<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="base_fee"
                value={userInput.base_fee}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                    handleUserInput(e);
                  }
                }}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
            <h4 className="md:text-[0.8vw] text-[2.5vw] text-[#f1416c]">{`(A fee charged for requesting the issuance or retrieval of official documents, such as transcripts, certificates, or other records from the institution.)`}</h4>
          </div>
          <div className="md:mt-[2vw] mt-[10vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Validation Request Fee<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="validation_fee"
                value={userInput.validation_fee}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                    handleUserInput(e);
                  }
                }}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
            <h4 className="md:text-[0.8vw] text-[2.5vw] text-[#f1416c]">{`(A fee for confirming and validating the accuracy of specific information or credentials provided in institutional documents upon request.)`}</h4>
          </div>
          <div className="md:mt-[2vw] mt-[10vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Verification Request Fee<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="verification_fee"
                value={userInput.verification_fee}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                    handleUserInput(e);
                  }
                }}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
            <h4 className="md:text-[0.8vw] text-[2.5vw] text-[#f1416c]">{`(A fee charged for processing and verifying the authenticity of institutional documents upon request by students, alumni, or other entities.)`}</h4>
          </div>
          <div className="md:mt-[2vw] mt-[10vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Document Printing Fee
              {userInput.hard_copy ? (
                <span className="text-[#ff0404]">*</span>
              ) : (
                <></>
              )}
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="printing_fee"
                disabled={!userInput?.hard_copy}
                value={userInput?.hard_copy ? userInput.printing_fee : 0}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                    handleUserInput(e);
                  }
                }}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7vw] font-[600] mt-[0.3vw]">
            <span className="text-[#ff0404]">Note</span>: This can only be added
            when document format includes hard copy
          </h6>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#FF0404] md:my-[2vw!important] my-[4vw!important] w-full flex justify-center items-center md:py-[0.7vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#fa6767]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadItems color={"#ffffff"} size={15} />
              <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                Updating...
              </h4>
            </div>
          ) : (
            <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
              Update
            </h4>
          )}
        </button>
      </form>
    </SideModal>
  );
}

export default EditDocumentType;
