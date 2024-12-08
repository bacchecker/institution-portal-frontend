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
import axios from "@utils/axiosConfig";
import Swal from "sweetalert2";

function AddNewDepartment({ setOpenDrawer, openDrawer, fetchDepartments }) {
  const initialUserInput = {
    name: "",
    description: "",
  };
  const [userInput, setUserInput] = useState(initialUserInput);
  const [drawerTitle, setDrawerTitle] = useState("Department Details");
  const [isSaving, setIsSaving] = useState(false);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    // Group permissions by category and subcategory
    const groups = availablePermissions.reduce((acc, permission) => {
      const parts = permission.name.split(".");
  
      // Extract category, subcategory, and action dynamically
      const category = parts[0]; // Always the first part
      const subcategory = parts.length === 3 ? parts[1] : null; // Only include subcategory if it's present
      const action = parts.length === 3 ? parts[2] : parts[1]; // Action is the last part
  
      // Initialize grouping structure
      if (!acc[category]) acc[category] = {};
      if (subcategory) {
        // Group under subcategory if it exists
        if (!acc[category][subcategory]) acc[category][subcategory] = [];
        acc[category][subcategory].push({ id: permission.id, action });
      } else {
        // Group directly under the category if no subcategory
        if (!acc[category].actions) acc[category].actions = [];
        acc[category].actions.push({ id: permission.id, action });
      }
  
      return acc;
    }, {});
  
    setGroupedPermissions(groups);
  }, [availablePermissions]);
  
  

  const handleCheckboxChange = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((permId) => permId !== id) : [...prev, id]
    );
  };

  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  

  useEffect(() => {
    if (!openDrawer) {
      setUserInput(initialUserInput);
      setSelectedPermissions([]);
    }

  }, [openDrawer]);


  useEffect(() => {
    const fetchInstitutionPermissions = async () => {
      try {
        const response = await axios.get("/institution/institution-permissions");
        setAvailablePermissions(response.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInstitutionPermissions();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
  
    const { name, description } = userInput;
  
    if (!name || !description) {
      setIsSaving(false);
      Swal.fire({
        title: "Error",
        text: "Fill all required fields",
        icon: "error",
        button: "OK",
      });
      return; // Ensure the function exits after showing the error
    }
  
    if (selectedPermissions.length === 0) {
      setIsSaving(false);
      Swal.fire({
        title: "Error",
        text: "Please select at least one permission",
        icon: "error",
        button: "OK",
      });
      return; // Ensure the function exits after showing the error
    }
  
    const data = {
      name: name,
      description: description,
      permissions: selectedPermissions, // Add selectedPermissions to the data
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
          fetchDepartments();
          setOpenDrawer(!openDrawer);
          setUserInput(initialUserInput);
          setSelectedPermissions([])
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
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
          <Input
            size="sm"
            isRequired
            label="Name"
            type="text"
            name="name"
            value={userInput?.name}
            onChange={handleUserInput}
          />
          <Textarea
            isRequired
            label="Description"
            name="description"
            className="mt-4"
            value={userInput.description}
            onChange={handleUserInput}
          />
          <div className="mt-4">
            <h2 className="font-bold uppercase mt-2 text-base text-bChkRed">Permissions</h2>
            {Object.entries(groupedPermissions).map(([category, subcategories]) => (
              <div key={category} style={{ marginBottom: "2rem" }}>
                <h2 className="font-semibold">{`MANAGE ${category.replace("-", " ").toUpperCase()}`}</h2>
                {Object.entries(subcategories).map(([subcategory, actions]) => (
                  <div key={subcategory} style={{ marginLeft: "1rem" }}>
                    <h3>{subcategory.replace("-", " ").toUpperCase()}</h3>
                    {actions.map(({ id, action }) => (
                      <div key={id} style={{ marginLeft: "1.5rem" }}>
                        <label className="flex space-x-2 items-center">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(id)}
                            onChange={() => handleCheckboxChange(id)}
                          />
                          {`Can ${action.replace("-", " ")}`}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
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
