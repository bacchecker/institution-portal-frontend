import React, { useEffect, useState } from "react";
import SideModal from "@/components/SideModal";
import SelectInput from "@/components/SelectInput";
import Swal from "sweetalert2";
import { useCreateInstitutionDocumentTypeMutation } from "../../../redux/apiSlice";
import LoadItems from "@/components/LoadItems";
import { toast } from "sonner";

function AddNewDocumentType({
  setOpenModal,
  openModal,
  existingDocumentTypes,
  isExistingDocTypesFetching,
  isExistingDocTypesLoading,
}) {
  const [items, setItems] = useState([
    {
      document_type_id: "",
      base_fee: "",
      printing_fee: "",
      validation_fee: "",
      verification_fee: "",
      soft_copy: false,
      hard_copy: false,
    },
  ]);

  const handleDocumentTypeOption = (item, index) => {

    const updatedItems = [...items];

    updatedItems[index].document_type_id = item?.id;
    setItems(updatedItems);
  };

  const handleItemChange = (e, i) => {
    const { name, type, checked, value } = e.target;
    const onChangeValue = [...items];

    if (type === "checkbox") {
      onChangeValue[i][name] = checked;
    } else {
      onChangeValue[i][name] = value;
    }

    if (onChangeValue.length > 1) {
      const documentTypeIds = onChangeValue.map(
        (item) => item.document_type_id
      );
      const hasDuplicates = documentTypeIds.some(
        (id, index) => documentTypeIds.indexOf(id) !== index
      );

      if (hasDuplicates) {
        Swal.fire({
          title: "Error",
          text: "Document Type has already been selected",
          icon: "error",
          button: "OK",
        });
        return;
      }
    }
    setItems(onChangeValue);
  };

  const getDocumentName = (value) => {
    const type = existingDocumentTypes?.data?.types?.find(
      (type) => type?.id === value
    );
    return type?.name;
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        document_type_id: "",
        base_fee: "",
        printing_fee: "",
        validation_fee: "",
        verification_fee: "",
        soft_copy: false,
        hard_copy: false,
      },
    ]);
  };
  const handleItemDelete = (i) => {
    const list = [...items];
    list.splice(i, 1);
    setItems(list);
  };

  useEffect(() => {
    if (!openModal) {
      setItems([
        {
          document_type_id: "",
          base_fee: "",
          printing_fee: "",
          validation_fee: "",
          verification_fee: "",
          soft_copy: false,
          hard_copy: false,
        },
      ]);
    }
  }, [openModal]);

  const newItems = items.map((item, i) => {
    const newItem = { ...item };

    if (!newItem.hard_copy) {
      newItem.printing_fee = "0.00";
    }

    return newItem;
  });

  const [
    createInstitutionDocumentType,
    { data, isSuccess, isLoading, isError, error },
  ] = useCreateInstitutionDocumentTypeMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasErrors = items.some((item) => {
      if (
        item.document_type_id === "" ||
        item.base_fee === "" ||
        (item.hard_copy && item.printing_fee === "") ||
        item.validation_fee === "" ||
        item.verification_fee === "" ||
        (!item?.hard_copy && !item?.soft_copy)
      ) {
        Swal.fire({
          title: "Error",
          text: "Fill All required fields",
          icon: "error",
          button: "OK",
        });

        return true;
      }
      return false;
    });

    if (hasErrors) {
      return;
    }

    const data = {
      document_types: newItems,
    };

    try {
      await createInstitutionDocumentType(data);
    } catch (error) {
      toast.error("Failed to submit documents", {
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
  };

  useEffect(() => {
    if (isSuccess && data) {
      Swal.fire({
        title: "Success",
        text: "Document Type(s) created successfully",
        icon: "success",
        button: "OK",
        confirmButtonColor: "#00b17d",
      }).then((isOkay) => {
        if (isOkay) {
          setOpenModal(!openModal);
          setItems([
            {
              document_type_id: "",
              base_fee: "",
              printing_fee: "",
              validation_fee: "",
              verification_fee: "",
              soft_copy: false,
              hard_copy: false,
            },
          ]);
        }
      });
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  return (
    <SideModal
      title={"DocumentType Details"}
      setOpenModal={setOpenModal}
      openModal={openModal}
    >
      <form
        onSubmit={handleSubmit}
        className="md:px-[1vw] px-[5vw] w-full overflow-auto pt-[1vw]"
      >
        <div className="flex flex-col">
          {items?.map((item, i) => {
            return (
              <>
                <div className="border border-[#ff0404] py-4 px-2 rounded-[0.5vw]">
                  <div className="md:mt-[2vw] mt-[8vw]">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                      Document Type<span className="text-[#f1416c]">*</span>
                    </h4>
                    <SelectInput
                      placeholder={"Select option"}
                      data={existingDocumentTypes?.data?.types}
                      inputValue={getDocumentName(item?.document_type_id)}
                      onItemSelect={(selectedItem) =>
                        handleDocumentTypeOption(selectedItem, i)
                      }
                      isLoading={isExistingDocTypesFetching}
                      className="custom-dropdown-class display-md-none"
                    />
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
                        id={`${i}soft_copy`}
                        className="checkbox-design"
                        isChecked={item.soft_copy}
                        onChange={(e) => handleItemChange(e, i)}
                      />
                      <label
                        htmlFor={`${i}soft_copy`}
                        className="text-[0.9vw] cursor-pointer"
                      >
                        Soft Copy
                      </label>
                    </div>
                    <div className="flex items-center gap-[0.5vw]">
                      <input
                        type="checkbox"
                        name="hard_copy"
                        id={`${i}hard_copy`}
                        className="checkbox-design"
                        isChecked={item.hard_copy}
                        onChange={(e) => handleItemChange(e, i)}
                      />
                      <label
                        htmlFor={`${i}hard_copy`}
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
                        value={item.base_fee}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                            handleItemChange(e, i);
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
                        value={item.validation_fee}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                            handleItemChange(e, i);
                          }
                        }}
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                      />
                    </div>
                  </div>
                  <h4 className="md:text-[0.8vw] text-[2.5vw] text-[#f1416c]">{`(A fee for confirming and validating the accuracy of specific information or credentials provided in institutional documents upon request.)`}</h4>
                  <div className="md:mt-[2vw] mt-[10vw]">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                      Verification Request Fee<span className="text-[#f1416c]">*</span>
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                      <input
                        type="text"
                        name="verification_fee"
                        value={item.verification_fee}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                            handleItemChange(e, i);
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
                      {item.hard_copy && (
                        <span className="text-[#ff0404]">*</span>
                      )}
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                      <input
                        type="text"
                        name="printing_fee"
                        disabled={!item?.hard_copy}
                        value={item?.hard_copy ? item.printing_fee : 0}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,20}(\.\d{0,20})?$/.test(value)) {
                            handleItemChange(e, i);
                          }
                        }}
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                      />
                    </div>
                  </div>
                  <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7vw] font-[600] mt-[0.3vw]">
                    <span className="text-[#ff0404]">Note</span>: This can only
                    be added when document format includes hard copy
                  </h6>
                </div>
                <h6 className="text-[#2e2e2e] md:text-[0.7vw] text-[2.7vw] font-[600] mt-[0.3vw]">
                  <span className="text-[#ff0404]">Note</span>: You add multiple
                  document types by clicking on "Add" button
                </h6>
                <div className="flex justify-end gap-x-[0.5vw]">
                  {items.length - 1 === i && (
                    <button
                      type="button"
                      disabled={
                        !item?.document_type_id ||
                        !item?.base_fee ||
                        (item?.hard_copy && !item?.printing_fee) ||
                        !item?.validation_fee ||
                        !item?.verification_fee ||
                        (!item?.hard_copy && !item?.soft_copy)
                      }
                      onClick={(e) => handleAddItem(e, i)}
                      className="bg-[#000] md:my-[1vw!important] my-[2vw!important] text-white md:w-[4vw] w-[17vw] md:text-[0.8vw] text-[2.5vw] flex justify-center items-center md:py-[0.5vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[1vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#4b4b4b] disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  )}
                  {items.length !== 1 && (
                    <button
                      type="button"
                      onClick={() => handleItemDelete(i)}
                      className="bg-[#FF0404] md:my-[1rem!important] my-[2rem!important] text-white md:w-[6vw]  md:text-[0.8vw] flex justify-center items-center md:py-[0.5vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[1vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </>
            );
          })}
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
                Submitting...
              </h4>
            </div>
          ) : (
            <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
              Submit
            </h4>
          )}
        </button>
      </form>
    </SideModal>
  );
}

export default AddNewDocumentType;
