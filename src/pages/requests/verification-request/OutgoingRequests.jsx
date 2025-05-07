import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  DateRangePicker,
  Input,
  Select,
  Tabs, Tab,
  TableCell,
  TableRow,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import CustomTable from "@/components/CustomTable";
import moment from "moment";
import axios from "@/utils/axiosConfig";
import StatusChip from "@/components/status-chip";
import Drawer from "@/components/Drawer";
import CustomUser from "@/components/custom-user";

import { filesize } from "filesize";
import ConfirmModal from "@/components/confirm-modal";
import DeleteModal from "@/components/DeleteModal";
import { toast } from "sonner";
import {
  FaDownload,
  FaPlus,
} from "react-icons/fa6";
import { MdOutlineFilterAlt, MdOutlineFilterAltOff } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";
import AddRequest from "./AddRequest";
import PermissionWrapper from "../../../components/permissions/PermissionWrapper";
import { FaFilePdf } from "react-icons/fa";
import { IoIosOpen } from "react-icons/io";

export default function OutgoingRequests() {
  const changeStatusDisclosure = useDisclosure();
  const declineDisclosure = useDisclosure();

  const [bulkDownloadLoading, setBulkDownloadLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dateRange, setDateRange] = useState({});
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const user = JSON?.parse(secureLocalStorage?.getItem("user"))?.user;
  const [documentTypes, setDocumentTypes] = useState([]);
  const [checkListSections, setCheckListSections] = useState([]);
  const [allRequests, setAllRequests] = useState(0);
  const [pending, setPending] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [approved, setApproved] = useState(0);
  const [status, setStatus] = useState(null);
  const [institutionId, setInstitutionId] = useState(null);
  const [verificationReport, setVerificationReport] = useState("");
  const [requestLetter, setRequestLetter] = useState("");
  const [authLetter, setAuthLetter] = useState("");
  const [filters, setFilters] = useState({
    search_query: "",
    status: null,
    start_date: null,
    end_date: null,
  });
  const [submittedFilters, setSubmittedFilters] = useState({});
  const [answers, setAnswers] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const statusData = [
    { value: "created", name: "Created" },
    { value: "submitted", name: "Submitted" },
    { value: "received", name: "Received" },
    { value: "processing", name: "Processing" },
    { value: "rejected", name: "Rejected" },
    { value: "completed", name: "Completed" },
];
  const handleChange = (itemId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  useEffect(() => {
    if (!data?.id || !data?.status) return; // Ensure ID and status exist
  
    setIsFetching(true);
  
    const fetchReports = async () => {
      try {
        const requests = [];
  
        // ✅ Fetch Request Letter (for all statuses)
        requests.push(
          axios.get(`/pdf/request-letter/${data.id}`, { responseType: "blob" })
        );
  
        // ✅ Fetch Authorization Letter (Only if status is NOT "created" or "rejected")
        if (!["created", "rejected"].includes(data.status)) {
          requests.push(
            axios.get(`/pdf/authorization-letter/${data.id}`, { responseType: "blob" })
          );
        } else {
          requests.push(Promise.resolve(null)); // Placeholder to maintain order
        }
  
        // ✅ Fetch Verification Report (Only if status is "completed")
        if (data.status === "completed") {
          requests.push(
            axios.get(`/pdf/verification-report/${data.id}`, { responseType: "blob" })
          );
        } else {
          requests.push(Promise.resolve(null)); // Placeholder to maintain order
        }
  
        // Execute all API requests
        const [reqLetter, authLetter, verificationReport] = await Promise.all(requests);
  
        // Convert blobs to URLs only if response is valid
        setRequestLetter(reqLetter ? URL.createObjectURL(reqLetter.data) : null);
        setAuthLetter(authLetter ? URL.createObjectURL(authLetter.data) : null);
        setVerificationReport(verificationReport ? URL.createObjectURL(verificationReport.data) : null);
  
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
        console.error("Error fetching reports:", error);
      }
    };
  
    fetchReports();
  }, [data?.id, data?.status]); // ✅ Runs when `data.id` or `data.status` changes
   

  const institutionVerificationRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "/institution/requests/verification-out-requests",
        {
          params: {
            ...submittedFilters,
            page: currentPage,
            sort_by: sortBy,
            sort_order: sortOrder,
          },
        }
      );

      const valRequest = response.data.paginatedRequests;

      setAllRequests(response.data.allRequests);
      setPending(response.data.pending);
      setApproved(response.data.approved);
      setRejected(response.data.rejected);
      setVerificationRequests(valRequest.data);
      setCurrentPage(valRequest.current_page);
      setLastPage(valRequest.last_page);
      setTotal(valRequest.total);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching institution documents:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchInstitutionDocs = async () => {
      try {
        const response = await axios.get("/institution/document_types");
        const uniqueDocumentTypes = [
          ...new Map(
            response.data.documents.map((doc) => [
              doc.document_type.id,
              { key: doc.document_type.id, name: doc.document_type.name },
            ])
          ).values(),
        ];
        setDocumentTypes(uniqueDocumentTypes);
      } catch (error) {
        console.error(error);
      }
    };
    setInstitutionId(user?.institution_id);
    fetchInstitutionDocs();
  }, []);

  useEffect(() => {
    institutionVerificationRequests();
  }, [submittedFilters, currentPage, sortBy, sortOrder]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedFilters({ ...filters });
    setCurrentPage(1);
  };

  const handleDocumentTypeChange = (event) => {
    setFilters({ ...filters, status: event.target.value });
  };

  const handleSubmitVerificationAnswers = async (event) => {
    event.preventDefault();

    const allItemIds = checkListSections.sections.flatMap((section) =>
      section.items.map((item) => item.id)
    );

    // Check if every item has an answer
    const unansweredItems = allItemIds.filter(
      (itemId) => !answers[itemId] || answers[itemId].trim() === ""
    );

    if (unansweredItems.length > 0) {
      // Show an error message and prevent submission
      toast.error("Please provide answers to all questions before submitting.");
      return;
    }

    const payload = {
      verification_request: data?.id, // Include verification_request_id
      checklist: Object.keys(answers).map((itemId) => ({
        id: itemId,
        value: answers[itemId],
      })),
    };

    try {
      setIsSaving(true);

      const response = await axios.post(
        "/institution/requests/verification-request-answers",
        payload
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        setAnswers({});
        setOpenDrawer(false);
        institutionVerificationRequests();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit checklist. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fetchVerificationChecklist = async (documentTypeId) => {
    try {
      const url = `/verification-checklist-items/${documentTypeId}`;
      const response = await axios.get(url);
      setCheckListSections(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
    <div>
        <section className="px-3">
        <Card className="md:w-full w-full mx-auto rounded-md shadow-none border-none mb-2">
            <CardBody className="w-full bg-gray-100 p-6">
            <form
                onSubmit={handleSubmit}
                className="flex flex-row gap-3 items-center"
            >
                <input
                  type="text" 
                  className="bg-white text-gray-900 text-sm rounded-[4px] font-[400] focus:outline-none block w-[260px] p-[9.5px] placeholder:text-gray-500"
                  name="search_query"
                  placeholder="Search by institution name or unique code"
                  value={filters.search_query}
                  onChange={(e) => setFilters({ ...filters, search_query: e.target.value })}
                />
                
                <select
                name="status"
                value={filters.status || ""}
                className={`bg-white text-sm rounded-[4px] focus:outline-none block w-[220px] p-[9px] ${
                    filters.status ? "text-gray-900" : "text-gray-500"
                }`}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                <option value="" className="text-gray-500" disabled selected>Status</option>
                {statusData.map((item) => (
                    <option key={item.value} value={item.value}>
                    {item.name}
                    </option> 
                ))}
                </select>
                <DateRangePicker
                radius="none"
                visibleMonths={2}
                variant="underlined"
                classNames={{
                    base: "bg-white", // This sets the input background to white
                }}
                style={{
                    border: "none", // Removes the border
                }}
                className="w-[280px] rounded-[4px] date-range-picker-input border-none bg-white"
                onChange={(date) => {
                    if (date) {
                    const newStartDate = new Date(
                        date.start.year,
                        date.start.month - 1,
                        date.start.day
                    )
                        .toISOString()
                        .split("T")[0];
                    const newEndDate = new Date(
                        date.end.year,
                        date.end.month - 1,
                        date.end.day
                    )
                        .toISOString()
                        .split("T")[0];

                    setFilters({
                        ...filters,
                        start_date: newStartDate,
                        end_date: newEndDate,
                    });
                    }
                }}
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
                        search_query: "",
                        status: null,
                        start_date: null,
                        end_date: null,
                    });

                    setSubmittedFilters({
                        search_query: "",
                        status: null,
                        start_date: null,
                        end_date: null,
                    });
                    }}
                >
                    Clear
                </Button>
                </div>
            </form>
            </CardBody>
        </Card>

        {/* <div className="my-3 w-full shadow-none rounded-lg">
            <div className="grid w-full grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
                onClick={() => {
                setStatus("allRequests");
                }}
                className="rounded-md bg-gray-100 p-4 flex space-x-4 cursor-pointer"
            >
                <div className="flex items-center justify-center bg-purple-200 text-cusPurp rounded-full w-10 h-10">
                <IoDocuments size={18} />
                </div>
                <div className="">
                <p className="font-medium">Total Documents</p>
                <p className="text-gray-500">{allRequests}</p>
                </div>
            </div>
            <div
                onClick={() => {
                setStatus("pending");
                }}
                className="rounded-md bg-gray-100 p-4 flex space-x-4 cursor-pointer"
            >
                <div className="flex items-center justify-center bg-yellow-200 text-yellow-500 rounded-full w-10 h-10">
                <PiQueueFill size={18} />
                </div>
                <div className="">
                <p className="font-medium">Pending</p>
                <p className="text-gray-500">{pending}</p>
                </div>
            </div>
            <div
                onClick={() => {
                setStatus("approved");
                }}
                className="rounded-md bg-gray-100 p-4 flex space-x-4 cursor-pointer"
            >
                <div className="flex items-center justify-center bg-green-200 text-green-600 rounded-full w-10 h-10">
                <FaHeart size={18} />
                </div>
                <div className="">
                <p className="font-medium">Approved</p>
                <p className="text-gray-500">{approved}</p>
                </div>
            </div>
            <div
                onClick={() => {
                setStatus("rejected");
                }}
                className="rounded-md bg-gray-100 p-4 flex space-x-4 cursor-pointer"
            >
                <div className="flex items-center justify-center bg-red-200 text-red-600 rounded-full w-10 h-10">
                <FcCancel size={18} />
                </div>
                <div className="">
                <p className="font-medium">Not Approved</p>
                <p className="text-gray-500">{rejected}</p>
                </div>
            </div>
            </div>
        </div> */}
        </section>

        <section className="md:px-3 md:w-full w-[98vw] mx-auto relative">
            <CustomTable
                columns={[
                "ID",
                "Verifying Institution",
                "Date",
                "Documents",
                "Status",
                /* "Total Amount", */
                "Actions",
                ]}
                loadingState={isLoading}
                columnSortKeys={{
                ID: "unique_code",
                "Requested By": "user_full_name",
                Date: "created_at",
                Document: "document_type_name",
                Status: "status",
                Amount: "total_amount",
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
                {verificationRequests?.map((item) => (
                <TableRow
                    key={item?.id}
                    className="odd:bg-gray-100 even:bg-white border-b"
                >
                    <TableCell className="font-semibold">
                    {item?.unique_code}
                    </TableCell>
                    <TableCell className="font-semibold">
                    <CustomUser
                        avatarSrc={`https://admin-dev.baccheck.online/storage/${item?.receiving_institution?.logo}`}
                        name={`${item?.receiving_institution?.name}`}
                        email={`${item?.receiving_institution?.institution_email}`}
                    />
                    </TableCell>
                    <TableCell>
                    {moment(item?.created_at).format("MMM D, YYYY")}
                    </TableCell>
                    <TableCell>
                    {item?.document_type?.name}
                    </TableCell>
                    <TableCell>
                    <StatusChip status={item?.status} />
                    </TableCell>
                    {/* <TableCell> GH¢ {item?.total_amount}</TableCell> */}
                    <TableCell className="flex items-center h-16 gap-3">
                    <Button
                        size="sm"
                        radius="none"
                        color="success"
                        className="rounded-[4px] text-white"
                        onClick={async () => {
                        if (item?.status === "processing") {
                            await fetchVerificationChecklist(item?.document_type?.id);
                        }

                        setOpenDrawer(true);
                        setData(item);
                        }}
                    >
                        View
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </CustomTable>
            <PermissionWrapper permission={['e-check.create']}>
              <button
                type="button"
                onClick={() => {
                  setOpenAddDrawer(true);
                }}
                className="fixed flex items-center space-x-2 bottom-4 right-4 
                          bg-black text-white px-4 py-2 rounded-md shadow-lg 
                          hover:bg-gray-800 focus:outline-none 
                          animate-bounceSubtle ripple-button"
              >
                <FaPlus className="animate-iconPop" />
                <p>New Request</p>
              </button>
            </PermissionWrapper>

            
        </section>
        <AddRequest setOpenModal={setOpenAddDrawer} openModal={openAddDrawer} fetchVerificationRequests={institutionVerificationRequests}/>
        <Drawer
          title={
            "Request Details"
          }
          isOpen={openDrawer}
          setIsOpen={setOpenDrawer}
          classNames="w-[100vw] md:w-[45vw] xl:w-[35vw] z-10"
        >
        <div className="h-full flex flex-col -mt-2 xl:pl-2 font-semibold justify-between">
            <div className="flex flex-col gap-2 mb-6">
                <div className="grid grid-cols-3 gap-y-3 gap-x-2 border-b pb-4">
                  <div className="text-gray-500">Request ID</div>
                  <div className="col-span-2">#{data?.unique_code}</div>
                  <div className="text-gray-500">Requested Date</div>
                  <div className="col-span-2">
                      {moment(data?.created_at).format("Do MMMM, YYYY")}
                  </div>
                  <div className="text-gray-500">Status</div>
                  <div
                      className={`col-span-2 flex items-center justify-center py-1 space-x-2 w-28 
                      ${
                          data?.status === "cancelled" || data?.status === "rejected"
                          ? "text-red-600 bg-red-200"
                          : data?.status === "completed"
                          ? "text-green-600 bg-green-200"
                          : data?.status === "processing" || data?.status === "received"
                          ? "text-yellow-600 bg-yellow-200"
                          : data?.status === "created" && data?.token != null && new Date(data?.token_expires_at) < new Date()
                          ? "text-gray-600 bg-gray-200"
                          : "text-blue-600 bg-blue-200"
                      }`}
                    
                  >
                      <div
                      className={`h-2 w-2 rounded-full ${
                          data?.status === "cancelled" ||
                          data?.status === "rejected"
                          ? "bg-red-600"
                          : data?.status === "completed"
                          ? "bg-green-600"
                          : data?.status === "processing" ||
                              data?.status === "received"
                          ? "bg-yellow-600"
                          : "bg-gray-600"
                      }`}
                      ></div>
                      <p>
                        {data?.status === "created" && data?.token != null && new Date(data?.token_expires_at) < new Date()
                          ? "Expired"
                          : data?.status.charAt(0).toUpperCase() + data?.status.slice(1)}
                      </p>

                  </div>
                  {/* <div className="text-gray-500">Document Fee</div>
                  <div className="col-span-2">GH¢ {data?.total_amount}</div> */}
                  </div>
                  <div className="p">
                    <p className="font-semibold mb-4 text-base">
                        Document Owner
                    </p>
                    <div className="grid grid-cols-3 gap-y-3 border-b pb-4">
                        <div className="text-gray-500">Full Name</div>
                        <div className="col-span-2">
                        {data?.doc_owner_full_name}
                        </div>
                        <div className="text-gray-500">Email Addres</div>
                        <div className="col-span-2">{data?.doc_owner_email}</div>
                        <div className="text-gray-500">Phone Number</div>
                        <div className="col-span-2">{data?.doc_owner_phone}</div>
                        <div className="text-gray-500">Date of Birth</div>
                        <div className="col-span-2">{data?.doc_owner_dob}</div>
                    </div>
                  </div>  
                  <div className="pb-4">
                    <p className="font-semibold mb-4 text-base">
                        Verifying Institution
                    </p>
                    <div className="grid grid-cols-3 gap-y-3 border-b pb-4">
                        <div className="text-gray-500">Institution Name</div>
                        <div className="col-span-2">
                        {data?.receiving_institution?.name}
                        </div>
                        <div className="text-gray-500">Institution Email</div>
                        <div className="col-span-2">{data?.receiving_institution?.institution_email}</div>
                        <div className="text-gray-500">Phone Number</div>
                        <div className="col-span-2">{data?.receiving_institution?.helpline_contact}</div>
                        <div className="text-gray-500 mt-2">Institution Logo</div>
                        <div className="col-span-2 w-10 h-10 rounded-full bg-gray-200">
                        <img src={`https://admin-dev.baccheck.online/storage/${data?.receiving_institution?.logo}`} alt="" className="object-fit"/>
                        </div>
                    </div>
                  </div>  

                <div className="-mt-4">
                <section className="mb-3 flex items-center justify-between">
                    <div className="w-full flex gap-2 items-center">
                    <p className="font-semibold uppercase text-bChkRed">RequestAttachment</p>
                    </div>

                    {/* <Button
                    variant="ghost"
                    size="sm"
                    color="primary"
                    isLoading={bulkDownloadLoading}
                    isDisabled={bulkDownloadLoading}
                    onClick={() => {
                        setBulkDownloadLoading(true);
                        handleBulkDownload(data.files.map((f) => f.path));
                    }}
                    >
                    <FaDownload className="text-red-600" />
                    Download all
                    </Button> */}
                </section>

                <section className="grid grid-cols-1 gap-2">
                    <div className="gap-3 p-2 rounded-md border">
                    <div className="w-full flex flex-col gap-1">
                        <p className="font-semibold">
                        {data?.document_type?.name}
                        </p>
                        {/* <p>GH¢ {data?.total_amount}</p> */}

                        <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <Chip size="sm">{data?.file?.extension}</Chip>
                            <p>{filesize(data?.file?.size ?? 1000)}</p>
                        </div>
                        <div
                            className="flex space-x-1 cursor-pointer py-1 px-2 rounded-sm bg-primary text-white text-xs"
                            onClick={() => {
                            window.location.href =
                                "https://admin-dev.baccheck.online/api/download-pdf?path=" +
                                encodeURIComponent(data?.file?.path);
                            }}
                        >
                            <FaDownload />
                            <p>Download</p>
                        </div>
                        </div>
                    </div>
                    </div>
                </section>
                <section className="flex flex-col mt-2">
                  <p className="uppercase font-semibold py-2 text-bChkRed">Verification Request Documents</p>

                  <div className="flex flex-col space-y-2">
                    {/* Show Loading Spinner */}
                    {isFetching ? (
                      <div className="flex justify-center items-center col-span-2">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                      </div>
                    ) : (
                      <>
                        {/* Display Reports if available */}
                        {/* {requestLetter && (
                          <div className="gap-3 p-2 rounded-md border">
                            <div className="w-full flex justify-between">
                              <div className="w-full flex space-x-2 items-center">
                                <FaFilePdf size={36} className="text-bChkRed" />
                                <div className="flex flex-col space-y-1">
                                  <p>Request Letter</p>
                                  <div className="text-xs font-semibold -mt-1">
                                    <p>From: <span className="font-normal text-gray-500">{data?.sending_institution?.name}</span></p>
                                  </div>
                                </div>
                              </div>
                              
                              <div
                                className="flex self-end space-x-1 items-center cursor-pointer py-1 px-2 rounded-sm bg-blue-600 text-white text-xs w-20"
                                onClick={() => window.open(requestLetter, "_blank")}
                              >
                                <IoIosOpen size={16} />
                                <p>Open</p>
                              </div>
                            </div>
                          </div>
                        )} */}
                        {/* {authLetter && (
                          <div className="gap-3 p-2 rounded-md border">
                            <div className="w-full flex justify-between">
                              <div className="w-full flex space-x-2 items-center">
                                <FaFilePdf size={36} className="text-bChkRed" />
                                <div className="flex flex-col space-y-1">
                                  <p>Authorisation Letter</p>
                                  <div className="text-xs font-semibold -mt-1">
                                    <p>From: <span className="font-normal text-gray-500">{data?.doc_owner_full_name}</span></p>
                                  </div>
                                </div>
                              </div>
                              
                              <div
                                className="flex self-end space-x-1 items-center cursor-pointer py-1 px-2 rounded-sm bg-blue-600 text-white text-xs w-20"
                                onClick={() => window.open(authLetter, "_blank")}
                              >
                                <IoIosOpen size={16} />
                                <p>Open</p>
                              </div>
                            </div>
                          </div>
                        )} */}

                        {verificationReport && (
                          <div className="gap-3 p-2 rounded-md border">
                            <div className="w-full flex justify-between">
                              <div className="w-full flex space-x-2 items-center">
                                <FaFilePdf size={36} className="text-bChkRed" />
                                <div className="flex flex-col space-y-1">
                                  <p>Verification Report</p>
                                  <div className="text-xs font-semibold">
                                    <p>From: <span className="font-normal text-gray-500">Bacchecker</span></p>
                                  </div>
                                </div>
                              </div>
                              
                              <div
                                className="flex self-end space-x-1 items-center cursor-pointer py-1 px-2 rounded-sm bg-blue-600 text-white text-xs w-20"
                                onClick={() => window.open(verificationReport, "_blank")}
                              >
                                <IoIosOpen size={16} />
                                <p>Open</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* No Reports Found Message */}
                        {!verificationReport && (
                          <div className="col-span-2 text-center text-gray-500 text-sm py-4">
                            No reports found.
                          </div>
                        )}
                      </>
                    )}
                  </div>

                </section>
                </div>

                <div>
                {data?.status == "rejected" && (
                    <div className="mt-3 border rounded-md p-4">
                      <div className="">
                        <p className="font-semibold text-red-600">Rejection Reason</p>
                        <p className="font-normal">{data?.rejection_reason}</p>
                      </div>

                      <div className="mt-3">
                          <div className="flex flex-row">
                            <div className="flex-1">
                              <p className="font-semibold text-red-600">Rejected By:</p>
                              <p className="font-normal">
                                {data?.doc_owner_full_name}
                              </p>
                              <p className="text-[11px] font-normal">{data?.doc_owner_email}</p>
                            </div>

                            <div className="flex-1">
                              <p className="font-semibold text-red-600">Rejection Date</p>
                              <p className="font-normal">
                                {moment(data?.updated_at).format(
                                "Do MMMM, YYYY"
                                )}
                              </p>
                            </div>
                          </div>
                      </div>
                    </div>
                )}
                </div>
            </div>

            <div className="flex items-center gap-3 justify-end mt-2">
            <Button
                radius="none"
                size="md"
                className="w-1/4 bg-black text-white font-medium !rounded-md"
                onClick={() => {
                setOpenDrawer(false);
                setData(null);
                }}
            >
                Close
            </Button>
                <PermissionWrapper permission={['e-check.create']}>
                  {data?.status === "created" && data?.token != null && new Date(data?.token_expires_at) < new Date() && (
                    <Button
                    radius="none"
                    size="md"
                    className="w-1/2 bg-gray-300 text-gray-800 font-medium !rounded-md"
                    onClick={() => changeStatusDisclosure.onOpen()}
                    >
                    Resend Request
                    </Button>
                  )}
                </PermissionWrapper>
            

            {/* {data?.status !== "created" &&
                data?.status !== "completed" &&
                data?.status !== "processing" && (
                <Button
                    radius="none"
                    className="bg-bChkRed text-white font-medium w-1/2 !rounded-md"
                    size="md"
                    onClick={() => changeStatusDisclosure.onOpen()}
                >
                    {data?.status === "submitted"
                    ? "Acknowledge Request"
                    : data?.status === "received"
                    ? "Process Request"
                    : data?.status === "rejected" || "cancelled"
                    ? "Revert Rejection"
                    : "Acknowledge Request"}
                </Button>
                )}
            {data?.status === "processing" && (
                <Button
                isLoading={isSaving}
                radius="none"
                className="bg-bChkRed text-white font-medium w-1/2 !rounded-md"
                size="md"
                onClick={handleSubmitVerificationAnswers}
                disabled={
                    !checkListSections.sections ||
                    checkListSections.sections.length === 0
                } // Disable if no sections
                >
                Submit Verifications
                </Button>
            )} */}
            </div>
        </div>
        </Drawer>

        <ConfirmModal
        processing={processing}
        disclosure={changeStatusDisclosure}
        title="Resend Verification Request"
        onButtonClick={async () => {
            setProcessing(true);
            await axios
            .post(
                `/institution/requests/verification-requests/resend/${data?.id}`
            )
            .then((res) => {
                

                setData(res?.data);
                toast.success(res.data.message);
                institutionVerificationRequests();
                changeStatusDisclosure.onClose();
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message);
                setProcessing(false);
                changeStatusDisclosure.onClose();
                return;
            });
        }}
        >
        <p className="font-quicksand">
            Are you sure to resend this document for verification?
        </p>
        </ConfirmModal>

        <DeleteModal
        disclosure={declineDisclosure}
        processing={processing}
        title="Decline Request"
        onButtonClick={async () => {
            setProcessing(true);
            await axios
            .post(
                `/institution/requests/verification-requests/${data?.id}/status`,
                {
                id: data?.id,
                institution_id: data?.institution_id,
                user_id: data?.user_id,
                unique_code: data?.unique_code,
                status: "rejected",
                rejection_reason: data?.rejection_reason,
                }
            )
            .then((res) => {
                console.log(res);

                setData(res?.data);
                setProcessing(false);
                toast.success("Request declined successfully");
                institutionVerificationRequests();
                //mutate("/institution/requests/verification-requests");
                declineDisclosure.onClose();
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message);
                setProcessing(false);
                declineDisclosure.onClose();
                return;
            });
        }}
        >
        <p className="">
            Are you sure to change status to{" "}
            <span className="font-semibold">Decline Request</span>?
        </p>

        <Textarea
            name="rejection_reason"
            label="Reason"
            onChange={(e) =>
            setData((prev) => ({ ...prev, rejection_reason: e.target.value }))
            }
        />
        </DeleteModal>
    </div>
      
    </>
  );
}
