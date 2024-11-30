import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  TableCell,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import {FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import axios from "@utils/axiosConfig";
import CustomTable from "@components/CustomTable";
import DeleteModal from "@components/DeleteModal";
import AddNewDepartment from "./departmentManagementComponents/AddNewDepartment";
import EditDepartment from "./departmentManagementComponents/EditDepartment";
import Elipsis from "../../assets/icons/elipsis";
import Swal from "sweetalert2";
import AuthLayout from "../../components/AuthLayout";
import ManageRoles from "./departmentManagementComponents/manageRoles/ManageRoles";

function DepartmentManagement() {
  const deleteDisclosure = useDisclosure();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [openRolesDrawer, setOpenRolesDrawer] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [institutionDepartments, setInstitutionDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");


  const fetchDepartments = async () => {
    setIsLoading(true); // Set loading state
    try {
      const response = await axios.get("/institution/departments", {
        params: {
          search,
          page: currentPage,
          ...(sortBy && { sort_by: sortBy }),
          ...(sortOrder && { sort_order: sortOrder }),
        },
      });
  
      const deptData = response.data.departments;
  
      setInstitutionDepartments(deptData.data);
      setCurrentPage(deptData.current_page);
      setLastPage(deptData.last_page);
      setTotal(deptData.total);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };
  

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
          className={`py-2 px-2.5 border rounded-lg ${
            currentPage === i ? "bg-bChkRed text-white" : "bg-white text-gray-800"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  useEffect(() => {
    if(!openRolesDrawer){
        fetchDepartments();
    }
  }, [openRolesDrawer]);

  useEffect(() => {
    fetchDepartments();
  }, [search, currentPage, sortBy, sortOrder]);
  

  return (
    <AuthLayout title="Department Management">
      <div className="w-full px-5 pb-4">
        <div className="my-3 w-full flex justify-end mx-auto dark:bg-slate-900 mt-6">
          <button
            type="button"
            onClick={() => {
              setOpenDrawer(true);
            }}
            className="w-fit flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
          >
            Add New Department
          </button>
        </div>
        <div>
          <AddNewDepartment
            setOpenDrawer={setOpenDrawer}
            openDrawer={openDrawer}
          />
          <EditDepartment
            setOpenDrawer={setOpenEditDrawer}
            openDrawer={openEditDrawer}
            selectedData={selectedData}
          />
          <ManageRoles
            setOpenDrawer={setOpenRolesDrawer}
            openDrawer={openRolesDrawer}
            selectedData={selectedData}
          />
        </div>
        <section>
          <div className="mb-4 flex space-x-4 bg-white p-4 rounded-xl">
              <div className="relative w-full lg:w-2/3">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                  </div>
                  <input type="search" onChange={(e) => setSearch(e.target.value)} value={search} id="default-search" className="block w-full focus:outline-0 px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search by department name or description" required />
              </div>
          </div>
        </section>
        
        <section className="md:w-full w-[98vw] min-h-[60vh] mx-auto">
          
          <CustomTable
            loadingState={isLoading}
            columns={["Department Name", "Roles", "Description", "Actions"]}
            columnSortKeys={{
              "Department Name": "name",
              Roles: "role_count",
              Description: "description",
            }}
            sortBy={sortBy}
            sortOrder={sortOrder}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
          >

            {institutionDepartments?.map((item) => (
              <TableRow key={item?.id} className="odd:bg-gray-100 even:bg-white border-b dark:text-slate-700">
                <TableCell className="pl-4">{item?.name}</TableCell>
                <TableCell className="pl-4">{item?.role_count}</TableCell>
                <TableCell className="pl-4">{item?.description}</TableCell>

                <TableCell className="flex items-center justify-center h-12 gap-3">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered" size="sm" isIconOnly className="dark:border-slate-400 dark:text-slate-600">
                        <Elipsis />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <DropdownItem
                        key="manage_roles"
                        onClick={() => {
                          setSelectedData(item);
                          setOpenRolesDrawer(true);
                        }}
                      >
                        Manage Roles
                      </DropdownItem>
                      <DropdownItem
                        key="edit"
                        onClick={() => {
                          setSelectedData(item);
                          setOpenEditDrawer(true);
                        }}
                      >
                        Update
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        onClick={() => {
                          deleteDisclosure.onOpen();
                          setSelectedData(item);
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
            <div className="flex justify-between items-center mt-4">
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
        </section>
        
        <DeleteModal
          disclosure={deleteDisclosure}
          title="Delete Department"
          processing={isDeleting}
          onButtonClick={async () => {
            setDeleting(true);
            try {
              const response = await axios.delete(
                `/institution/departments/${selectedData?.id}`
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
                  fetchDepartments()
                  setDeleting(false);
                }
              });
            } catch (error) {
              console.log(error);
              setDeleting(false);
            }
          }}
        >
          <p className="font-quicksand">
            Are you sure you want to delete this department?{" "}
            <span className="font-semibold">
              {selectedData?.document_type?.name}
            </span>
          </p>
        </DeleteModal>
      </div>
    </AuthLayout>
  );
}

export default DepartmentManagement;
