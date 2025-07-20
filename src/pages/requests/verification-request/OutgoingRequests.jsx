import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  DateRangePicker,
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
import AddRequest from "./AddRequest";
import PermissionWrapper from "../../../components/permissions/PermissionWrapper";
import { FaFilePdf } from "react-icons/fa";
import { IoIosOpen } from "react-icons/io";
import LaterPaymentForm from "./LaterPaymentForm";

export default function OutgoingRequests() {
  const changeStatusDisclosure = useDisclosure();
  const declineDisclosure = useDisclosure();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [currentScreen, setCurrentScreen] = useState(1);
  const [total, setTotal] = useState(0);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPaymentScreen, setCurrentPaymentScreen] = useState(1);
  const [verificationReport, setVerificationReport] = useState("");
  const [filters, setFilters] = useState({
    search_query: "",
    status: null,
    start_date: null,
    end_date: null,
  });
  const [submittedFilters, setSubmittedFilters] = useState({});

  const statusData = [
    { value: "created", name: "Created" },
    { value: "submitted", name: "Submitted" },
    { value: "received", name: "Received" },
    { value: "processing", name: "Processing" },
    { value: "rejected", name: "Rejected" },
    { value: "completed", name: "Completed" },
];
  

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
        const [verificationReport] = await Promise.all(requests);
  
        // Convert blobs to URLs only if response is valid
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

  /* useEffect(() => {
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
    fetchInstitutionDocs();
  }, []); */

  useEffect(() => {
    institutionVerificationRequests();
  }, [submittedFilters, currentPage, sortBy, sortOrder]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedFilters({ ...filters });
    setCurrentPage(1);
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
                        avatarSrc={`${import.meta.env.VITE_BACCHECKER_URL}storage/${item?.receiving_institution?.logo}`}
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
                      {item?.payment_status === "pending" ? (
                        <Chip size="sm" className="bg-yellow-200 text-yellow-800">
                          Pending Payment
                        </Chip>
                        ) : (
                          <StatusChip status={item?.status} />
                        )
                      }
                    </TableCell>
                    {/* <TableCell> GH¢ {item?.total_amount}</TableCell> */}
                    <TableCell className="flex items-center h-16 gap-3">
                    <Button
                        size="sm"
                        radius="none"
                        color="success"
                        className="rounded-[4px] text-white"
                        onClick={async () => {
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
        <AddRequest 
          setOpenModal={setOpenAddDrawer} 
          openModal={openAddDrawer} 
          fetchVerificationRequests={institutionVerificationRequests}
        />
        <Drawer
          title={
            "Request Details"
          }
          isOpen={openDrawer}
          setIsOpen={setOpenDrawer}
          classNames="w-[100vw] md:w-[45vw] xl:w-[35vw] z-10"
        >
          <div className="tab-container">
            <div className="flex flex-col sticky top-0 z-[40] -mt-8 ">
              <div className="tab_box bg-[#F4F4F4] md:mt-[1vw] mt-[2vw] md:p-[0.5vw] p-[3vw] md:rounded-[0.4vw] rounded-[2vw] flex justify-between">
                <button
                  onClick={() => setCurrentScreen(1)}
                  className={`tab_btn md:py-[0.5vw] md:px-[3.5vw] py-[3vw] px-[5vw] md:text-[0.8vw] text-[3vw] md:rounded-[0.2vw] rounded-[1vw] ${
                    currentScreen === 1 && "active-tab"
                  }`}
                >
                  Applicants Details
                </button>
                <button
                  onClick={() => setCurrentScreen(2)}
                  className={`tab_btn md:py-[0.5vw] md:px-[3.5vw] py-[3vw] px-[5vw] md:text-[0.8vw] text-[3vw] md:rounded-[0.2vw] rounded-[1vw] ${
                    currentScreen === 2 && "active-tab"
                  }`}
                >
                  Payment Details
                </button>
              </div>
            </div>
            {currentScreen === 1 && (
              <div className="h-full flex flex-col xl:pl-2 font-semibold justify-between mt-2">
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
                              <div className="col-span-2 w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                <img
                                  src={`${import.meta.env.VITE_BACCHECKER_URL}/storage/${data?.receiving_institution?.logo}`}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>

                          </div>
                        </div>  

                      <div className="-mt-4">
                      <section className="mb-3 flex items-center justify-between">
                          <div className="w-full flex gap-2 items-center">
                          <p className="font-semibold uppercase text-bChkRed">Request Attachment</p>
                          </div>

                      </section>

                      <section className="grid grid-cols-1 gap-2">
                          <div className="gap-3 p-2 rounded-md border">
                            <div className="w-full flex flex-col gap-1">
                              <p className="font-semibold">
                                {data?.document_type?.name}
                              </p>

                              {!data?.file?.path ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                  <i className="bx bxs-file-pdf text-5xl text-gray-400"></i>
                                  <p className="text-gray-500 text-sm mt-2">
                                    No document attached
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <div className="flex justify-between mt-2">
                                    <div className="flex gap-2 items-center">
                                      <Chip size="sm">
                                        {data?.file?.extension}
                                      </Chip>
                                      <p>
                                        {filesize(data?.file?.size ?? 1000)}
                                      </p>
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
                                </>
                              )}
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
                  
                  </div>
              </div>
            )}
            {currentScreen === 2 && (
              <div className="content">
                {data?.payment?.length > 0 ? (
                  <>
                    <div className="md:mt-[2vw] mt-[8vw]">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">
                        Amount Paid
                      </h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="text"
                          readOnly
                          value={`${data?.payment[0]?.currency == 'USD' ? '$' : 'GH¢'} ${data?.payment[0]?.amount}`}
                          className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                        />
                      </div>
                    </div>
                    <div className="md:mt-[2vw] mt-[8vw]">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">
                        Payment Channel
                      </h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="text"
                          readOnly
                          value={
                            data?.payment[0]?.payment_method?.toLowerCase() ===
                              "mtn" ||
                            data?.payment[0]?.payment_method?.toLowerCase() ===
                              "telecel"
                              ? "Mobile Money"
                              : "Card"
                          }
                          className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                        />
                      </div>
                    </div>
                    <div className="md:mt-[2vw] mt-[8vw]">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">
                        Payment Method
                      </h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="text"
                          readOnly
                          value={data?.payment[0]?.payment_method}
                          className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                        />
                      </div>
                    </div>
                    <div className="md:mt-[2vw] mt-[8vw]">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">
                        {data?.payment[0]?.payment_method?.toLowerCase() ===
                          "mtn" ||
                        data?.payment[0]?.payment_method?.toLowerCase() ===
                          "telecel"
                          ? "Mobile Money Number"
                          : "Account Number"}
                      </h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="number"
                          readOnly
                          value={data?.payment[0]?.payment_detail}
                          className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                        />
                      </div>
                    </div>
                    <div className="md:mt-[2vw] mt-[8vw]">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">
                        Payment Status
                      </h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="text"
                          readOnly
                          value={
                            data?.payment[0]?.status?.toLowerCase() ===
                            "success"
                              ? "Paid"
                              : data?.payment[0]?.status
                          }
                          className={`w-full h-full md:px-[0.8vw] px-[2vw] ${
                            data?.payment[0]?.status?.toLowerCase() ===
                            "success"
                              ? "text-[#007004]"
                              : "text-[#ff0404]"
                          } md:text-[1vw] text-[3.5vw] capitalize focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0`}
                        />
                      </div>
                    </div>
                    <div className="md:mt-[2vw] mt-[8vw]">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">
                        Date & Time
                      </h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="text"
                          readOnly
                          value={moment(
                            data?.payment[0]?.created_at
                          ).format("YYYY-MM-DD H:m:s")}
                          className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                        />
                      </div>
                    </div>
                    <div className="md:mt-[2vw] mt-[8vw]">
                      <h4 className="md:text-[1vw] text-[4vw] mb-1">
                        Transaction ID
                      </h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="text"
                          readOnly
                          value={data?.payment[0]?.transaction_id}
                          className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center mt-[2vw]">
                    {currentPaymentScreen === 1 && (
                     <>
                      <h4 className="text-[3.5vw] md:text-[1.1vw]">
                        Payment has not been made
                      </h4>
                      <button
                        type="button"
                        onClick={() => setCurrentPaymentScreen(2)}
                        className="bg-[#FF0404] md:my-[2vw!important] my-[4vw!important] w-[45%] flex justify-center items-center md:py-[0.7vw] py-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#fa6767]"
                      >
                        <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                          Make Payment
                        </h4>
                      </button>
                     </> 
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {currentPaymentScreen === 2 && Array.isArray(data?.payment) && data.payment.length === 0 &&  (
            <LaterPaymentForm
              uniqueRequestedCode={data?.unique_code}
              requestBody={data}
            />
          )}
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
