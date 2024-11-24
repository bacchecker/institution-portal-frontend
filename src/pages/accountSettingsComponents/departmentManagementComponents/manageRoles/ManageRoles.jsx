import React, { useEffect, useState } from "react";
import Drawer from "../../../../components/Drawer";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  TableCell,
  TableRow,
  useDisclosure
} from "@nextui-org/react";
import { mutate } from "swr";
import axios from "@utils/axiosConfig";
import Swal from "sweetalert2";
import CustomTable from "@components/CustomTable";
import AddNewRole from "./AddNewRole";
import Elipsis from "../../../../assets/icons/elipsis";
import EditRole from "./EditRole";
import DeleteModal from "@components/DeleteModal";
import { FaPlus } from "react-icons/fa6";

function ManageRoles({ setOpenDrawer, openDrawer, selectedData }) {
  const initialUserInput = {
    name: "",
    permission: [],
  };
  const [userInput, setUserInput] = useState(initialUserInput);
  const [drawerTitle, setDrawerTitle] = useState("Manage Roles");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openAddRoleDrawer, setOpenAddRoleDrawer] = useState(false);
  const [openEditRoleDrawer, setOpenEditRoleDrawer] = useState(false);
  const [departmentRoles, setDepartmentRoles] = useState([]);
  const [selectedRoleData, setSelectedRoleData] = useState({});
  const deleteDisclosure = useDisclosure();

  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (selectedData) {
      setUserInput(selectedData);
    }
    
    
  }, [selectedData]);
    
  const fetchRoles = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/institution/department-roles/${selectedData.id}`);

      const departmentRoles = response.data

      setDepartmentRoles(departmentRoles.data);
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if(openDrawer){
        fetchRoles();
    }
  }, [openDrawer]);

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
    } else {
      const data = {
        name: name,
        description: description,
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
    <Drawer title={drawerTitle} isOpen={openDrawer} setIsOpen={setOpenDrawer} classNames="w-[600px]">
        <div className="relative">
            <div className="bg-gray-200 h-14 -mt-4 rounded-md text-right px-4 pt-1">
                <p className="font-medium text-base">{selectedData.name}</p>
                <p className="text-sm text-gray-600">{selectedData.description}</p>
            </div>
            <div className="absolute top-4 left-4 bg-white shadow-md rounded-full w-14 h-14 text-3xl text-bChkRed font-semibold flex items-center justify-center">{selectedData.name?.charAt(0)}</div>
            <div className="flex justify-between">
                <div className=""></div>
                <button
                    type="button"
                    onClick={() => {
                        setOpenAddRoleDrawer(true);
                    }}
                    className="flex items-center justify-center space-x-2 bg-bChkRed text-white rounded-md px-4 py-1.5 text-sm -right mt-2">
                        <FaPlus /><p>Add Role</p>
                </button>
            </div>
            
            <AddNewRole
                fetchRoles = {fetchRoles}
                departmentId = {userInput.id}
                setOpenDrawer={setOpenAddRoleDrawer}
                openDrawer={openAddRoleDrawer}
            />

            <EditRole
                setOpenDrawer={setOpenEditRoleDrawer}
                openDrawer={openEditRoleDrawer}
                selectedData={selectedRoleData}
                fetchRoles={fetchRoles}
            />
        </div>

        <section className="md:w-full w-[100vw] min-h-[60vh] shadow-md">
            
          {isLoading ? (
            <div className="w-full h-[5rem] flex justify-center items-center">
              <Spinner size="sm" color="danger" />
            </div>
          ) : (
            <>
              <CustomTable
                columns={["Name", "Permissions", "Actions"]}
              >
                {departmentRoles?.map((item) => (
                  <TableRow key={item?.id}>
                    <TableCell>{item?.name}</TableCell>
                    <TableCell>
                        {item?.permissions
                            ?.map((perm) => perm.permission?.name)
                            .join(", ") || "No Permissions"}
                    </TableCell>

                    <TableCell className="flex items-center h-16 gap-3">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="bordered" size="sm" isIconOnly>
                            <Elipsis />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                          
                          <DropdownItem
                            key="edit"
                            onClick={() => {
                              setSelectedRoleData(item);
                              setOpenEditRoleDrawer(true);
                            }}
                          >
                            Update
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            onClick={() => {
                              deleteDisclosure.onOpen();
                              setSelectedRoleData(item);
                            }}
                          >
                            Delete
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </CustomTable>
            </>
          )}
         <DeleteModal
            disclosure={deleteDisclosure}
            title="Delete Role"
            processing={isDeleting}
            onButtonClick={async () => {
                setIsDeleting(true);
                try {
                const response = await axios.delete(
                    `/institution/department-delete-role/${selectedRoleData?.id}`
                );
                deleteDisclosure.onClose();
                Swal.fire({
                    title: "Success",
                    text: response.data.message,
                    icon: "success",
                    button: "OK",
                    confirmButtonColor: "#00b17d",
                }).then((isOkay) => {
                    if (isOkay) {
                    fetchRoles()
                    setIsDeleting(false);
                    }
                });
                } catch (error) {
                console.log(error);
                setErrors(error.response.data.message);
                setIsDeleting(false);
                }
            }}
            >
            <p className="font-quicksand">
                Are you sure you want to delete this role?{" "}
                <span className="font-semibold">{selectedRoleData?.name}</span>
            </p>
            </DeleteModal>

        </section>
    </Drawer>
  );
}

export default ManageRoles;
