import React, { useEffect, useState } from "react";
import SideModal from "@/components/SideModal";
import LoadItems from "@/components/LoadItems";
import Swal from "sweetalert2";
import { useUpdateDepartmentMutation } from "../../../redux/apiSlice";
import { toast } from "sonner";
import PropTypes from "prop-types";

function EditDepartment({ setOpenModal, openModal, allPermissions, selectedDepartment, fetchDepartmentData }) {
  const [userInput, setUserInput] = useState({});
  const [userInitialInput, setUserInitialInput] = useState({});
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Initialize form data and selected permissions
  useEffect(() => {
    if (selectedDepartment) {
      setUserInput(selectedDepartment);
      setUserInitialInput(selectedDepartment);

      // Extract assigned permission IDs
      const perms = selectedDepartment?.permissions?.map((perm) => perm.id) || [];
      setSelectedPermissions(perms);
    }
  }, [selectedDepartment]);

  // Reset form state when the modal closes
  useEffect(() => {
    if (!openModal) {
      setUserInput(userInitialInput);
      const perms = userInitialInput?.permissions?.map((perm) => perm.id) || [];
      setSelectedPermissions(perms);
    }
  }, [openModal]);

  // Group permissions by category and subcategory
  useEffect(() => {
    if (allPermissions?.length) {
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
    setSelectedPermissions((prev) => {
      const prevArray = Array.isArray(prev) ? prev : [];
      return prevArray.includes(id)
        ? prevArray.filter((permId) => permId !== id)
        : [...prevArray, id];
    });
  };

  const [updateDepartment, { isSuccess, isLoading, isError, error }] = useUpdateDepartmentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, id } = userInput;

    if (!name || !description) {
      Swal.fire("Error", "Fill all required fields", "error");
      return;
    }

    if (!selectedPermissions.length) {
      Swal.fire("Error", "Select at least one permission", "error");
      return;
    }

    try {
      await updateDepartment({
        id,
        body: {
          name,
          description,
          permissions: selectedPermissions,
        },
      });
    } catch (err) {
      toast.error("Failed to update department");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Department updated successfully");
      setOpenModal(false);
      fetchDepartmentData();
    }
  }, [isSuccess]);
  

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "An error occurred");
    }
  }, [isError]);

  return (
    <SideModal title="Edit Department" setOpenModal={setOpenModal} openModal={openModal}>
      <form onSubmit={handleSubmit} className="px-3 w-full overflow-auto pt-[1vw]">
        <div className="flex flex-col">
          {/* Department Name */}
          <div className="">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Department Name <span className="text-[#f1416c]">*</span>
            </h4>
            <input
              type="text"
              name="name"
              value={userInput.name || ""}
              onChange={handleUserInput}
              className="w-full border rounded-sm p-2 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="mt-4">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Description <span className="text-[#f1416c]">*</span>
            </h4>
            <textarea
              name="description"
              value={userInput.description || ""}
              onChange={handleUserInput}
              className="w-full h-[7vw] border rounded-sm p-3 focus:outline-none"
              rows="4"
            ></textarea>
          </div>

          {/* Permissions */}
          <div className="mt-4">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Permissions <span className="text-[#f1416c]">*</span>
            </h4>
            <div className="flex flex-wrap gap-4">
              {Object.entries(groupedPermissions || {}).map(([category, subcategories]) => (
                <div key={category} className="mb-4">
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
                  {Object.entries(subcategories || {}).map(([subcategory, actions]) => (
                    <div key={subcategory} className="ml-4">
                      <h3 className="text-xs capitalize">{subcategory.replace("-", " ")}</h3>
                      {actions.map(({ id, action }) => (
                        <label key={id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="checkbox-design1"
                            checked={selectedPermissions.includes(id)}
                            onChange={() => handleCheckboxChange(id)}
                          />
                          {action.replace("-", " ")}
                        </label>
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
          className="bg-[#FF0404] mt-4 w-full py-2 rounded-md text-white hover:bg-[#ef4545] disabled:bg-[#fa6767]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadItems color={"#ffffff"} size={15} />
              <h4 className="text-sm text-[#ffffff]">
                Updating...
              </h4>
            </div>
          ) : (
            <h4 className="text-sm text-[#ffffff]">
              Update Department
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
  allPermissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedDepartment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    permissions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default EditDepartment;
