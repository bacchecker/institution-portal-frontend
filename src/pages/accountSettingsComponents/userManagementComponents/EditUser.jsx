import React, { useEffect, useState } from "react";
import Drawer from "../../../components/Drawer";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { FaAnglesRight } from "react-icons/fa6";
import axios from "@utils/axiosConfig";
import Swal from "sweetalert2";

function EditUser({ setOpenDrawer, openDrawer, selectedData, fetchData }) {
  const [userInput, setUserInput] = useState({});
  const [userId, setUserId] = useState("");
  const [userInitialInput, setUserInitialInput] = useState({});
  const [drawerTitle, setDrawerTitle] = useState("User Details");
  const [institutionDepartments, setInstitutionDepartments] = useState(null);
  const [roles, setRoles] = useState([]); // For roles based on department
  const [isSaving, setIsSaving] = useState(false);

  const genders = [
    { id: "male", name: "Male" },
    { id: "female", name: "Female" },
    { id: "other", name: "Other" },
  ];

  // Pre-fill form when selectedData is passed
  useEffect(() => {
    if (selectedData) {
      setUserInput(selectedData);
      setUserId(selectedData.id);
      setUserInitialInput(selectedData);

      // Fetch roles for the user's current department
      if (selectedData.department_id) {
        fetchRolesForDepartment(selectedData.department_id);
      }
    } else {
      setUserInput(userInitialInput);
    }
  }, [selectedData]);

  // Fetch departments on component mount
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

  // Fetch roles when the department changes
  useEffect(() => {
    if (userInput.department_id) {
      fetchRolesForDepartment(userInput.department_id);
    }
  }, [userInput.department_id]);

  const fetchRolesForDepartment = async (departmentId) => {
    try {
      const response = await axios.get(
        `/institution/department-roles/${departmentId}`
      );
      const fetchedRoles = response.data.data || [];
      setRoles(fetchedRoles);

      // Ensure the current role_id exists in the fetched roles
      if (!fetchedRoles.some((role) => role.id === userInput.role_id)) {
        setUserInput((prev) => ({ ...prev, role_id: "" }));
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
    }
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const {
      first_name,
      last_name,
      department_id,
      role_id,
      email,
      phone,
      address,
      other_name,
    } = userInput;

    // Check if required fields are filled
    if (!first_name || !last_name || !department_id || !role_id || !email || !phone) {
      setIsSaving(false);
      Swal.fire({
        title: "Error",
        text: "Fill all required fields",
        icon: "error",
        button: "OK",
      });
      return;
    }

    // Prepare data for POST request
    const data = {
      first_name,
      last_name,
      other_name,
      department_id,
      role_id,
      email,
      phone,
      address,
    };

    try {
      const response = await axios.post(`/institution/update-user/${userId}`, data);

      // Success alert
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        button: "OK",
        confirmButtonColor: "#00b17d",
      }).then(async (isOkay) => {
        if (isOkay) {
          await fetchData();
          setOpenDrawer(false);
          setUserInput(userInitialInput);
        }
      });
    } catch (error) {
      // Handle error and provide feedback to the user
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "An error occurred while updating the user.",
        icon: "error",
        button: "OK",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setUserInput(userInitialInput);
  };
  
  return (
    <Drawer title={drawerTitle} isOpen={openDrawer} setIsOpen={setOpenDrawer}>
      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col justify-between"
      >
        <div className="flex flex-col">
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
            label="Other Name"
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
            selectedKeys={[userInput?.gender]}
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
            name="department_id"
            selectedKeys={[userInput?.department_id]}
            onChange={(e) =>
              setUserInput((prev) => ({ ...prev, department_id: e.target.value }))
            }
          >
            {institutionDepartments?.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </Select>

          {/* Role Selection */}
          <Select
            size="sm"
            isRequired
            label="Role"
            className="w-full mt-4"
            name="role_id"
            selectedKeys={[userInput?.role?.role_id]}
            onChange={(e) =>
              setUserInput((prev) => ({ ...prev, role_id: e.target.value }))
            }
          >
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="w-full flex items-center justify-between">
          <Button
            className="py-2.5 font-medium rounded-[0.3rem]"
            color="default"
            onClick={() => {
              setOpenDrawer(false);
              handleReset();
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
                <span className="ml-2">Updating...</span>
              </>
            ) : (
              <>
                Update
                <FaAnglesRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

export default EditUser;
