import React, { useEffect, useState } from "react";
import SideModal from "@/components/SideModal";
import Swal from "sweetalert2";
import axios from "@/utils/axiosConfig";

import LoadItems from "@/components/LoadItems";
import { toast } from "sonner";

function AddNewDepartment({ setOpenModal, openModal, allPermissions, fetchDepartmentData }) {
  const initialUserInput = {
    name: "",
    description: "",
  };
  const [userInput, setUserInput] = useState(initialUserInput);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!openModal) {
      setUserInput(initialUserInput);
      setSelectedPermissions([]);
    }
  }, [openModal]);


  useEffect(() => {
    if (allPermissions) {
      const groups = allPermissions.reduce((acc, permission) => {
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

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true)
      const { name, description } = userInput;
    
      // Validation
      if (!name || !description) {
        toast.error("Fill all required fields", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    
      if (selectedPermissions?.length === 0) {
        toast.error("Select at least one permission", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    
      // Submit the department data
      try {
        await axios.post("/institution/departments", {
          name,
          description,
          permissions: selectedPermissions,
        });
        setIsLoading(false)
        toast.success("Department created successfully", {
          position: "top-right",
          autoClose: 3000,
        });
    
        // Optionally close the modal or reset the form
        setOpenModal(false);
        setUserInput({ name: "", description: "" });
        setSelectedPermissions([]);
        if (fetchDepartmentData) fetchDepartmentData();
      } catch (error) {
        setIsLoading(false)
        toast.error(error.response?.data?.message || "Failed to create department", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

  return (
    <SideModal
      title={"Department Details"}
      setOpenModal={setOpenModal}
      openModal={openModal}
    >
      <form
        onSubmit={handleSubmit}
        className="md:px-[1vw] px-[5vw] w-full overflow-auto"
      >
        <div className="flex flex-col">
          <div className="mt-4">
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
          <div className="mt-4">
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
            {Object.entries(groupedPermissions || {}).map(([category, subcategories]) => (
              <div key={category} className="mb-[0.2vw]">
                <div className="flex items-center gap-[0.5vw]">
                  <h2 className="text-xs capitalize font-[600]">
                    {`Manage ${
                      category.replace("-", " ") === "e check"
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
                        setSelectedPermissions((prev) => [
                          ...new Set([...prev, ...ids]),
                        ]);
                      } else {
                        setSelectedPermissions((prev) =>
                          prev.filter((id) => !ids.includes(id))
                        );
                      }
                    }}
                    checked={Object.values(subcategories)
                      .flat()
                      .filter((item) => typeof item === "object")
                      .every((item) => selectedPermissions.includes(item.id))}
                  />
                </div>
                {Object.entries(subcategories || {})
                  .filter(
                    ([subcategory]) => !["roles", "permissions"].includes(subcategory)
                  )
                  .map(([subcategory, actions]) => (
                    <div key={subcategory} className="ml-[0.5vw] mt-[1vw]">
                      <h3 className="text-xs capitalize">
                        {subcategory.replace("-", " ")}
                      </h3>
                      {actions.map(({ id, action }) => (
                        <div key={id} className="ml-[0.5vw]">
                          <label className="flex items-center gap-[0.3vw] text-[0.9vw] cursor-pointer">
                            <input
                              type="checkbox"
                              className="checkbox-design1"
                              checked={selectedPermissions.includes(id)}
                              onChange={() => handleCheckboxChange(id)}
                            />
                            {`${action.replace("-", " ")}`}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            ))}

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
