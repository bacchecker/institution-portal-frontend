import React, { useState, useEffect } from "react";
import {
  TableCell,
  TableRow,
  useDisclosure, PopoverTrigger, PopoverContent,
  Button,
} from "@nextui-org/react";
import CustomTable from "@/components/CustomTable";
import ConfirmModal from "@/components/confirm-modal";
import axios from "@/utils/axiosConfig";
import { FaChevronLeft, FaChevronRight, FaPlus, FaRegCheckCircle, FaUsers } from "react-icons/fa";
import {UAParser} from "ua-parser-js";
import moment from "moment";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";
import { MdFileDownload, MdOutlinePending } from "react-icons/md";


export default function InstitutionProfile() {
    const changeStatusDisclosure = useDisclosure();
    const [processing, setProcessing] = useState(false);
    const [profileData, setProfileData] = useState(0);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [subCurrentPage, setSubCurrentPage] = useState(1);
    const [subLastPage, setSubLastPage] = useState(1);
    const [subTotal, setSubTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState(null);
    const [pdfPath, setPdfPath] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [userData, setUserData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [institutionPayments, setInstitutionPayments] = useState([]);
    const [institutionSubscriptions, setInstitutionSubscritions] = useState([]);
    const [submittedFilters, setSubmittedFilters] = useState({});
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
    });
    
    const fetchInstitutionProfile = async (ip) => {
        try {
          const response = await axios.get(`institution/institution-profile`);
          setProfileData(response.data)
          setDepartments(response.data.departments)
          setPdfPath(response.data?.institution?.operation_certificate)
          
        } catch (error) {
          console.error("Error fetching location:", error);
          return null;
        }
    };

    const fetchInstitutionPayments = async () => {
        try {
            const response = await axios.get(`institution/payments`);
            const instPayments = response.data.data

            setInstitutionPayments(instPayments.data)
            setCurrentPage(instPayments.current_page);
            setLastPage(instPayments.last_page);
            setTotal(instPayments.total);
          
        } catch (error) {
          console.error("Error fetching location:", error);
          return null;
        }
    };

    const fetchInstitutionSubscriptions = async () => {
        try {
            const response = await axios.get(`institution/subscriptions`);
            const instSubscritions = response.data.data

            setInstitutionSubscritions(instSubscritions.data)
            setSubCurrentPage(instSubscritions.current_page);
            setSubLastPage(instSubscritions.last_page);
            setSubTotal(instSubscritions.total);
          
        } catch (error) {
          console.error("Error fetching location:", error);
          return null;
        }
    };
      
    const handlePageChange = (page) => {
        if (page >= 1 && page <= lastPage) {
          setCurrentPage(page);
        }
    };

    const handleSubPageChange = (page) => {
        if (page >= 1 && page <= subLastPage) {
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
                currentPage === i
                    ? "bg-bChkRed text-white"
                    : "bg-white text-gray-800"
                }`}
            >
                {i}
            </button>
            );
        }
        return pages;
    };
    const renderSubPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= subLastPage; i++) {
            pages.push(
            <button
                key={i}
                onClick={() => handleSubPageChange(i)}
                className={`py-1.5 px-2.5 border rounded-lg ${
                subCurrentPage === i
                    ? "bg-bChkRed text-white"
                    : "bg-white text-gray-800"
                }`}
            >
                {i}
            </button>
            );
        }
        return pages;
    };

    useEffect(() => {
        fetchInstitutionPayments()
        fetchInstitutionSubscriptions()
        fetchInstitutionProfile()
            
    }, [submittedFilters, currentPage, sortBy, sortOrder]);


   
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="px-2">
            
            <div className="bg-white rounded-md p-4 border grid grid-cols-2 lg:grid-cols-4 items-center gap-4 mb-4">
                <div className="col-span-2 flex space-x-3 items-center">
                    <div className="w-24 h-24 border rounded-md flex items-center justify-center">
                        <img src={`https://admin-dev.baccheck.online/storage/${profileData?.institution?.logo}`} alt="" className="rounded-md"/>
                    </div>
                    <div className="">
                        <div className="">
                            <p className="font-semibold text-2xl">{profileData?.institution?.name} <span>{profileData?.institution?.prefix}</span></p>
                            <p>{profileData?.institution?.address}{", "}{profileData?.institution?.mailing_address}</p>
                            <p>{profileData?.institution?.institution_email}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="">
                        <p className="font-semibold">Account Type</p>
                        <p>{profileData?.institution?.type || "N/A"}</p>
                    </div>
                    <div className="">
                        <p className="font-semibold">Setup Complete</p>
                        <p className={`flex items-center gap-2 ${profileData?.institution?.setup_done == 1 ? "text-green-600" : "text-gray-500"}`}>
                            {profileData?.institution?.setup_done == 1 ? (
                                <>
                                <FaRegCheckCircle /> Completed
                                </>
                            ) : (
                                <>
                                <MdOutlinePending /> Incomplete
                                </>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="">
                        <p className="font-semibold">Member Since</p>
                        <p>{profileData?.institution?.created_at || "N/A"}</p>
                    </div>
                    <div className="">
                        <p className="font-semibold">Terms and Condition</p>
                        <p className={`flex items-center gap-2 ${profileData?.institution?.terms == 1 ? "text-green-600" : "text-gray-500"}`}>
                            {profileData?.institution?.terms == 1 ? (
                                <>
                                <FaRegCheckCircle /> Agreed
                                </>
                            ) : (
                                <>
                                <MdOutlinePending /> Not Agreed
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-md p-4 border mb-4">
                <p className="font-semibold mb-2">Operation Certificate</p>
                <div className="w-full h-72 border rounded-lg overflow-hidden relative">
                    <iframe
                        src={`https://admin-dev.baccheck.online/storage/${pdfPath}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full"
                    ></iframe>

                    {/* Download Button */}
                    <div className="absolute top-2 right-2">
                        <a
                        href={`https://admin-dev.baccheck.online/storage/${pdfPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-bChkRed text-white rounded-full shadow-md flex items-center justify-center"
                        >
                        <MdFileDownload size={28}/>
                        </a>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-md p-4 border mb-4">
                <div className="flex justify-between mb-2">
                    <p className="font-semibold">Departments</p>
                    <button className="border px-3 py-1 text-xs rounded-md">See all</button>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {departments?.map((department) => (
                        <div className="border p-3 rounded-md">
                            <p className="font-semibold">{department?.name}</p>
                            <p className="text-xs">{department?.description}</p>
                            <div className="flex items-center space-x-2 mt-2 border p-2 rounded-md">
                                <div className="bg-gray-100 rounded-full p-2">
                                    <FaUsers size={24}/>
                                </div>
                                
                                <div className="text-sm">
                                    <p className="font-bold">Staff</p>
                                    <p>{department?.user_count} User(s)</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                
            </div>
            <section className="md:w-full w-[98vw] mx-auto pl-4 border rounded-md">
                <div className=" py-4">
                    <p className="font-semibold">Institution Payments</p>
                    <p>All payments that has been made by this institution to Bacchecker</p>
                </div>
                <CustomTable
                    columns={[
                        "ID",
                        "Date",
                        "User",
                        "Payment Type",
                        "Amount",
                        "Payment Method",
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
                    {institutionPayments?.map((payment) => (
                        <TableRow key={payment?.id} className="odd:bg-gray-100 even:bg-gray-50 border-b">
                            <TableCell>{payment.unique_code || "N/A"}</TableCell>
                            <TableCell className="text-left">
                            {payment?.created_at ? moment(payment.created_at).format("MMM D, YYYY HH:mm") : "N/A"}
                            </TableCell>
                            <TableCell>{payment?.user?.first_name}{" "}{payment?.user?.last_name}</TableCell>
                            <TableCell>
                            {payment?.payment_type
                                ? payment.payment_type.charAt(0).toUpperCase() + payment.payment_type.slice(1)
                                : "N/A"}
                            </TableCell>
                            <TableCell className="">{payment?.amount}</TableCell>
                            <TableCell className="">{payment?.payment_method?.method}</TableCell>
                            
                            
                        </TableRow>
                    ))}
                </CustomTable>
                <section>
                    <div className="flex justify-between items-center my-1">
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
            {/* <section className="md:w-full w-[98vw] mx-auto pl-4 border rounded-md">
                <div className=" py-4">
                    <p className="font-semibold">Institution Subscriptions</p>
                    <p>All subscription plans purchased by this institution</p>
                </div>
                <CustomTable
                    columns={[
                        "ID",
                        "Date",
                        "User",
                        "Payment Type",
                        "Amount",
                        "Payment Method",
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
                    {institutionPayments?.map((payment) => (
                        <TableRow key={payment?.id} className="odd:bg-gray-100 even:bg-gray-50 border-b">
                            <TableCell>{payment.unique_code || "N/A"}</TableCell>
                            <TableCell className="text-left">
                            {payment?.created_at ? moment(payment.created_at).format("MMM D, YYYY HH:mm") : "N/A"}
                            </TableCell>
                            <TableCell>{payment?.user?.first_name}{" "}{payment?.user?.last_name}</TableCell>
                            <TableCell>
                            {payment?.payment_type
                                ? payment.payment_type.charAt(0).toUpperCase() + payment.payment_type.slice(1)
                                : "N/A"}
                            </TableCell>
                            <TableCell className="">{payment?.amount}</TableCell>
                            <TableCell className="">{payment?.payment_method?.method}</TableCell>
                            
                            
                        </TableRow>
                    ))}
                </CustomTable>
                <section>
                    <div className="flex justify-between items-center my-1">
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
            </section> */}
            <ConfirmModal
                processing={processing}
                disclosure={changeStatusDisclosure}
                title="Update User Password"
                onButtonClick={async () => {
                    try {
                        setProcessing(true);
                        
                        const response = await axios.post(`/institution/user/update-password`, formData);
                        
                        toast.success(response.data.message, { position: "top-right" });
                
                        setFormData({
                            old_password: "",
                            new_password: "",
                            new_password_confirmation: "",
                        });
                
                        changeStatusDisclosure.onClose();
                    } catch (error) {
                        if (error.response?.data?.error) {
                            toast.error(error.response.data.error, { position: "top-right" });
                        } else {
                            toast.error(error.response.data.message);
                        }
                        changeStatusDisclosure.onOpen();
                    } finally {
                        // Ensure processing state is reset
                        setProcessing(false);
                    }
                }}
                
                >
                <div className="mt-5">
                    <h4 className="text-sm mb-1">Current Password</h4>
                    <div className="relative w-full h-10 md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                        type="password"
                        name="old_password"
                        value={formData.old_password}
                        onChange={handleChange}
                        className="w-full h-full px-4 text-base focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                    />
                    </div>
                </div>
                <div className="mt-2">
                    <h4 className="text-sm mb-1">New Password</h4>
                    <div className="relative w-full h-10 md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                        type="password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        className="w-full h-full px-4 text-base focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                    />
                    </div>
                </div>
                <div className="mt-2">
                    <h4 className="text-sm mb-1">Confirm Password</h4>
                    <div className="relative w-full h-10 md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                        type="password"
                        name="new_password_confirmation"
                        value={formData.new_password_confirmation}
                        onChange={handleChange}
                        className="w-full h-full px-4 text-base focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                    />
                    </div>
                </div>
            </ConfirmModal>
        </div>
    );
}
