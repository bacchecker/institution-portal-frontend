import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  TableCell,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { FaAnglesLeft, FaAnglesRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";
import axios from "@utils/axiosConfig";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import CustomTable from "@components/CustomTable";
import DeleteModal from "@components/DeleteModal";
import AddNewUser from "./userManagementComponents/AddNewUser";
import EditUser from "./userManagementComponents/EditUser";
import Elipsis from "../../assets/icons/elipsis";
import Swal from "sweetalert2";
import AuthLayout from "../../components/AuthLayout";
import { IoLockOpen } from "react-icons/io5";
import toast from "react-hot-toast";

function UserManagement() {
  const [isSaving, setSaving] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [institutionUsers, setInstitutionUsers] = useState([]);
  const deleteDisclosure = useDisclosure();
  const suspendDisclosure = useDisclosure();
  const restoreDisclosure = useDisclosure();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [isSuspending, setSuspending] = useState(false);
  const [isRestoring, setRestoring] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [password, setPassword] = useState("");
  


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/institution/users", {
        params: {
          search,
          page: currentPage,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });
  
      const usersData = response.data.institutionUsers;
  
      setInstitutionUsers(usersData.data);
      setCurrentPage(usersData.current_page);
      setLastPage(usersData.last_page);
      setTotal(usersData.total);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  
  const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
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

  useEffect(() => {
    fetchData();
  }, [search, currentPage, sortBy, sortOrder]);
  
  return (
    <AuthLayout title="User Management">
      <div className="w-full px-5 pb-4">
        <div className="my-3 w-full flex justify-end mx-auto dark:bg-slate-900 mt-6">
          <button
            type="button"
            onClick={() => {
              setOpenDrawer(true);
            }}
            className="w-fit flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
          >
            Add New User
          </button>
        </div>
        <div>
            <AddNewUser
              fetchData={fetchData}
              setOpenDrawer={setOpenDrawer}
              openDrawer={openDrawer}
            />
          
            <EditUser
              fetchData={fetchData}
              setOpenDrawer={setOpenEditDrawer}
              openDrawer={openEditDrawer}
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
                <input type="search" onChange={(e) => setSearch(e.target.value)} value={search} id="default-search" className="block w-full focus:outline-0 px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search by full name, email, phone number or department" required />
            </div>
        </div>

        </section>
        <section className="md:w-full w-[98vw] min-h-[60vh] mx-auto">
          <CustomTable
            loadingState={isLoading}
            columns={["Full Name", "Phone", "Email", "Department", "Status", "Actions"]}
            columnSortKeys={{
              "Full Name": "first_name",
              Phone: "phone",
              Email: "email",
              Department: "department.name",
              Status: "status",
            }}
            sortBy={sortBy}
            sortOrder={sortOrder}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
          >
            {institutionUsers?.map((item) => (
              <TableRow key={item?.id} className={`odd:bg-gray-100 even:bg-white border-b dark:text-slate-700`}>
                <TableCell>{item?.first_name} {item?.last_name}</TableCell>

                <TableCell>{item?.phone}</TableCell>
                <TableCell>{item?.email}</TableCell>
                <TableCell>{item?.department.name}</TableCell>
                <TableCell>
                  <Chip className="capitalize" color={statusColorMap[item.status]} size="sm" variant="flat">
                    {item.status}
                  </Chip>
                </TableCell>

                <TableCell className="flex items-center h-12 gap-3">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered" size="sm" isIconOnly className="dark:border-slate-400 dark:text-slate-600">
                        <Elipsis />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
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
                      {item.status == 'active' ? (
                        <DropdownItem
                       
                        key="suspend"
                        onClick={() => {
                          suspendDisclosure.onOpen();
                          setSelectedData(item);
                        }}
                      >
                        <p className="text-red-600 hover:text-red-600">Suspend Account</p>
                      </DropdownItem>
                      ):(
                        <DropdownItem
                       
                          key="restore"
                          onClick={() => {
                            restoreDisclosure.onOpen();
                            setSelectedData(item);
                          }}
                        >
                          <p className="text-green-600 hover:text-green-600">Restore Account</p>
                        </DropdownItem>
                      )}
                      
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
            
          </CustomTable>
          <section>
            <div className="flex justify-between items-center mt-1">
              <div>
                <span className="text-gray-600 font-medium text-sm">
                  Page {currentPage} of {lastPage} - ({total} entries)
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white"
                >
                  <FaChevronLeft size={12} />
                </button>

                {renderPageNumbers()}

                <button
                  disabled={currentPage === lastPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white disabled:border-0"
                >
                  <FaChevronRight size={12} />
                </button>
              </div>
            </div>
          </section>
        </section>
        <DeleteModal
          disclosure={deleteDisclosure}
          title="Delete User"
          processing={isDeleting}
          onButtonClick={async () => {
            setDeleting(true);
            try {
              const response = await axios.delete(
                `/institution/users/${selectedData?.id}`
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
                  fetchData()
                  setDeleting(false);
                }
              });
            } catch (error) {
              console.log(error);
              setErrors(error.response.data.message);
              setDeleting(false);
            }
          }}
        >
          <p className="font-quicksand">
            Are you sure you want to delete this user?{" "}
            <span className="font-semibold">
              {selectedData?.document_type?.name}
            </span>
          </p>
        </DeleteModal>

        <DeleteModal
          disclosure={suspendDisclosure}
          title="Suspend User Account"
          processing={isSuspending}
          onButtonClick={async () => {
            setSuspending(true);
            const payload = {
              password: password,
            };
            try {
              const response = await axios.post(
                `/institution/suspend-user/${selectedData?.id}`, payload
              );
              suspendDisclosure.onClose();
              Swal.fire({
                title: "Success",
                text: response.data.message,
                icon: "success",
                button: "OK",
                confirmButtonColor: "#00b17d",
              }).then((isOkay) => {
                if (isOkay) {
                  setPassword('')
                  fetchData()
                  setSuspending(false);
                }
              });
            } catch (error) {
              console.log(error);
              toast.error(error.response.data.message);
              setSuspending(false);
            }
          }}
        >
          <form action="">
            <Input
              type="password"
              id="password"
              name="password"
              size="sm"
              value={password}
              label="Password"
              className="mt-1 block w-full"
              onChange={(e) => setPassword(e.target.value)}
              startContent={<IoLockOpen />}
            />
          </form>
          
        </DeleteModal>

        <DeleteModal
          disclosure={restoreDisclosure}
          title="Restore User Account"
          processing={isRestoring}
          onButtonClick={async () => {
            setRestoring(true);
            const payload = {
              password: password,
            };
            try {
              const response = await axios.post(
                `/institution/restore-user/${selectedData?.id}`, payload
              );
              restoreDisclosure.onClose();
              Swal.fire({
                title: "Success",
                text: response.data.message,
                icon: "success",
                button: "OK",
                confirmButtonColor: "#00b17d",
              }).then((isOkay) => {
                if (isOkay) {
                  setPassword('');
                  fetchData();
                  setRestoring(false);
                }
              });
            } catch (error) {
              console.log(error);
              toast.error(error.response.data.message);
              setRestoring(false);
            }
          }}
        >
          <form action="">
            <Input
              type="password"
              id="password"
              name="password"
              size="sm"
              value={password}
              label="Password"
              className="mt-1 block w-full"
              onChange={(e) => setPassword(e.target.value)}
              startContent={<IoLockOpen />}
            />
          </form>
          
        </DeleteModal>
      </div>
    </AuthLayout>
  );
}

export default UserManagement;
