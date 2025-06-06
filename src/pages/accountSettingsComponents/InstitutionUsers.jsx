import React, { useState, useEffect } from "react";
import {
  TableCell,
  TableRow,
  Popover, PopoverTrigger, PopoverContent,
  Button,
} from "@nextui-org/react";
import CustomTable from "@/components/CustomTable";
import axios from "@/utils/axiosConfig";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import { MdDelete, MdEdit, MdMailLock, MdMoreVert, MdOutlineFilterAlt, MdOutlineFilterAltOff } from "react-icons/md";
import AddNewUser from "../accountSettingsComponents/institutionUserComponent/AddNewUser";
import EditUser from "../accountSettingsComponents/institutionUserComponent/EditUser";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { BsTrash3 } from "react-icons/bs";
import { NavLink } from "react-router-dom";

export default function InstitutionUsers() {
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState([]);
    const [allPermissions, setAllPermissions] = useState([]);
    const [institutionDepartments, setInstitutionDepartments] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [canAddUser, setCanAddUser] = useState(0);

    const closePopover = () => setIsPopoverOpen(false);
    const [filters, setFilters] = useState({
        search: "",
        start_date: null,
        end_date: null,
    });
    const [submittedFilters, setSubmittedFilters] = useState({});

    const fetchUserData = async () => {
      setIsLoading(true)
      try {
      const response = await axios.get("/institution/users", {
          params: {
          ...submittedFilters,
          page: currentPage,
          sort_by: sortBy,
          sort_order: sortOrder,
          },
      });

        const userData = response.data.institutionUsers;

        setUserData(userData.data);
        setCurrentPage(userData.current_page);
        setLastPage(userData.last_page);
        setTotal(userData.total);
        setIsLoading(false);

        } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
        }
    };

    

    useEffect(() => {
        const fetchDepartmentData = async () => {
            setIsLoading(true)
            try {
            const response = await axios.get("/institution/departments");

            setInstitutionDepartments( response.data);
            } catch (error) {
            console.error("Error fetching departments:", error);
            throw error;
            }
        }; 
        fetchDepartmentData();
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [submittedFilters, currentPage, sortBy, sortOrder]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmittedFilters({ ...filters });
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchPermissions();
        fetchCanUser();
    }, []);

    const fetchPermissions = async () => {
        try {
            const response = await axios.get('/institution/institution-permissions');

            setAllPermissions(response.data.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const fetchCanUser = async () => {
      try {
          const response = await axios.get('/institution/subscriptions/user-dept');
          const responseData = response.data.data;
          setCanAddUser(responseData.can_add_user);
      } catch (error) {
          console.error('Error fetching tickets:', error);
      }
    };

    const handleUser = (user) => {
        setOpenEditModal(true);
        setSelectedUser(user);
    };

    const handleClickDelete = async (user, i) => {
        try {
        // Display confirmation dialog
        const result = await Swal.fire({
            title: "Are you sure you want to delete this user?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#febf4c",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I'm sure",
            cancelButtonText: "No, cancel",
        });

        if (result.isConfirmed) {
            const response = await axios.delete(`/institution/users/${user?.id}`);

            toast.success(response.data.message);
            fetchUserData();
            fetchCanUser();
        }
        } catch (error) {
        // Error feedback
        toast.error(error.response?.data?.message || "Failed to delete user.", "error");
        }
    };

    return (
        <div>
            <section className="mb-4">
                <div className="relative md:w-full flex bg-gray-100 justify-between items-center w-full mx-auto rounded-none shadow-none border-none p-4">
                    <div className="w-full flex items-center justify-between">
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-row gap-3 items-center"
                    >
                      <input
                        type="text"
                        className={`bg-white text-gray-900 text-[13px] rounded-[4px] font-[400] focus:outline-none block w-[360px] p-2 placeholder:text-gray-500`}
                        name="search"
                        placeholder="Search by user full name"
                        value={filters.search}
                        onChange={(e) =>
                          setFilters({ ...filters, search: e.target.value })
                        }
                      />

                      

                      <div className="flex space-x-2">
                        <Button
                          startContent={<MdOutlineFilterAlt size={17} />}
                          radius="none"
                          size="sm"
                          type="submit"
                          className="rounded-[4px] bg-bChkRed text-white"
                        >
                          Filter
                        </Button>
                        <Button
                          startContent={<MdOutlineFilterAltOff size={17} />}
                          radius="none"
                          size="sm"
                          type="button"
                          className="rounded-[4px] bg-black text-white"
                          onClick={() => {
                            setFilters({
                              search: "",
                              document_type: null,
                              start_date: null,
                              end_date: null,
                            });
        
                            setSubmittedFilters({
                              search_query: "",
                              document_type: null,
                              start_date: null,
                              end_date: null,
                            });
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </form>
                    {canAddUser ? (
                      <Button
                          startContent={<FaPlus size={13} />}
                          radius="none"
                          size="sm"
                          type="submit"
                          className="rounded-[4px] bg-black text-white py-0.5"
                          onClick={() => {
                            setOpenModal(true)
                          }}
                        >
                          Add User
                        </Button>
                    ):(
                      <div className="absolute z-50 top-1 right-1  flex flex-col rounded-sm py-4 px-6 bg-white shadow-md">
                        <MdMailLock size={28} className="text-bChkRed"/>
                        <div className="text-xs font-medium mb-2">
                          <p>Upgrade your subscrition plan</p>
                          <p>To add new users to your institution</p>
                        </div>
                        
                        <NavLink to={`/e-check`} className="bg-bChkRed text-white text-center rounded-sm w-full py-1.5">Subscribe</NavLink>
                      </div>
                    )}
                        
                       
                    </div>
                </div>
            </section>

            <section className="md:w-full w-[98vw] mx-auto">
                <CustomTable
                    columns={[
                        "Full Name",
                        "Email",
                        "Phone",
                        "Job Title",
                        "Department",
                        "Permissions Assigned",
                        "Actions",
                    ]}
                    loadingState={isLoading}
                    columnSortKeys={{
                        "Full Name": "user_full_name",
                        "Phone": "phone",
                        "Job Title": "job_title",
                        "Email": "email",
                        "Department": "department",
                    }}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    setSortBy={setSortBy}
                    setSortOrder={setSortOrder}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    total={total}
                    handlePageChange={setCurrentPage}
                >
                    {userData?.map((user) => (
                        <TableRow key={user?.id} className="odd:bg-gray-100 even:bg-gray-50 border-b">
                            <TableCell>
                            {user?.first_name} {user?.other_name}{" "}
                            {user?.last_name}
                            </TableCell>
                            <TableCell>{user?.email}</TableCell>
                            <TableCell>{user?.phone}</TableCell>
                            <TableCell>{user?.job_title}</TableCell>
                            <TableCell>{user?.department?.name}</TableCell>
                            <TableCell className="text-center">{user?.permissions_count}</TableCell>
                            <TableCell className="text-center">
                              <div className="relative inline-block">
                                <Popover
                                  placement="bottom"
                                  showArrow
                                  radius="none"
                                  open={isPopoverOpen}
                                  onOpenChange={setIsPopoverOpen} // Handles opening/closing state
                                >
                                  <PopoverTrigger>
                                    <button
                                      className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200"
                                      onClick={() => setIsPopoverOpen((prev) => !prev)} // Toggle popover
                                    >
                                      <MdMoreVert size={20}/>
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent radius="none">
                                    <div className="flex flex-col py-1 space-y-1">
                                      
                                      <button
                                        onClick={() => {
                                          handleUser(user);
                                          closePopover(); // Close popover on Edit
                                        }}
                                        className="text-left text-sm hover:bg-bChkRed hover:text-white px-4 py-1.5 rounded-md w-full flex space-x-2 items-center text-gray-700"
                                      >
                                        <MdEdit size={17}/>
                                        <p>Edit User</p>
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleClickDelete(user, user?.id);
                                          closePopover(); // Optionally close popover on Delete
                                        }}
                                        className="text-left text-sm hover:bg-bChkRed hover:text-white px-4 py-1.5 rounded-md w-full flex space-x-2 items-center text-gray-700"
                                      >
                                        <BsTrash3 size={17}/>
                                        <p>Delete User</p>
                                      </button>
                                      
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </CustomTable>
            </section>
            <AddNewUser
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchUserData={fetchUserData}
                fetchCanUser={fetchCanUser}
                institutionDepartments={institutionDepartments}
                allPermissions={allPermissions}
            />
            <EditUser
                setOpenModal={setOpenEditModal}
                openModal={openEditModal}
                selectedUser={selectedUser}
                institutionDepartments={institutionDepartments}
                allPermissions={allPermissions}
                fetchUserData={fetchUserData}
            />
        </div>
    );
}
