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
  const [userInput, setUserInput] = useState([]);
  const [userId, setUserId] = useState("");
  const [userInitialInput, setUserInitialInput] = useState([]);
  const [drawerTitle, setDrawerTitle] = useState("User Details");
  const [institutionDepartments, setInstitutionDepartments] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const genders = [
    { id: "male", name: "Male" },
    { id: "female", name: "Female" },
    { id: "other", name: "Other" },
  ];

    useEffect(() => {
        if (selectedData) {
        setUserInput(selectedData);
        setUserId(selectedData.id);
        setUserInitialInput(selectedData);
        }else{setUserInput(userInitialInput);}
    }, [selectedData]);
    
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
    
        const { first_name, last_name, department_id, email, phone, address, other_name } = userInput;
    
        // Check if required fields are filled
        if (!first_name || !last_name || !department_id || !email || !phone) {
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
        first_name: first_name,
        last_name: last_name,
        other_name: other_name,
        department_id: department_id,
        email: email,
        phone: phone,
        address: address,
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
            setOpenDrawer(!openDrawer);
            setUserInput(initialUserInput);
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
    setUserInput((prev) => {
      const resetInput = {};
      for (const key in prev) {
        if (prev.hasOwnProperty(key)) {
          resetInput[key] = null;
        }
      }
      return resetInput;
    });
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                isDisabled
                label={
                <>
                    Gender
                </>
                }
                className="w-full mt-4"
                name="gender"
                selectedKeys={[userInput?.gender]}
                defaultSelectedKeys={[userInput?.gender || '']}
                onChange={handleUserInput}
            >
                {genders?.map((item) => (
                <SelectItem key={item.id}>{item.name}</SelectItem>
                ))}
            </Select>
            <Select
                size="sm"
                label="Department"
                className="w-full mt-4"
                name="department_id"
                selectedKeys={[userInput?.department_id || userInput?.department?.id]}
                defaultSelectedKeys={[userInput?.department_id || userInput?.department?.id]}
                onChange={handleUserInput}
            >
                {institutionDepartments?.map((item) => (
                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
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
