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
  SelectItem,
  TableCell,
  TableRow,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import CustomTable from "@/components/CustomTable";
import SelectInput from "@/components/SelectInput";
import moment from "moment";
import axios from "../../utils/axiosConfig";
import StatusChip from "@/components/status-chip";
import Drawer from "@/components/Drawer";
import CustomUser from "@/components/custom-user";
import { filesize } from "filesize";
import ConfirmModal from "@/components/confirm-modal";
import DeleteModal from "@/components/DeleteModal";
import { toast } from "sonner";
import {
  FaDownload,
  FaFilePdf,
  FaHeart,
  FaRegFileImage,
} from "react-icons/fa6";
import { IoCloseCircleOutline, IoDocuments } from "react-icons/io5";
import { PiQueueFill } from "react-icons/pi";
import { FcCancel } from "react-icons/fc";
import { MdOutlineFilterAlt, MdOutlineFilterAltOff } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";
import PermissionWrapper from "@/components/permissions/PermissionWrapper";
import { IoIosOpen } from "react-icons/io";
import { Worker, Viewer } from '@react-pdf-viewer/core';

export default function ValidationRequest() {
  const changeStatusDisclosure = useDisclosure();
  const declineDisclosure = useDisclosure();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [validationRequests, setValidationRequests] = useState([]);
  const [validationReport, setValidationReport] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const user = JSON?.parse(secureLocalStorage?.getItem("user"))?.user;
  const [documentTypes, setDocumentTypes] = useState([]);
  const [checklistItems, setChecklistItems] = useState({ sections: [] });
  const [allRequests, setAllRequests] = useState(0);
  const [pending, setPending] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [approved, setApproved] = useState(0);
  const [status, setStatus] = useState(null);
  const [institutionId, setInstitutionId] = useState(null);
  const [filters, setFilters] = useState({
    search_query: "",
    document_type: null,
    start_date: null,
    end_date: null,
  });
  const [submittedFilters, setSubmittedFilters] = useState({});
  const [answers, setAnswers] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleAnswerChange = (sectionIndex, questionIndex, newValue) => {
    setChecklistItems((prev) => {
      const newSections = [...prev.sections];
      const updatedSection = { ...newSections[sectionIndex] };
      const updatedItems = [...updatedSection.checklist_items];
  
      updatedItems[questionIndex] = {
        ...updatedItems[questionIndex],
        answer: newValue
      };
  
      updatedSection.checklist_items = updatedItems;
      newSections[sectionIndex] = updatedSection;
  
      return { ...prev, sections: newSections };
    });
  };
  
  const institutionValidationRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "/institution/requests/validation-requests",
        {
          params: {
            ...submittedFilters,
            page: currentPage,
            status: status,
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
      setValidationRequests(valRequest.data);
      setCurrentPage(valRequest.current_page);
      setLastPage(valRequest.last_page);
      setTotal(valRequest.total);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching institution documents:", error);
      throw error;
    }
  };

  const boolData = [
    { title: "Yes", value: "yes" },
    { title: "No", value: "no" },
  ];

  const fetchReports = async (requestId) => {
    setIsFetching(true);
    try {
        const response = await axios.get(`/pdf/digital-validation-certificate/${requestId}`, { responseType: "blob" });

        if (response && response.data) {
            const blobUrl = URL.createObjectURL(response.data);
            setValidationReport(blobUrl);
        } else {
            setValidationReport(null);
            console.warn("No data received in response.");
        }
    } catch (error) {
        console.error("Error fetching reports:", error);
    } finally {
        setIsFetching(false);
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
    institutionValidationRequests();
  }, [submittedFilters, status, currentPage, sortBy, sortOrder]);

  const downloadFile = async (fileName) => {
    try {
      const response = await axios.get(`/download-pdf/`, {
        responseType: "blob",
      });

      // Create a temporary link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file", error);
      toast.error(error.response.data.message);
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedFilters({ ...filters });
    setCurrentPage(1);
  };

  const handleDocumentTypeChange = (event) => {
    setFilters({ ...filters, document_type: event.target.value });
  };

  const handleSubmitchecklistItems = async (event) => {
    event.preventDefault();
  
    // Flatten the checklist items and attach their answers
    const allChecklistItems = checklistItems.sections.flatMap((section) =>
      section.checklist_items.map((item) => ({
        id: item.id,
        is_mandatory: item.is_mandatory,
        answer: item.answer,
      }))
    );
    console.log(allChecklistItems);
    
    // Check for unanswered mandatory items
    const unansweredItems = allChecklistItems.filter(
      (item) =>
        item.is_mandatory &&
        (item.answer === undefined || item.answer === null || item.answer === "")
    );
    
  
    if (unansweredItems.length > 0) {
      toast.error("Please provide answers to all mandatory questions before submitting.");
      return;
    }
  
    const payload = {
      validation_request_id: data?.id,
      checklist: allChecklistItems.map(({ id, answer }) => ({
        id,
        answer,
      })),
    };
  
    try {
      setIsSaving(true);
  
      const response = await axios.post(
        "/institution/requests/confirm-request-answers",
        payload
      );
  
      toast.success(response.data.message);
      setAnswers({});
      setOpenDrawer(false);
      institutionValidationRequests();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit checklist. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };
  

  const fetchChecklistItems = async (requestId) => {
    try {
      const url = `/institution/requests/validation-requests/${requestId}/checklist-items/`;
      const response = await axios.get(url);

      setChecklistItems(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div title="Validation Request">
        <section className="px-0 lg:px-3">
          <Card className="md:w-full w-full mx-auto rounded-none shadow-none border-none">
            <CardBody className="w-full bg-gray-100 p-3 lg:p-6">
              <form
                onSubmit={handleSubmit}
                className="flex flex-row gap-3 items-center"
              >
                <input
                  type="text"
                  className="bg-white text-gray-900 text-sm rounded-[4px] font-[400] focus:outline-none block w-[260px] p-[9.5px] placeholder:text-gray-500"
                  name="search_query"
                  placeholder="Search by user name or unique code"
                  value={filters.search_query}
                  onChange={(e) =>
                    setFilters({ ...filters, search_query: e.target.value })
                  }
                />

                <select
                  name="document_type"
                  value={filters.document_type || ""}
                  className={`bg-white text-sm rounded-[4px] focus:outline-none block w-[220px] p-[9px] ${
                    filters.document_type ? "text-gray-900" : "text-gray-500"
                  }`}
                  onChange={handleDocumentTypeChange}
                >
                  <option value="" className="text-gray-500" disabled selected>
                    Document Type
                  </option>
                  {documentTypes.map((item) => (
                    <option key={item.key} value={item.key}>
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
            </CardBody>
          </Card>

          <div className="my-3 w-full shadow-none rounded-lg">
            <div className="grid w-full grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
              <div
                onClick={() => {
                  setStatus("allRequests");
                }}
                className="rounded-md bg-gray-100 p-3 lg:p-4 flex space-x-4 cursor-pointer"
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
                className="rounded-md bg-gray-100 p-3 lg:p-4 flex space-x-4 cursor-pointer"
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
                className="rounded-md bg-gray-100 p-3 lg:p-4 flex space-x-4 cursor-pointer"
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
                className="rounded-md bg-gray-100 p-3 lg:p-4 flex space-x-4 cursor-pointer"
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
          </div>
        </section>

        <section className="md:px-3 md:w-full w-[98vw] mx-auto">
          <CustomTable
            columns={[
              "ID",
              "Requested By",
              "Date",
              "Documents",
              "Status",
              "Total Amount",
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
            {validationRequests?.map((item) => (
              <TableRow
                key={item?.id}
                className="odd:bg-gray-100 even:bg-white border-b"
              >
                <TableCell className="font-semibold">
                  {item?.unique_code}
                </TableCell>
                <TableCell className="font-semibold">
                  <CustomUser
                    avatarSrc={`${import.meta.env.VITE_BACCHECKER_URL}storage/${item?.user?.photo}`}
                    name={`${item?.user?.first_name} ${item?.user?.last_name}`}
                    email={`${item?.user?.email}`}
                  />
                </TableCell>
                <TableCell>
                  {moment(item?.created_at).format("MMM D, YYYY")}
                </TableCell>
                <TableCell>
                  {item.institution_document_type
                    ? item?.institution_document_type?.document_type?.name
                    : item?.document_type?.name}
                </TableCell>
                <TableCell>
                  <StatusChip status={item?.status} />
                </TableCell>
                <TableCell> GH¢ {item?.total_amount}</TableCell>
                <TableCell className="flex items-center h-16 gap-3">
                  <Button
                    size="sm"
                    radius="none"
                    color="success"
                    className="rounded-[4px] text-white"
                    onClick={async () => {
                      if (item?.status === "processing") {
                        await fetchChecklistItems(item?.id);
                      }

                      if (item?.status === "completed") {
                        await fetchReports(item?.id);
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
        </section>

        <Drawer
          title={
            data?.status != "processing"
              ? "Validation Request Details"
              : "Validation Questions"
          }
          isOpen={openDrawer}
          setIsOpen={setOpenDrawer}
          classNames="w-[100vw] 2xl:w-[85vw] h-[100dvh] z-10"
        >
          <div className="w-full flex space-x-4 h-[100dvh] overflow-hidden -mt-4">

            {data?.file?.path && (
              <div className='hidden md:block w-full h-full overflow-hidden'>
                {["jpg", "jpeg", "png", "gif"].includes(
                    data?.file?.extension
                ) ? (
                    <div className='flex-1 w-full h-[90dvh] overflow-auto border md:rounded-[0.3vw] rounded-[1vw] p-[1vw]'>
                      <img
                        src={`${import.meta.env.VITE_BACCHECKER_API_URL}/view-decrypted-file?path=${data?.file?.path}`
                        }
                        alt="Document preview"
                        className="w-full max-h-[calc(100vh-170px)] object-contain"
                      />
                    </div>
                ) : (
                    <div className="flex-1">
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <div className="border md:rounded-[0.3vw] rounded-[1vw] h-[90dvh] overflow-auto">
                          <Viewer
                            fileUrl={`${import.meta.env.VITE_BACCHECKER_API_URL}/view-decrypted-file?path=${data?.file?.path}`}
                          />
                        </div>
                      </Worker>
                    </div>
                )}
              </div>
            )}
            
            <div className="w-full lg:w-[50vw] xl:w-[45vw] h-full overflow-y-auto flex flex-col font-semibold justify-between">
              {data?.status != "processing" ? (
                <div className="flex flex-col gap-2 mb-6">
                  <div className="grid grid-cols-3 gap-y-4 gap-x-2 border-b pb-4">
                    <div className="text-gray-500">Request ID</div>
                    <div className="col-span-2">#{data?.unique_code}</div>
                    <div className="text-gray-500">Date</div>
                    <div className="col-span-2">
                      {moment(data?.created_at).format("Do MMMM, YYYY")}
                    </div>
                    <div className="text-gray-500">Status</div>
                    <div
                      className={`col-span-2 flex items-center justify-center py-1 space-x-2 w-28 
                        ${
                          data?.status === "cancelled" ||
                          data?.status === "rejected"
                            ? "text-red-600 bg-red-200"
                            : data?.status === "completed"
                            ? "text-green-600 bg-green-200"
                            : data?.status === "processing" ||
                              data?.status === "received"
                            ? "text-yellow-600 bg-yellow-200"
                            : "text-gray-600 bg-gray-200"
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
                        {data?.status.charAt(0).toUpperCase() +
                          data?.status.slice(1)}
                      </p>
                    </div>
                    <div className="text-gray-500">Total Amount</div>
                    <div className="col-span-2">GH¢ {data?.total_amount}</div>
                  </div>
                  <div className="py-4">
                    <p className="font-semibold mb-4 text-base">
                      Applicant Details
                    </p>
                    <div className="grid grid-cols-3 gap-y-4 border-b pb-4">
                      <div className="text-gray-500">Full Name</div>
                      <div className="col-span-2">
                        {data?.user?.first_name} {data?.user?.other_name}{" "}
                        {data?.user?.last_name}
                      </div>
                      <div className="text-gray-500">Email Address</div>
                      <div className="col-span-2">{data?.user?.email}</div>
                      <div className="text-gray-500">Phone Number</div>
                      <div className="col-span-2">{data?.user?.phone}</div>
                      <div className="text-gray-500 mt-2">Applicant Picture</div>
                      <div className="col-span-2 w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {data?.user?.photo && (
                          <img
                            src={`${import.meta.env.VITE_BACCHECKER_URL}storage/${data?.user?.photo}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pb-4">
                    <p className="font-semibold mb-4 text-base">
                      Academic Details
                    </p>
                    <div className="grid grid-cols-3 gap-y-4 border-b pb-4">
                      <div className="text-gray-500">Student Number</div>
                      <div className="col-span-2">
                        {data?.index_number}
                      </div>
                      <div className="text-gray-500">Program of Study</div>
                      <div className="col-span-2">{data?.program_of_study}</div>
                      <div className="text-gray-500">Start Year</div>
                      <div className="col-span-2">{data?.start_year}</div>
                      <div className="text-gray-500">End Year</div>
                      <div className="col-span-2">{data?.end_year}</div>
                    </div>
                  </div>

                  <div className="-mt-4">
                    <section className="flex items-center justify-between">
                      <div className="w-full flex gap-2 items-center">
                        <p className="uppercase font-semibold py-2 text-bChkRed">Attachments</p>
                      </div>

                      
                    </section>

                    <section className="grid grid-cols-1">
                      <div className="gap-3 p-2 rounded-md border">
                        <div className="w-full flex justify-between">
                          {/* Left: Document Info */}
                          <div className="w-full flex space-x-2 items-center">
                          {["png", "jpg", "jpeg"].includes(data?.file?.extension?.toLowerCase()) ? (
                            <FaRegFileImage size={36} className="text-bChkRed" />
                          ) : (
                            <FaFilePdf size={36} className="text-bChkRed" />
                          )}
  
                            <div className="flex flex-col space-y-1">
                              <p className="font-semibold">
                                {data?.institution_document_type?.document_type?.name}
                              </p>
                              <div className="text-xs font-semibold -mt-1">
                                <p>
                                  From:{" "}
                                  <span className="font-normal text-gray-500">
                                    {data?.user?.first_name} {data?.user?.last_name}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Right: Download Button */}
                          <div
                            className="flex self-end space-x-1 items-center cursor-pointer py-1 px-2 rounded-sm bg-blue-600 text-white text-xs w-24 justify-center"
                            onClick={() => {
                              window.location.href =
                                "${import.meta.env.VITE_BACCHECKER_API_URL}/download-pdf?path=" +
                                encodeURIComponent(data?.file?.path);
                            }}
                          >
                            <FaDownload />
                            <p>Download</p>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className="flex flex-col mt-2">
                      <p className="uppercase font-semibold py-2 text-bChkRed">Validation Report</p>
                      <div className="flex flex-col space-y-2">
                        {/* Show Loading Spinner */}
                        {isFetching ? (
                          <div className="flex justify-center items-center col-span-2">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                          </div>
                        ) : (
                          <>
                            {/* Display Reports if available */}
                            {validationReport && data?.status === "completed" ? (
                              <div className="gap-3 p-2 rounded-md border">
                                <div className="w-full flex justify-between">
                                  <div className="w-full flex space-x-2 items-center">
                                    <FaFilePdf size={36} className="text-bChkRed" />
                                    <div className="flex flex-col space-y-1">
                                      <p>Validation Report</p>
                                      <div className="text-xs font-semibold -mt-1">
                                        <p>
                                          From:{" "}
                                          <span className="font-normal text-gray-500">
                                            {data?.institution?.name}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className="flex self-end space-x-1 items-center cursor-pointer py-1 px-2 rounded-sm bg-blue-600 text-white text-xs w-20"
                                    onClick={() => window.open(validationReport, "_blank")}
                                  >
                                    <IoIosOpen size={16} />
                                    <p>Open</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
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
                      <div className="mt-3">
                        <Card className="">
                          <CardHeader>
                            <p className="font-bold">Rejection Reason</p>
                          </CardHeader>
                          <CardBody>
                            <p>{data?.rejection_reason}</p>
                          </CardBody>
                        </Card>

                        <div className="mt-3">
                          <Card className="">
                            <CardBody className="flex-row">
                              <div className="flex-1">
                                <p className="font-semibold">Rejected By:</p>
                                <p className="col-span-4">
                                  {data?.rejected_by?.first_name}{" "}
                                  {data?.rejected_by?.last_name}
                                </p>
                              </div>

                              <div className="flex-1">
                                <p className="font-bold">Rejection Date</p>
                                <p>
                                  {moment(data?.updated_at).format(
                                    "Do MMMM, YYYY"
                                  )}
                                </p>
                              </div>
                            </CardBody>
                          </Card>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="-mt-12">
                  <div className="">
                    <div className="space-y-4">
                      {checklistItems.sections &&
                      checklistItems.sections.length > 0 ? (
                        checklistItems.sections.map((section, sectionIndex) => (
                          <div
                            className="md:mt-[3vw] border p-2.5 rounded-md"
                            key={section.id}
                          >
                            <h4 className="text-sm mb-1 font-bold">
                              {section.name}
                            </h4>
                            <h4 className="text-xs mb-4 font-normal">
                              {section.description}
                            </h4>
                            <div className="flex flex-col gap-4">
                            {Array.isArray(section?.checklist_items) &&
                              section.checklist_items.map((question, questionIndex) => (
                                <div className="" key={question.id}>
                                  <h4 className="text-sm mb-1 font-normal">
                                    {question.question_text}
                                    {question.is_mandatory && (
                                      <span className="text-[#f1416c]">
                                        *
                                      </span>
                                    )}
                                  </h4>
                                  {(question.input_type === "yes_no" || question.input_type === "radio") && (
                                    <SelectInput
                                      placeholder={"Select Option"}
                                      data={boolData}
                                      inputValue={question.answer || ""}
                                      onItemSelect={(selectedItem) =>
                                        handleAnswerChange(sectionIndex, questionIndex, selectedItem.value)
                                      }
                                      className="custom-dropdown-class display-md-none"
                                    />
                                  )}
                                  {(question.input_type === "text" || question.input_type === "date") && (
                                    <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                                      <input
                                        type={question.input_type}
                                        value={question.answer || ""}
                                        required={question.is_mandatory}
                                        onChange={(e) =>
                                          handleAnswerChange(sectionIndex, questionIndex, e.target.value)
                                        }
                                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0 read-only:bg-[#d8d8d8]"
                                      />
                                    </div>
                                  )}
                                  {question.input_type === "dropdown" && (
                                    <SelectInput
                                      placeholder={"Select Option"}
                                      data={
                                        JSON.parse(question.options || "[]").map((opt) => ({
                                          title: opt,
                                          value: opt
                                        }))
                                      }
                                      inputValue={question.answer || ""}
                                      onItemSelect={(selectedItem) =>
                                        handleAnswerChange(sectionIndex, questionIndex, selectedItem.value)
                                      }
                                      className="custom-dropdown-class display-md-none"
                                    />
                                  )}
                                  {question.input_type === "textarea" && (
                                    <div className="relative w-full md:h-[7vw] h-[30vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                                      <textarea
                                        value={question.answer || ""}
                                        required={question.is_mandatory}
                                        onChange={(e) =>
                                          handleAnswerChange(sectionIndex, questionIndex, e.target.value)
                                        }
                                        className="w-full h-full md:p-[0.8vw] p-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                                      ></textarea>
                                    </div>
                                  )}
                                </div>
                              ))}
                              
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="md:!h-[65vh] h-[60vh] flex flex-col gap-8 items-center justify-center">
                          <img
                            src="/assets/img/no-data.svg"
                            alt="No data"
                            className="w-1/4 h-auto"
                          />
                          <p className="text-center text-slate-500 font-montserrat font-medium text-base -mt-6">
                            No questions available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

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
                <PermissionWrapper permission={["validation-requests.cancel"]}>
                  {(data?.status == "received" ||
                    data?.status == "submitted") && (
                    <Button
                      radius="none"
                      size="md"
                      className="w-1/2 bg-gray-300 text-gray-800 font-medium !rounded-md"
                      onClick={() => declineDisclosure.onOpen()}
                    >
                      Decline Request
                    </Button>
                  )}
                </PermissionWrapper>

                <PermissionWrapper permission={["validation-requests.process"]}>
                  {data?.status !== "created" &&
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
                      onClick={handleSubmitchecklistItems}
                      disabled={
                        !checklistItems?.sections ||
                        checklistItems?.sections.length === 0
                      } // Disable if no sections
                    >
                      Confirm Validations
                    </Button>
                  )}
                </PermissionWrapper>
              </div>
            </div>
            
          </div>
        </Drawer>

        <ConfirmModal
          processing={processing}
          disclosure={changeStatusDisclosure}
          title="Change Request Status"
          onButtonClick={async () => {
            setProcessing(true);
            try {
              const res = await axios.post(
                `/institution/requests/validation-requests/${data?.id}/status`,
                {
                  id: data?.id,
                  institution_id: data?.institution_id,
                  user_id: data?.user_id,
                  unique_code: data?.unique_code,
                  status:
                    data?.status === "submitted"
                      ? "received"
                      : data?.status === "received"
                      ? "processing"
                      : data?.status === "rejected" ||
                        data?.status === "cancelled"
                      ? "received"
                      : "completed",
                }
              );

              if (res?.data?.status === "processing") {
                await fetchChecklistItems(data?.id);
              }

              setData(res?.data);
              toast.success("Request status updated successfully");
              institutionValidationRequests();
              changeStatusDisclosure.onClose();
            } catch (err) {
              toast.error(
                err.response.data.message || "Failed to update status"
              );
            } finally {
              setProcessing(false);
            }
          }}
        >
          <p className="font-quicksand">
            Are you sure to change status to{" "}
            <span className="font-semibold">
              {data?.status === "submitted"
                ? "Received"
                : data?.status === "received"
                ? "Processing"
                : data?.status === "rejected" || data?.status === "cancelled"
                ? "Received"
                : "Complete Request"}
            </span>
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
                `/institution/requests/validation-requests/${data?.id}/status`,
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
                setData(res?.data);
                setProcessing(false);
                toast.success("Request declined successfully");
                institutionValidationRequests();
                //mutate("/institution/requests/validation-requests");
                declineDisclosure.onClose();
              })
              .catch((err) => {
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
