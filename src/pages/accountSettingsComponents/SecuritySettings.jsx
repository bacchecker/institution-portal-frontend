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
import { FaChevronLeft, FaChevronRight, FaPlus, FaRegCheckCircle } from "react-icons/fa";
import {UAParser} from "ua-parser-js";
import moment from "moment";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";
import { NavLink } from "react-router-dom";


export default function SecuritySettings({ setActiveTab }) {
    const changeStatusDisclosure = useDisclosure();
    const [processing, setProcessing] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [missingFields, setMissingFields] = useState({});
    const radius = 50; // Circle radius
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const [isOn, setIsOn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [userData, setUserData] = useState([]);
    const [submittedFilters, setSubmittedFilters] = useState({});
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
    });
    
    const fetchUserProfile = async (ip) => {
        try {
          const response = await axios.get(`institution/profile-complete`);
          setPercentage(response.data.completion_percentage)
          setMissingFields(response.data.missing_fields || {})
          const twoFactor = JSON?.parse(
            secureLocalStorage?.getItem("user")
        )?.two_factor;
        setIsOn(twoFactor);
        } catch (error) {
          console.error("Error fetching location:", error);
          return null;
        }
    };
      
    const fetchUserLogs = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get("/institution/user-system-logs", {
            params: {
              ...submittedFilters,
              page: currentPage,
              sort_by: sortBy,
              sort_order: sortOrder,
            },
          });
      
          const userLogs = response.data.activityLogs.data;
      
          // Process each log entry to extract additional data
          const updatedLogs = await Promise.all(
            userLogs.map(async (log) => {
              const parser = new UAParser(log.user_agent);
              const browser = parser.getBrowser().name;
              const os = parser.getOS().name;
              const timestamp = log.created_at
      
      
              return {
                ...log,
                browser,
                os,
                timestamp
                
              };
            })
          );
      
          setUserData(updatedLogs);
          setCurrentPage(response.data.activityLogs.current_page);
          setLastPage(response.data.activityLogs.last_page);
          setTotal(response.data.activityLogs.total);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching users:", error);
          setIsLoading(false);
        }
    };

    useEffect(() => {
            fetchUserLogs();
            fetchUserProfile()
    }, [submittedFilters, currentPage, sortBy, sortOrder]);
   
    const institutionFields = missingFields
        ? Object.entries(missingFields)
            .filter(([key, value]) => value === null) // Only include fields that are null
            .map(([key]) => key)
        : [];

    const modelFields = missingFields
        ? Object.entries(missingFields)
            .filter(([key]) => ["departments", "users", "document_types"].includes(key))
            .map(([key]) => key)
        : [];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleAddDepartment = () => {
        setActiveTab("departments"); // Switch to Departments Tab
    };
    
    const handleAddUser = () => {
        setActiveTab("users"); // Switch to Users Tab
    };
    
    const handleAddDocumentType = () => {
        setActiveTab("docTypes");
    };

    const handleCompleteProfile = () => {
        console.log("Navigate to profile update page");
        // Navigate user to profile completion form
      };
    return (
        <div className="px-2">
            <div className="w-full rounded-lg bg-gray-200 p-4">
                <div className="flex space-x-4 items-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 120 120"
                            className="transform -rotate-90"
                        >
                            {/* Background Circle */}
                            <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="gray"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            opacity="0.2"
                            />
                            {/* Progress Circle */}
                            <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="red"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-300 ease-in-out"
                            />
                        </svg>
                        {/* Percentage Label */}
                        <span className="absolute text-sm font-semibold text-bChkRed">
                            {percentage}%
                        </span>
                    </div>
                    <div className="">
                        <p className="font-bold text-base">Your institution account profile is {percentage}% complete</p>
                        <p>Please review your account profile settings regularly and update your password</p>
                    </div>
                </div>
            </div>
            <div className="pb-5 border-b mt-3">
                {Object.keys(missingFields || {}).length > 0 ? (
                <>
                    <h3 className="text-md font-semibold mt-3">Missing Information:</h3>
                    <div className="w-full flex justify-between border rounded-md px-3 py-2">
                        <ul className="list-disc ml-5 text-sm">
                            {/* List all missing institution fields */}
                            {institutionFields.map((field) => (
                               <li key={field} className="text-red-500">
                                    {field.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                                </li>
                           
                            ))}
                        </ul>

                        {/* Single button for all institution fields */}
                        {institutionFields.length > 0 && (
                            <NavLink
                                to={`/account-settings/update-request`}
                                className="self-start bg-yellow-500 text-white text-xs px-4 py-2 mt-2 rounded"
                                onClick={handleCompleteProfile}
                            >
                                Complete Profile
                            </NavLink>
                        )}
                    </div>
                    

                    {/* Individual buttons for missing models */}
                    {modelFields.map((key) => (
                        <div key={key} className="flex justify-between items-center mt-2 ml-2">
                            <span className="text-red-500">NO {key.replace(/_/g, " ").toUpperCase()}</span>
                            <button
                                className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded"
                                onClick={
                                    key === "departments"
                                        ? handleAddDepartment
                                        : key === "users"
                                        ? handleAddUser
                                        : handleAddDocumentType
                                }
                            >
                                {key === "departments"
                                    ? "Add Department"
                                    : key === "users"
                                    ? "Add User"
                                    : "Add Document Type"}
                            </button>
                        </div>
                    ))}
                </>
            ) : (
                <p className="text-green-500 font-semibold mt-3">
                    Profile is fully completed! ✅
                </p>
            )}
            </div>
            <div className="flex justify-between items-center space-x-2 py-4 border-b pl-4">
                <div className="">
                    <p className="font-semibold">Password</p>
                    <p>Set a password to protect your account</p>
                </div>
                <div className="flex flex-col lg:flex-row space-x-2 items-center">
                    <p>**************</p>
                    <div className="flex space-x-1 text-green-500 text-xs lg:text-sm items-center">
                        <p>Very secure</p>
                        <FaRegCheckCircle />
                    </div>
                </div>
                <button onClick={() => changeStatusDisclosure.onOpen()} className="border rounded-md text-xs lg:teext-sm px-4 h-10">Update Password</button>
            </div>
            <div className="flex justify-between py-4 border-b pl-4">
                <div className="w-1/3">
                    <p className="font-semibold">Two-Step Verification</p>
                    <p>We recommend requiring a one-time-password (OTP) in addition to your password</p>
                </div>
                <div className="flex space-x-2 items-center">
                    <div className="flex flex-col items-center justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                            type="checkbox"
                            className="sr-only"
                            checked={isOn}
                            readOnly
                            onClick={(e) => e.preventDefault()}
                            />
                            <div
                            className={`w-12 h-5 flex items-center bg-gray-300 rounded-full p-1 transition-colors ${
                                isOn ? "bg-green-500" : "bg-gray-300"
                            }`}
                            >
                            <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                isOn ? "translate-x-6" : "translate-x-0"
                                }`}
                            />
                            </div>
                        </label>
                        
                    </div>
                    <p className="text-sm">Two-Step Verification</p>
                </div>
                <div className=""></div>
            </div>
            <section className="md:w-full w-[98vw] mx-auto pl-4">
                <div className=" py-4">
                    <p className="font-semibold">Browsers and Devices</p>
                    <p>These browsers and devices currently signed into your account</p>
                </div>
                <CustomTable
                    columns={[
                        "Date",
                        "User",
                        "Browser",
                        "IP Address",
                        "Operating System",
                        "Activity",
                    ]}
                    loadingState={isLoading}
                    columnSortKeys={{
                        "User": "user_full_name",
                        "Date": "created_at",
                        "Activity": "description",
                        "IP Address": "ip_address",
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
                    {userData?.map((log) => (
                        <TableRow key={log?.id} className="odd:bg-gray-100 even:bg-gray-50 border-b">
                            <TableCell className="text-left">
                            {log?.timestamp ? moment(log.timestamp).format("MMM D, YYYY HH:mm") : "N/A"}
                            </TableCell>
                            <TableCell>{log?.user?.first_name}{" "}{log?.user?.last_name}</TableCell>
                            <TableCell>{log.browser || "Unknown"}</TableCell>
                            <TableCell>{log.ip_address || "Unknown"}</TableCell>
                            <TableCell>{log.os || "Unknown"}</TableCell>
                            <TableCell className="text-left">{log?.description}</TableCell>
                            
                            
                        </TableRow>
                    ))}
                </CustomTable>
            </section>
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
