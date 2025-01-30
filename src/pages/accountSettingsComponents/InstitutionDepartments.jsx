import React, { useState, useEffect, useRef } from "react";
import {
  TableCell,
  TableRow,
  Popover, PopoverTrigger, PopoverContent,
  Button,
} from "@nextui-org/react";
import CustomTable from "@/components/CustomTable";
import axios from "@/utils/axiosConfig";
import { FaPlus } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsTrash3 } from "react-icons/bs";
import { MdDelete, MdEdit, MdMoreVert, MdOutlineFilterAlt } from "react-icons/md";
import AddNewDepartment from "../accountSettingsComponents/departmentComponents/AddNewDepartment";
import EditDepartment from "../accountSettingsComponents/departmentComponents/EditDepartment";
import Swal from "sweetalert2";
import { toast } from "sonner";
import OverviewDepartment from "./departmentComponents/OverviewDepartment";

export default function InstitutionDepartments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [departmentData, setDepartmentData] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openOverviewModal, setOpenOverviewModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const triggerClickOutside = () => {
    // Manually force blur on the active element (helps in some cases)
    if (document.activeElement) {
      document.activeElement.blur();
    }
  
    // Dispatch a click event to trigger outside click detection
    setTimeout(() => {
      document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }, 50);
  };

  const [filters, setFilters] = useState({
      search: "",
      start_date: null,
      end_date: null,
  });
  const [submittedFilters, setSubmittedFilters] = useState({});

  const fetchDepartmentData = async () => {
    setIsLoading(true)
    try {
    const response = await axios.get("/institution/departments", {
        params: {
        ...submittedFilters,
        page: currentPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        },
    });

      const departmentData = response.data.departments;

      setDepartmentData(departmentData.data);
      setCurrentPage(departmentData.current_page);
      setLastPage(departmentData.last_page);
      setTotal(departmentData.total);
      setIsLoading(false);

      } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
      }
  };

  useEffect(() => {
      fetchDepartmentData();
  }, [submittedFilters, currentPage, sortBy, sortOrder]);

  const handleSubmit = (event) => {
      event.preventDefault();
      setSubmittedFilters({ ...filters });
      setCurrentPage(1);
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
        const response = await axios.get('/institution/institution-permissions');

        setAllPermissions(response.data.data);
    } catch (error) {
        console.error('Error fetching tickets:', error);
    }
  };

  const handleDepartment = (department) => {
    setOpenEditModal(true);
    setSelectedDepartment(department);
  };

  const handleOverview = (department) => {
    setOpenOverviewModal(true);
    setSelectedDepartment(department);
  };

  const handleClickDelete = async (department, i) => {
    try {
      // Display confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure you want to delete this department?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#febf4c",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, I'm sure",
        cancelButtonText: "No, cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`/institution/departments/${department?.id}`);

        toast.success(response.data.message);
        fetchDepartmentData()
      }
    } catch (error) {
      // Error feedback
      toast.error(error.response?.data?.message || "Failed to delete department.", "error");
    }
  };

    return (
        <div>
            <section className="mb-4">
                <div className="md:w-full flex bg-gray-100 justify-between items-center w-full mx-auto rounded-none shadow-none border-none p-4">
                    <div className="w-full flex items-center justify-between">
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-row gap-3 items-center"
                    >
                      <input
                        type="text"
                        className={`bg-white text-gray-900 text-[13px] rounded-[4px] font-[400] focus:outline-none block w-[360px] p-2 placeholder:text-gray-500`}
                        name="search"
                        placeholder="Search by department name or description"
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
                        {/* <Button
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
                              search: "",
                              document_type: null,
                              start_date: null,
                              end_date: null,
                            });
                          }}
                        >
                          Clear
                        </Button> */}
                      </div>
                    </form>
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
                          Add Department
                        </Button>
                       
                    </div>
                </div>
            </section>

            <section className="md:w-full w-[98vw] mx-auto">
                <CustomTable
                    columns={[
                        "Department Name",
                        "Description",
                        "Permissions Assigned",
                        "Users Assigned",
                        "Actions",
                    ]}
                    loadingState={isLoading}
                    columnSortKeys={{
                        "Description": "description",
                        "Department Name": "name",
                        "Stream": "type",
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
                    {departmentData?.map((department) => (
                        <TableRow key={department?.id} className="odd:bg-gray-100 even:bg-gray-50 border-b">
                            <TableCell className="text-[13px]">{department?.name}</TableCell>
                            <TableCell className="text-[13px]">{department?.description}</TableCell>
                            <TableCell className="text-center">{department?.permissions_count}</TableCell>
                            <TableCell className="text-center">{department?.users_count ?? 'N/A'} Users</TableCell>
                            <TableCell className="text-center">
                              <div className="relative inline-block">
                                <Popover
                                  placement="bottom"
                                  showArrow
                                  radius="none"
                                  bordered
                                  open={isPopoverOpen}
                                  onOpenChange={setIsPopoverOpen}
                                  triggerType="listbox" // Handles opening/closing state
                                >
                                  <PopoverTrigger>
                                    <button
                                      className="w-full flex items-center justify-center p-2 rounded-full hover:bg-gray-200"
                                      onClick={() => setIsPopoverOpen((prev) => !prev)} // Toggle popover
                                    >
                                      <MdMoreVert size={20}/>
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent radius="none">
                                    <div className="flex flex-col py-1 space-y-1">
                                      <button
                                        onClick={() => {
                                          handleOverview(department);
                                        }}
                                        className="text-left text-sm hover:bg-bChkRed hover:text-white px-4 py-1.5 rounded-md w-full flex space-x-2 items-center text-gray-700"
                                      >
                                        <FaRegCircleUser size={17}/>
                                        <p>View Department</p>
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleDepartment(department);
                                        }}
                                        className="text-left text-sm hover:bg-bChkRed hover:text-white px-4 py-1.5 rounded-md w-full flex space-x-2 items-center text-gray-700"
                                      >
                                        <MdEdit size={17}/>
                                        <p>Edit Department</p>
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleClickDelete(department, department?.id);
                                        }}
                                        className="text-left text-sm hover:bg-bChkRed hover:text-white px-4 py-1.5 rounded-md w-full flex space-x-2 items-center text-gray-700"
                                      >
                                        <BsTrash3 size={17}/>
                                        <p>Delete Department</p>
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
            <AddNewDepartment
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchDepartmentData={fetchDepartmentData}
                allPermissions={allPermissions}
            />
            <EditDepartment
              setOpenModal={setOpenEditModal}
              openModal={openEditModal}
              selectedDepartment={selectedDepartment}
              allPermissions={allPermissions}
              fetchDepartmentData={fetchDepartmentData}
            />
            <OverviewDepartment
              setOpenModal={setOpenOverviewModal}
              openModal={openOverviewModal}
              selectedDepartment={selectedDepartment}
              allPermissions={allPermissions}
              fetchDepartmentData={fetchDepartmentData}
            />
        </div>
    );
}
