import React, { useEffect, useState } from "react";
import SideModal from "../../../components/SideModal";
import SelectInput from "../../../components/SelectInput";
import Swal from "sweetalert2";
import { useCreateInstitutionDocumentTypeMutation } from "../../../redux/apiSlice";
import LoadItems from "../../../components/LoadItems";
import { toast } from "sonner";

function AddNewUser({ setOpenModal, openModal }) {
  const initialUserInput = {
    first_name: "",
    last_name: "",
    other_name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  };
  const [userInput, setUserInput] = useState(initialUserInput);
  const [selectedGender, setSelectedGender] = useState("");
  const data = [
    { title: "Male", value: "male" },
    { title: "Female", value: "female" },
  ];

  const handleSeletedGender = (item) => {
    setSelectedGender(item);
  };

  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (!openModal) {
      setUserInput(initialUserInput);
    }
  }, [openModal]);

  //   const [
  //     createInstitutionDocumentType,
  //     { data, isSuccess, isLoading, isError, error },
  //   ] = useCreateInstitutionDocumentTypeMutation();

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const hasErrors = items.some((item) => {
  //       if (
  //         item.document_type_id === "" ||
  //         item.base_fee === "" ||
  //         (item.hard_copy && item.printing_fee === "") ||
  //         item.validation_fee === "" ||
  //         item.verification_fee === "" ||
  //         (!item?.hard_copy && !item?.soft_copy)
  //       ) {
  //         Swal.fire({
  //           title: "Error",
  //           text: "Fill All required fields",
  //           icon: "error",
  //           button: "OK",
  //         });

  //         return true;
  //       }
  //       return false;
  //     });

  //     if (hasErrors) {
  //       return;
  //     }

  //     const data = {
  //       document_types: newItems,
  //     };

  //     try {
  //       await createInstitutionDocumentType(data);
  //     } catch (error) {
  //       toast.error("Failed to submit documents", {
  //         position: "top-right",
  //         autoClose: 1202,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //     }
  //   };

  //   useEffect(() => {
  //     if (isSuccess && data) {
  //       Swal.fire({
  //         title: "Success",
  //         text: "Document Type(s) created successfully",
  //         icon: "success",
  //         button: "OK",
  //         confirmButtonColor: "#00b17d",
  //       }).then((isOkay) => {
  //         if (isOkay) {
  //           setOpenModal(!openModal);
  //           setItems([
  //             {
  //               document_type_id: "",
  //               base_fee: "",
  //               printing_fee: "",
  //               validation_fee: "",
  //               verification_fee: "",
  //               soft_copy: false,
  //               hard_copy: false,
  //             },
  //           ]);
  //         }
  //       });
  //     }
  //   }, [isSuccess, data]);

  //   useEffect(() => {
  //     if (isError) {
  //       toast.error(error?.data?.message);
  //     }
  //   }, [isError]);
  const isLoading = false;
  return (
    <SideModal
      title={"User Details"}
      setOpenModal={setOpenModal}
      openModal={openModal}
    >
      <form
        // onSubmit={handleSubmit}
        className="md:px-[1vw] px-[5vw] w-full overflow-auto pt-[1vw]"
      >
        <div className="flex flex-col">
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              First Name<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="first_name"
                value={userInput.first_name}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Last Name<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="last_name"
                value={userInput.last_name}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">Other Name</h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="other_name"
                value={userInput.other_name}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Email<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="email"
                value={userInput.email}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Phone<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="phone"
                value={userInput.phone}
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
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Residential Address<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="address"
                value={userInput.address}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[8vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Gender<span className="text-[#f1416c]">*</span>
            </h4>
            <SelectInput
              placeholder={"Select Option"}
              data={data}
              inputValue={selectedGender?.title}
              onItemSelect={handleSeletedGender}
              className="custom-dropdown-class display-md-none"
            />
          </div>
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

export default AddNewUser;
