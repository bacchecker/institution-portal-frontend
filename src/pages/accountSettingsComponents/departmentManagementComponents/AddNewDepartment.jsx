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
import { FaAnglesRight } from "react-icons/fa6";
import { mutate } from "swr";
import axios from "@utils/axiosConfig";
import Swal from "sweetalert2";

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
      Swal.fire({
        title: "Error",
        text: "Fill All required fields",
        icon: "error",
        button: "OK",
      });
    } else {
      const data = {
        name: name,
        description: description,
        role: role,
      };
      try {
        const response = await axios.post("/institution/departments", data);
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          button: "OK",
          confirmButtonColor: "#00b17d",
        }).then((isOkay) => {
          if (isOkay) {
            mutate("/institution/departments");
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
          <Input
            size="sm"
            isRequired
            label="Name"
            type="text"
            name="name"
            className="mt-4"
            value={userInput?.name}
            onChange={handleUserInput}
          />
          <Select
            size="sm"
            isRequired
            label="Role"
            className="w-full mt-4"
            name="role"
            value={userInput?.role}
            onChange={handleUserInput}
            defaultSelectedKeys={[userInput?.role]}
          >
            {roles?.map((item) => (
              <SelectItem key={item.name}>{item.name}</SelectItem>
            ))}
          </Select>
          <Textarea
            isRequired
            label="Description"
            name="description"
            className="mt-4"
            value={userInput.description}
            onChange={handleUserInput}
          />
        </div>

        <div className="w-full flex items-center justify-between">
          <Button
            color="default"
            onClick={() => {
              setOpenDrawer(false);
            }}
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

export default AddNewDepartment;
