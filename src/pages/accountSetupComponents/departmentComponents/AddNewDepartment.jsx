import React, { useEffect, useState } from "react";
import Drawer from "../../../components/Drawer";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { toast } from "sonner";
import { FaAnglesRight } from "react-icons/fa6";
import { mutate } from "swr";
import axios from "@utils/axiosConfig";

function AddNewDepartment({ setOpenDrawer, openDrawer }) {
  const initialUserInput = {
    name: "",
    description: "",
    role: "",
  };
  const [userInput, setUserInput] = useState(initialUserInput);
  const [drawerTitle, setDrawerTitle] = useState("Department Details");
  const [isSaving, setIsSaving] = useState(false);
  const roles = [
    { name: "Admin" },
    { name: "Finance" },
    { name: "Customer Service" },
    { name: "HR" },
  ];

  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  console.log("role", userInput);

  useEffect(() => {
    if (!openDrawer) {
      setUserInput(initialUserInput);
    }
  }, [openDrawer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const { name, description, role } = userInput;

    if (!name || !description || !role) {
      setIsSaving(false);
      toast.error("Fill All required fields", {
        position: "top-right",
        autoClose: 1202,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      const data = {
        name: name,
        description: description,
        role: role,
      };
      try {
        const response = await axios.post("/institution/departments", data);
        toast.success(response.data.message);
        mutate("/institution/departments");
        setOpenDrawer(!openDrawer);
        setUserInput(initialUserInput);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
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
          <Input
            size="sm"
            label={
              <>
                Name
                <span className="text-[#ff0404]">*</span>
              </>
            }
            type="text"
            name="name"
            className="mt-4"
            value={userInput?.name}
            onChange={handleUserInput}
          />
          <Select
            size="sm"
            label={
              <>
                Role
                <span className="text-[#ff0404]">*</span>
              </>
            }
            className="w-full mt-4"
            name="role"
            value={userInput?.role}
            onChange={handleUserInput}
          >
            {roles?.map((item) => (
              <SelectItem key={item.name}>{item.name}</SelectItem>
            ))}
          </Select>
          <Textarea
            label={
              <>
                Description<span className="text-[#ff0404]">*</span>
              </>
            }
            name="description"
            className="mt-4"
            value={userInput.description}
            onChange={handleUserInput}
          />
        </div>

        <div className="w-full flex items-center justify-between">
          <Button
            className="py-2.5 font-medium rounded-[0.3rem]"
            color="default"
            onClick={() => {
              setOpenDrawer(false);
              reset();
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

export default AddNewDepartment;
