import React, { useEffect, useState } from "react";
import Drawer from "../../../../components/Drawer";
import { Button, Input, Spinner, Checkbox } from "@nextui-org/react";
import { mutate } from "swr";
import axios from "@utils/axiosConfig";
import Swal from "sweetalert2";

function AddNewRole({ setOpenDrawer, openDrawer, departmentId, fetchRoles }) {
  const initialUserInput = {
    name: "",
    permissions: [],
  };

  const [userInput, setUserInput] = useState(initialUserInput);
  const [drawerTitle, setDrawerTitle] = useState("Add New Role");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (!openDrawer) {
      setUserInput(initialUserInput); // Reset user input when drawer is closed
    }

    if (openDrawer && availablePermissions.length === 0) {
      fetchPermissions(); // Fetch permissions when the drawer is opened
    }
  }, [openDrawer]);

  const fetchPermissions = async () => {
    setIsLoadingPermissions(true);
    try {
      const response = await axios.get("/institution/institution-permissions");
      setAvailablePermissions(response.data.data || []);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to fetch permissions.",
        icon: "error",
        button: "OK",
      });
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedPermissions((prevSelectedPermissions) =>
      prevSelectedPermissions.includes(id)
        ? prevSelectedPermissions.filter((item) => item !== id)
        : [...prevSelectedPermissions, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const { name } = userInput;
    const permissions = selectedPermissions;
    const department_id = departmentId;

    if (!name || permissions.length === 0) {
      setIsSaving(false);
      Swal.fire({
        title: "Error",
        text: "Please fill all required fields.",
        icon: "error",
        button: "OK",
      });
      return;
    }

    const data = { name, permissions, department_id };

    try {
      const response = await axios.post("/institution/department-roles", data);
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        button: "OK",
        confirmButtonColor: "#00b17d",
      }).then((isOkay) => {
        if (isOkay) {
          fetchRoles()
          setOpenDrawer(false);
          setUserInput(initialUserInput);
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "An error occurred.",
        icon: "error",
        button: "OK",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Drawer title={drawerTitle} isOpen={openDrawer} setIsOpen={setOpenDrawer}>
      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col justify-between"
      >
        <div className="flex flex-col">
          {/* Name Input */}
          <Input
            size="sm"
            isRequired
            label="Role Name"
            type="text"
            name="name"
            className=""
            value={userInput.name}
            onChange={(e) =>
              setUserInput((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          {/* Permissions Section */}
          <div className="mt-6">
            <label className="mb-2 block font-semibold">Permissions</label>
            {isLoadingPermissions ? (
              <Spinner size="sm" color="danger" />
            ) : (
              availablePermissions.map((request) => (
                <label
                  key={request.uuid}
                  className={`cursor-pointer flex items-center rounded-full px-4 py-2 transition-all duration-200 mb-1 ${
                    selectedPermissions.includes(request.uuid)
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={request.uuid}
                    checked={selectedPermissions.includes(request.uuid)}
                    onChange={() => handleCheckboxChange(request.uuid)}
                    className="mr-2 accent-green-600"
                  />
                  {request.name}
                </label>
              ))
              
            )}
          </div>
        </div>

        <div className="w-full flex items-center justify-between">
          <Button
            color="default"
            onClick={() => setOpenDrawer(false)}
          >
            Close
          </Button>
          <Button
            type="submit"
            isLoading={isSaving}
            disabled={isSaving}
            color="danger"
          >
            Create
          </Button>
        </div>
      </form>
    </Drawer>
  );
}

export default AddNewRole;
