import React, { useEffect, useState } from "react";
import SideModal from "@/components/SideModal";
import SelectInput from "@/components/SelectInput";
import Swal from "sweetalert2";
import {
  useCreateDepartmentMutation,
  useCreateInstitutionDocumentTypeMutation,
  useUpdateDepartmentMutation,
} from "../../../redux/apiSlice";
import LoadItems from "@/components/LoadItems";
import { toast } from "sonner";
import PropTypes from "prop-types";

function EditDepartment({
  setOpenModal,
  openModal,
  allPermissions,
  selectedDepartment,
}) {
  const [userInput, setUserInput] = useState([]);
  const [userInitialInput, setUserInitialInput] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (selectedDepartment) {
      setUserInput(selectedDepartment);
      setUserInitialInput(selectedDepartment);
      const perms = selectedDepartment?.permissions?.map((item) => item.id);
      setSelectedPermissions(perms);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (!openModal) {
      setUserInput(userInitialInput);
      const perms = userInitialInput?.permissions?.map((item) => item.id);
      setSelectedPermissions(perms);
    }
  }, [openModal]);

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
    setSelectedPermissions((prev) => {
      const prevArray = Array.isArray(prev) ? prev : [];
      return prevArray.includes(id)
        ? prevArray.filter((permId) => permId !== id)
        : [...prevArray, id];
    });
  };

  const [updateDepartment, { data, isSuccess, isLoading, isError, error }] =
    useUpdateDepartmentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, id } = userInput;

    if (!name || !description) {
      Swal.fire({
        title: "Error",
        text: "Fill All Required Fields",
        icon: "error",
        button: "OK",
      });
    } else if (selectedPermissions?.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Select at least one permssion",
        icon: "error",
        button: "OK",
      });
    } else {
      // const result = await Swal.fire({
      //   title: "Are you sure you want to update this department?",
      //   icon: "warning",
      //   showCancelButton: true,
      //   confirmButtonColor: "#febf4c",
      //   cancelButtonColor: "#d33",
      //   confirmButtonText: "Yes, I'm sure",
      //   cancelButtonText: "No, cancel",
      // });

      // if (result.isConfirmed) {
      try {
        await updateDepartment({
          id,
          body: {
            name,
            description,
            permissions: selectedPermissions,
          },
        });
      } catch (error) {
        toast.error("Failed to update department", {
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
      // }
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      Swal.fire({
        title: "Success",
        text: "Department updated successfully",
        icon: "success",
        button: "OK",
        confirmButtonColor: "#00b17d",
      }).then((isOkay) => {
        if (isOkay) {
          setOpenModal(!openModal);
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
      title={"Department Details"}
      setOpenModal={setOpenModal}
      openModal={openModal}
    >
      <form
        onSubmit={handleSubmit}
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
            <div className="relative w-full md:h-[10vw] h-[30vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
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
            <div className="flex gap-[3vw] flex-wrap">
              {Object?.entries(groupedPermissions)?.map(
                ([category, subcategories]) => (
                  <div key={category} className="mb-[0.2vw]">
                    <div className="flex items-center gap-[0.5vw]">
                      <h2 className="text-[0.9vw] capitalize font-[600]">
                        {`Manage ${
                          category.replace("-", " ") === "verification requests"
                            ? "E-Check"
                            : category.replace("-", " ")
                        }`}
                      </h2>
                      <input
                        type="checkbox"
                        className="checkbox-design1"
                        onChange={(e) => {
                          const ids = Object.values(subcategories)
                            .flat()
                            .filter((item) => typeof item === "object")
                            .map((item) => item.id);
                          if (e.target.checked) {
                            setSelectedPermissions((prev) => {
                              const prevArray = Array.isArray(prev) ? prev : [];
                              return [...new Set([...prevArray, ...ids])];
                            });
                          } else {
                            setSelectedPermissions((prev) => {
                              const prevArray = Array.isArray(prev) ? prev : [];
                              return prevArray.filter(
                                (id) => !ids.includes(id)
                              );
                            });
                          }
                        }}
                        checked={Object.values(subcategories)
                          .flat()
                          .filter((item) => typeof item === "object")
                          .every(
                            (item) =>
                              Array.isArray(selectedPermissions) &&
                              selectedPermissions.includes(item.id)
                          )}
                      />
                    </div>
                    {Object?.entries(subcategories)?.map(
                      ([subcategory, actions]) => (
                        <div key={subcategory} className="ml-[0.5vw]">
                          <h3 className="text-[0.9vw] capitalize">
                            {subcategory.replace("-", " ")}
                          </h3>
                          {actions?.map(({ id, action }) => (
                            <div key={id} className="ml-[0.5vw]">
                              <label className="flex items-center gap-[0.3vw] text-[0.9vw] cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="checkbox-design1"
                                  checked={selectedPermissions?.includes(id)}
                                  onChange={() => handleCheckboxChange(id)}
                                />
                                {`${action.replace("-", " ")}`}
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

EditDepartment.propTypes = {
  setOpenModal: PropTypes.func.isRequired,
  openModal: PropTypes.bool.isRequired,
  allPermissions: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.number,
      })
    ),
  }),
  selectedDepartment: PropTypes.shape({
    permissions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
      })
    ),
  }),
};

export default EditDepartment;
