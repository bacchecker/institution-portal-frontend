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
import useSWR, { mutate } from "swr";
import { FaAnglesRight } from "react-icons/fa6";
import axios from "@utils/axiosConfig";
import Swal from "sweetalert2";

function AddNewUser({ setOpenDrawer, openDrawer, fetchData }) {
  const initialUserInput = {
    first_name: "",
    last_name: "",
    other_name: "",
    department: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  };
    const [userInput, setUserInput] = useState(initialUserInput);
    const [drawerTitle, setDrawerTitle] = useState("User Details");
    const [institutionDepartments, setInstitutionDepartments] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const genders = [
        { id: "male", name: "Male" },
        { id: "female", name: "Female" },
        { id: "other", name: "Other" },
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

    useEffect(() => {
        const fetchInstitutionDepartments = async () => {
            try {
                const response = await axios.get("/institution/departments");
                setInstitutionDepartments(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchInstitutionDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const { first_name, last_name, department, email, phone, address, other_name, gender } = userInput;

        if (!first_name || !last_name || !department || !email || !phone) {
        setIsSaving(false);
        Swal.fire({
            title: "Error",
            text: "Fill All required fields",
            icon: "error",
            button: "OK",
        });
        } else {
        const data = {
            first_name: first_name,
            last_name: last_name,
            other_name: other_name,
            department_id: department,
            email: email,
            phone: phone,
            address: address,
            gender: gender,
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
                fetchData()
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
            label={
              <>
                First Name
                <span className="text-[#ff0404]">*</span>
              </>
            }
            type="text"
            name="first_name"
            className=""
            value={userInput?.first_name}
            onChange={handleUserInput}
          />
          <Input
            size="sm"
            label={
              <>
               Last Name
                <span className="text-[#ff0404]">*</span>
              </>
            }
            type="text"
            name="last_name"
            className="mt-4"
            value={userInput?.last_name}
            onChange={handleUserInput}
          />
          <Input
            size="sm"
            label={
              <>
               Other Name
              </>
            }
            type="text"
            name="other_name"
            className="mt-4"
            value={userInput?.other_name}
            onChange={handleUserInput}
          />
          <Input
            size="sm"
            label={
              <>
               Email
                <span className="text-[#ff0404]">*</span>
              </>
            }
            type="text"
            name="email"
            className="mt-4"
            value={userInput?.email}
            onChange={handleUserInput}
          />
          <Input
            size="sm"
            label={
              <>
               Phone
                <span className="text-[#ff0404]">*</span>
              </>
            }
            type="text"
            name="phone"
            className="mt-4"
            value={userInput?.phone}
            onChange={handleUserInput}
          />
          <Select
            size="sm"
            label={
              <>
                Gender
              </>
            }
            className="w-full mt-4"
            name="gender"
            value={userInput?.gender}
            onChange={handleUserInput}
          >
            {genders?.map((item) => (
              <SelectItem key={item.id}>{item.name}</SelectItem>
            ))}
          </Select>
          <Select
            size="sm"
            label={
              <>
                Department
                <span className="text-[#ff0404]">*</span>
              </>
            }
            className="w-full mt-4"
            name="department"
            value={userInput?.department}
            onChange={handleUserInput}
          >
            {institutionDepartments?.map((item) => (
              <SelectItem key={item.id}>{item.name}</SelectItem>
            ))}
          </Select>
          
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

export default AddNewUser;
