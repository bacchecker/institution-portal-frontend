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
  const [roles, setRoles] = useState([]); // To store roles for the selected department
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
    }
  }, [openDrawer]);

  // Fetch departments when the component loads
  useEffect(() => {
    const fetchInstitutionDepartments = async () => {
      try {
        const response = await axios.get("/institution/departments");
        setInstitutionDepartments(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInstitutionDepartments();
  }, []);

  // Fetch roles when a department is selected
  useEffect(() => {
    const fetchRolesForDepartment = async () => {
      if (!userInput.department) return; // Skip if no department is selected
      try {
        const response = await axios.get(
          `/institution/department-roles/${userInput.department}`
        );
        setRoles(response.data.data || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]); // Reset roles on error
      }
    };

    fetchRolesForDepartment();
  }, [userInput.department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const {
      first_name,
      last_name,
      department,
      role,
      email,
      phone,
      address,
      other_name,
      gender,
    } = userInput;

    if (!first_name || !last_name || !department || !role || !email || !phone) {
      setIsSaving(false);
      Swal.fire({
        title: "Error",
        text: "Fill all required fields",
        icon: "error",
        button: "OK",
      });
    } else {
      const data = {
        first_name,
        last_name,
        other_name,
        department_id: department,
        role_id: role,
        email,
        phone,
        address,
        gender,
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
          }
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message,
          icon: "error",
          button: "OK",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Drawer title={drawerTitle} isOpen={openDrawer} setIsOpen={setOpenDrawer}>
      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col justify-between"
      >
        <div className="flex flex-col">
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

          {/* Role Selection */}
          <Select
            size="sm"
            label="Role"
            className="w-full my-4"
            name="role"
            value={userInput?.role}
            onChange={(e) =>
              setUserInput((prev) => ({ ...prev, role: e.target.value }))
            }
          >
            {roles?.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </Select>
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
