import React, { useEffect, useState } from "react";
import Drawer from "../../../components/Drawer";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import axios from "@utils/axiosConfig";
import Swal from "sweetalert2";
import { FaAnglesRight } from "react-icons/fa6";

function AddNewUser({ setOpenDrawer, openDrawer, fetchData }) {
  const initialUserInput = {
    first_name: "",
    last_name: "",
    other_name: "",
    department: "",
    role: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  };

  const [userInput, setUserInput] = useState(initialUserInput);
  const [drawerTitle, setDrawerTitle] = useState("User Details");
  const [institutionDepartments, setInstitutionDepartments] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const genders = [
    { id: "male", name: "Male" },
    { id: "female", name: "Female" },
    { id: "other", name: "Other" },
  ];

  const handleUserInput = (e) => {
    setUserInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (!openDrawer) {
      setUserInput(initialUserInput);
      setSelectedPermissions([])
    }
  }, [openDrawer]);

  // Fetch departments when the component loads
  useEffect(() => {
    const fetchInstitutionDepartments = async () => {
      try {
        const response = await axios.get("/institution/departments");
        setInstitutionDepartments(response.data.departments.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInstitutionDepartments();
  }, []);

  // Fetch permissions when a department is selected
  useEffect(() => {
    const fetchPermissionsForDepartment = async () => {
      if (!userInput.department) return; // Skip if no department is selected
      try {
        const response = await axios.get(
          `/institution/department-permissions/${userInput.department}`
        );
        setPermissions(response.data.permissions || []);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setPermissions([]); // Reset permissions on error
      }
    };

    fetchPermissionsForDepartment();
  }, [userInput.department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
  
    const {
      first_name,
      last_name,
      department,
      email,
      phone,
      address,
      other_name,
      gender,
    } = userInput;
  
    if (!first_name || !last_name || !department || !email || !phone) {
      setIsSaving(false);
      Swal.fire({
        title: "Error",
        text: "Fill all required fields",
        icon: "error",
        button: "OK",
      });
      return;
    }
  
    if (selectedPermissions.length === 0) {
      setIsSaving(false);
      Swal.fire({
        title: "Error",
        text: "Please select at least one permission",
        icon: "error",
        button: "OK",
      });
      return;
    }
  
    const data = {
      first_name,
      last_name,
      other_name,
      department_id: department,
      email,
      phone,
      address,
      gender,
      permissions: selectedPermissions,
    };
  
    try {
      const response = await axios.post("/institution/store-users", data);
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        button: "OK",
        confirmButtonColor: "#00b17d",
      }).then((isOkay) => {
        if (isOkay) {
          fetchData();
          setOpenDrawer(!openDrawer);
          setUserInput(initialUserInput);
          setSelectedPermissions([])
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
    <Drawer title={drawerTitle} isOpen={openDrawer} setIsOpen={setOpenDrawer} classNames="w-[500px]">
      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col justify-between"
      >
        <div className="flex flex-col -mt-4">
          {/* User Details */}
          <Input
            size="sm"
            isRequired
            label="First Name"
            type="text"
            name="first_name"
            value={userInput?.first_name}
            onChange={handleUserInput}
          />
          <Input
            size="sm"
            isRequired
            label="Last Name"
            type="text"
            name="last_name"
            className="mt-4"
            value={userInput?.last_name}
            onChange={handleUserInput}
          />
          <Input
            size="sm"
            label={<>Other Name</>}
            type="text"
            name="other_name"
            className="mt-4"
            value={userInput?.other_name}
            onChange={handleUserInput}
          />
          <Input
            size="sm"
            isRequired
            label="Email"
            type="text"
            name="email"
            className="mt-4"
            value={userInput?.email}
            onChange={handleUserInput}
          />
          <Input
            size="sm"
            isRequired
            label="Phone"
            type="text"
            name="phone"
            className="mt-4"
            value={userInput?.phone}
            onChange={handleUserInput}
          />

          {/* Gender Selection */}
          <Select
            size="sm"
            label="Gender"
            className="w-full mt-4"
            name="gender"
            value={userInput?.gender}
            onChange={(e) =>
              setUserInput((prev) => ({ ...prev, gender: e.target.value }))
            }
          >
            {genders.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </Select>

          {/* Department Selection */}
          <Select
            size="sm"
            isRequired
            label="Department"
            className="w-full mt-4"
            name="department"
            value={userInput?.department}
            onChange={(e) =>
              setUserInput((prev) => ({ ...prev, department: e.target.value }))
            }
          >
            {institutionDepartments?.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </Select>
          <div className="my-4 px-2">
            <h4 className="text-md font-semibold mb-2">Select User's Permissions</h4>
            {permissions.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {permissions.map((permission) => (
                  <label key={permission.id} className="flex items-center">
                    <input
                      type="checkbox"
                      value={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions((prev) => [...prev, permission.id]);
                        } else {
                          setSelectedPermissions((prev) =>
                            prev.filter((id) => id !== permission.id)
                          );
                        }
                      }}
                      className="mr-2"
                    />
                    {permission.name.replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No permissions available for the selected department.</p>
            )}
          </div>


        </div>

        {/* Buttons */}
        <div className="w-full flex items-center justify-between">
          <Button
            className="py-2.5 font-medium rounded-[0.3rem]"
            color="default"
            onClick={() => {
              setOpenDrawer(false);
              setUserInput(initialUserInput);
            }}
          >
            Close
          </Button>

          <button
            type="submit"
            className={`flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium ${
              isSaving && "cursor-not-allowed bg-[#f77f7f]"
            }`}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Spinner size="sm" color="white" />
                <span className="ml-2">Creating...</span>
              </>
            ) : (
              <>
                Create
                <FaAnglesRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

export default AddNewUser;
