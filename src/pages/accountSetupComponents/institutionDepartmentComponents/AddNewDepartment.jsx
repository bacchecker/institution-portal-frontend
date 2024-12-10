import React, { useEffect, useState } from "react";
import SideModal from "../../../components/SideModal";
import SelectInput from "../../../components/SelectInput";
import Swal from "sweetalert2";
import { useCreateInstitutionDocumentTypeMutation } from "../../../redux/apiSlice";
import LoadItems from "../../../components/LoadItems";
import { toast } from "sonner";

function AddNewDepartment({ setOpenModal, openModal, allPermissions }) {
  const initialUserInput = {
    name: "",
    description: "",
  };
  const [userInput, setUserInput] = useState(initialUserInput);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (allPermissions) {
      const groups = allPermissions?.data?.reduce((acc, permission) => {
        const parts = permission.name.split(".");

        const category = parts[0];
        const subcategory = parts.length === 3 ? parts[1] : null;
        const action = parts.length === 3 ? parts[2] : parts[1];

        if (!acc[category]) acc[category] = {};
        if (subcategory) {
          if (!acc[category][subcategory]) acc[category][subcategory] = [];
          acc[category][subcategory].push({ id: permission.id, action });
        } else {
          if (!acc[category].actions) acc[category].actions = [];
          acc[category].actions.push({ id: permission.id, action });
        }

        return acc;
      }, {});

      setGroupedPermissions(groups);
    }
  }, [allPermissions]);

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: value });
  };
  const handleCheckboxChange = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((permId) => permId !== id) : [...prev, id]
    );
  };

  console.log("grou", groupedPermissions);

  const isLoading = false;

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

  return (
    <SideModal
      title={"Department Details"}
      setOpenModal={setOpenModal}
      openModal={openModal}
    >
      <form
        // onSubmit={handleSubmit}
        className="md:px-[1vw] px-[5vw] w-full overflow-auto pt-[1vw]"
      >
        <div className="flex flex-col">
          <div className="md:mt-[2vw] mt-[10vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Department Name<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="name"
                value={userInput.name}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="md:mt-[2vw] mt-[10vw]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Description
              <span className="text-[#f1416c]">*</span>
            </h4>
            <div class="relative w-full md:h-[10vw] h-[30vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <textarea
                placeholder="Enter institution desription"
                value={userInput?.description}
                name="description"
                required
                onChange={handleUserInput}
                className="w-full h-full md:p-[0.8vw] p-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              ></textarea>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Permissions<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="flex gap-[2vw] flex-wrap">
              {Object?.entries(groupedPermissions)?.map(
                ([category, subcategories]) => (
                  <div key={category} className="mb-[0.2vw]">
                    <h2 className="text-[1vw] capitalize">{`Manage ${category.replace(
                      "-",
                      " "
                    )}`}</h2>
                    {Object?.entries(subcategories)?.map(
                      ([subcategory, actions]) => (
                        <div key={subcategory} style={{ marginLeft: "1rem" }}>
                          <h3 className="text-[0.9vw] capitalize">{subcategory.replace("-", " ")}</h3>
                          {actions.map(({ id, action }) => (
                            <div key={id} style={{ marginLeft: "1.5rem" }}>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="checkbox-design1"
                                  checked={selectedPermissions.includes(id)}
                                  onChange={() => handleCheckboxChange(id)}
                                />
                                {`Can ${action.replace("-", " ")}`}
                              </label>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                )
              )}
            </div>
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

export default AddNewDepartment;
