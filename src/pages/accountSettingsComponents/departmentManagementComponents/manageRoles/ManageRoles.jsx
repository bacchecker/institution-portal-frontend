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
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa6";
import DepartmentManagement from "../../DepartmentManagement";

function ManageRoles({ setOpenDrawer, openDrawer, selectedData }) {
  const initialUserInput = {
    name: "",
    permission: [],
  };
  const [userInput, setUserInput] = useState(initialUserInput);
  const [drawerTitle, setDrawerTitle] = useState("Manage Roles");
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openAddRoleDrawer, setOpenAddRoleDrawer] = useState(false);
  const [openEditRoleDrawer, setOpenEditRoleDrawer] = useState(false);
  const [departmentRoles, setDepartmentRoles] = useState([]);
  const [selectedRoleData, setSelectedRoleData] = useState({});
  const [refreshDepartments, setRefreshDepartments] = useState(false);
  const deleteDisclosure = useDisclosure();
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (selectedData) {
      setUserInput(selectedData);
    }
    
  }, [selectedData]);
    
  const fetchRoles = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/institution/department-roles/${selectedData.id}`,{
        params: {
          search,
          page: currentPage,
          ...(sortBy && { sort_by: sortBy }),
          ...(sortOrder && { sort_order: sortOrder }),
        },
      });

      const departmentRoles = response.data.data

      setDepartmentRoles(departmentRoles.data);
      setCurrentPage(departmentRoles.current_page);
      setLastPage(departmentRoles.last_page);
      setTotal(departmentRoles.total);
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

  useEffect(() => {
    fetchRoles();
  }, [search, currentPage, sortBy, sortOrder]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= lastPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`py-1.5 px-2.5 border rounded-lg ${
            currentPage === i ? "bg-bChkRed text-white" : "bg-white text-gray-800"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <Drawer title={drawerTitle} isOpen={openDrawer} setIsOpen={setOpenDrawer} classNames="w-[600px]">
        <div className="relative">
            <div className="bg-gray-200 -mt-4 rounded-md text-right px-4 py-2">
                <p className="font-semibold text-sm uppercase">{selectedData.name}</p>
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
            {refreshDepartments && (
              <DepartmentManagement />
            )}
            
        </div>

        <section className="md:w-full w-[100vw] min-h-[60vh] shadow-md border mt-2 rounded-lg">
         
              <CustomTable
                columns={["Name", "Permissions", "Actions"]}
                loadingState={isLoading}
                columnSortKeys={{
                  Name: "name",
                }}
                sortBy={sortBy}
                sortOrder={sortOrder}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
              >
                {departmentRoles?.map((item) => (
                  <TableRow key={item?.id}>
                    <TableCell>{item?.name}</TableCell>
                    <TableCell>
                      {item?.permissions
                          ?.map(
                              (perm) =>
                                  perm.permission?.name.charAt(0).toUpperCase() +
                                  perm.permission?.name.slice(1).toLowerCase()
                          )
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
              <section>
            <div className="flex justify-between items-center mt-4 mx-2">
              <div>
                <span className="text-gray-600 font-medium text-sm">
                  Page {currentPage} of {lastPage} - ({total} entries)
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white"
                >
                  <FaChevronLeft size={12} />
                </button>

                {renderPageNumbers()}

                <button
                  disabled={currentPage === lastPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white disabled:border-0"
                >
                  <FaChevronRight size={12} />
                </button>
              </div>
            </div>
          </section>

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
