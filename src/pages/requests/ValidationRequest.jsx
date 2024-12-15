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
import CustomTable from "../../components/CustomTable";
import moment from "moment";
import axios from "../../utils/axiosConfig";
import StatusChip from "../../components/status-chip";
import Drawer from "../../components/Drawer";
import CustomUser from "../../components/custom-user";

import { filesize } from "filesize";
import ConfirmModal from "../../components/confirm-modal";
import DeleteModal from "../../components/DeleteModal";
import {toast} from "sonner";
import { FaChevronLeft, FaChevronRight, FaDownload, FaHeart, FaRegCircleCheck } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { PiQueueFill } from "react-icons/pi";
import { FcCancel } from "react-icons/fc";
import { GiCancel } from "react-icons/gi";
import { MdOutlineFilterAlt, MdOutlineFilterAltOff } from "react-icons/md";

export default function ValidationRequest() {
  const changeStatusDisclosure = useDisclosure();
  const declineDisclosure = useDisclosure();

  const [bulkDownloadLoading, setBulkDownloadLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dateRange, setDateRange] = useState({});
  const [validationRequests, setValidationRequests] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const [documentTypes, setDocumentTypes] = useState([]);
  const [checkListSections, setCheckListSections] = useState([]);
  const [allRequests, setAllRequests] = useState(0);
  const [pending, setPending] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [approved, setApproved] = useState(0);
  const [status, setStatus] = useState(null);
  const [filters, setFilters] = useState({
    search_query: "",
    document_type: null,
    start_date: null,
    end_date: null,
  });
  const [submittedFilters, setSubmittedFilters] = useState({});
  const [answers, setAnswers] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (itemId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const institutionValidationRequests = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("/institution/requests/validation-requests", {
        params: {
          ...submittedFilters,
          page: currentPage,
          status: status,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });

      const valRequest = response.data.paginatedRequests;

      setAllRequests(response.data.allRequests)
      setPending(response.data.pending)
      setApproved(response.data.approved)
      setRejected(response.data.rejected)
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

    fetchInstitutionDocs();
  }, []);

  useEffect(() => {
    institutionValidationRequests();
  }, [submittedFilters, status, currentPage, sortBy, sortOrder]);

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

  const handleBulkDownload = async (filePaths) => {
    try {
      const csrfTokenMeta = document?.querySelector('meta[name="csrf-token"]');
      const csrfToken = csrfTokenMeta?.getAttribute("content");

      const headers = {
        "Content-Type": "application/json",
      };

      // Only add X-CSRF-TOKEN if the token exists
      if (csrfToken) {
        headers["X-CSRF-TOKEN"] = csrfToken;
      }

      const response = await fetch(
        "https://backend.baccheck.online/api/document/bulk-download",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ files: filePaths }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bulk_download.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setBulkDownloadLoading(false);
    } catch (error) {
      console.error("Error downloading files:", error);
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

  const handleSubmitValidationAnswers = async (event) => {
    event.preventDefault();

    const allItemIds = checkListSections.sections.flatMap((section) =>
      section.items.map((item) => item.id)
    );
  
    // Check if every item has an answer
    const unansweredItems = allItemIds.filter((itemId) => !answers[itemId] || answers[itemId].trim() === "");
  
    if (unansweredItems.length > 0) {
      // Show an error message and prevent submission
      toast.error("Please provide answers to all questions before submitting.");
      return;
    }
    
    const payload = {
      validation_request: data?.id, // Include validation_request_id
      checklist: Object.keys(answers).map((itemId) => ({
          id: itemId,
          value: answers[itemId],
      })),
    };
    
    try {
      setIsSaving(true);

      const response = await axios.post("/institution/requests/validation-request-answers", payload);

      if (response.status === 201) {
        toast.success(response.data.message);
        setAnswers({});
        setOpenDrawer(false);
        institutionValidationRequests();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit checklist. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const fetchValidationChecklist = async (documentTypeId) => {
    try {
      const url = `/validation-checklist-items/${documentTypeId}`;
      const response = await axios.get(url);
      setCheckListSections(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  return (
    <div title="Validation Request">
      <section className="px-2">
        <Card className="md:w-full w-[98vw] mx-auto rounded-none dark:bg-slate-900">
          <CardBody className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-row gap-3 items-center">
              <Input
                radius="none"
                name="search_query"
                placeholder="Search unique code, user name, user phone number"
                value={filters.search_query}
                onChange={(e) => setFilters({ ...filters, search_query: e.target.value })}
                size="md"
                className="max-w-xs min-w-[200px] rounded-sm"
              />

              <Select
                aria-label="Document Type"
                radius="none"
                size="md"
                placeholder="Document Type"
                className="max-w-[230px] min-w-[230px] rounded-sm"
                name="document_type"
                value={filters.document_type || ""}
                onChange={handleDocumentTypeChange}
              >
                {documentTypes.map((item) => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.name}
                  </SelectItem>
                ))}
              </Select>

              <DateRangePicker
                radius="none"
                visibleMonths={2}
                className="w-[30%] rounded-sm"
                onChange={(date) => {
                  if (date) {
                    const newStartDate = new Date(date.start.year, date.start.month - 1, date.start.day)
                      .toISOString()
                      .split("T")[0];
                    const newEndDate = new Date(date.end.year, date.end.month - 1, date.end.day)
                      .toISOString()
                      .split("T")[0];

                    setFilters({ ...filters, start_date: newStartDate, end_date: newEndDate });
                  }
                }}
              />
              <div className="flex space-x-2">
                
                <Button
                  startContent={<MdOutlineFilterAlt size={17}/>}
                  radius="none"
                  size="sm"
                  type="submit"
                  className="rounded-sm bg-bChkRed text-white"
                >
                  Filter
                </Button>
                <Button
                  startContent={<MdOutlineFilterAltOff size={17}/>}
                  radius="none"
                  size="sm"
                  type="button"
                  className="rounded-sm bg-black text-white"
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
                  Delete
                </Button>
              </div>
              
            </form>
          </CardBody>
        </Card>
        
        <Card className="my-3 md:w-full w-[98vw] mx-auto border-none shadow-none rounded-lg dark:bg-slate-900">
          <CardBody className="grid w-full grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => {
                setStatus('allRequests')
              }}
              className="rounded-md bg-gray-100 p-4 flex space-x-4 cursor-pointer">
                <div className="flex items-center justify-center bg-purple-200 text-purple-800 rounded-full w-10 h-10">
                  <IoDocuments size={18}/>
                </div>
                <div className="">
                  <p className="font-medium">Total Documents</p>
                  <p className="text-gray-500">{allRequests}</p>
                </div>
            </div>
            <div
              onClick={() => {
                setStatus('pending')
              }}
              className="rounded-md bg-gray-100 p-4 flex space-x-4 cursor-pointer">
                <div className="flex items-center justify-center bg-yellow-200 text-yellow-500 rounded-full w-10 h-10">
                  <PiQueueFill size={18}/>
                </div>
                <div className="">
                  <p className="font-medium">Pending</p>
                  <p className="text-gray-500">{pending}</p>
                </div>
            </div>
            <div
              onClick={() => {
                setStatus('approved')
              }}
              className="rounded-md bg-gray-100 p-4 flex space-x-4 cursor-pointer">
                <div className="flex items-center justify-center bg-green-200 text-green-600 rounded-full w-10 h-10">
                  <FaHeart size={18}/>
                </div>
                <div className="">
                  <p className="font-medium">Approved</p>
                  <p className="text-gray-500">{approved}</p>
                </div>
            </div>
            <div
              onClick={() => {
                setStatus('rejected')
              }}
              className="rounded-md bg-gray-100 p-4 flex space-x-4 cursor-pointer">
                <div className="flex items-center justify-center bg-red-200 text-red-600 rounded-full w-10 h-10">
                  <FcCancel size={18}/>
                </div>
                <div className="">
                  <p className="font-medium">Not Approved</p>
                  <p className="text-gray-500">{rejected}</p>
                </div>
            </div>
          </CardBody>
        </Card>
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
        >
          {validationRequests?.map((item) => (
            <TableRow key={item?.id} className="odd:bg-gray-100 even:bg-white border-b dark:text-slate-700">
              <TableCell className="font-semibold">
                {item?.unique_code}
              </TableCell>
              <TableCell className="font-semibold">
                <CustomUser
                  avatarSrc={item?.user?.photo}
                  name={`${item?.user?.first_name} ${item?.user?.last_name}`}
                  email={`${item?.user?.email}`}
                />
              </TableCell>
              <TableCell>
                {moment(item?.created_at).format("Do MMMM, YYYY")}
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
                  color="success"
                  onClick={async () => {
                    if (item?.status === "processing") {
                      await fetchValidationChecklist(item?.document_type?.id);
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

      <Drawer
        title={data?.status != 'processing' ? 'Request Details' : 'Validation Questions'}
        isOpen={openDrawer}
        setIsOpen={setOpenDrawer}
        classNames="w-[100vw] md:w-[45vw]"
      >
        <div className="h-full flex flex-col -mt-2 xl:pl-2 font-semibold justify-between">
          {data?.status != "processing" ?
          (
            <div className="flex flex-col gap-2 mb-6">
              <div className="grid grid-cols-3 gap-y-4 gap-x-2 border-b pb-4">
                <div className="text-gray-500">
                  Request ID
                </div>
                <div className="col-span-2">
                  #{data?.unique_code}
                </div>
                <div className="text-gray-500">
                  Requested Date
                </div>
                <div className="col-span-2">
                  {moment(data?.created_at).format("Do MMMM, YYYY")}
                </div>
                <div className="text-gray-500">
                  Status
                </div>
                <div
                  className={`col-span-2 flex items-center justify-center py-1 space-x-2 w-28 
                    ${
                      data?.status === 'cancelled' || data?.status === 'rejected'
                        ? 'text-red-600 bg-red-200'
                        : data?.status === 'completed'
                        ? 'text-green-600 bg-green-200'
                        : data?.status === 'processing' || data?.status === 'received'
                        ? 'text-yellow-600 bg-yellow-200'
                        : 'text-gray-600 bg-gray-200'
                    }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      data?.status === 'cancelled' || data?.status === 'rejected'
                        ? 'bg-red-600'
                        : data?.status === 'completed'
                        ? 'bg-green-600'
                        : data?.status === 'processing' || data?.status === 'received'
                        ? 'bg-yellow-600'
                        : 'bg-gray-600'
                    }`}
                  ></div>
                  <p>{data?.status.charAt(0).toUpperCase() + data?.status.slice(1)}</p>
                </div>
                <div className="text-gray-500">
                  Total Cash
                </div>
                <div className="col-span-2">
                GH¢ {data?.total_amount}
                </div>
              </div>
              <div className="py-4">
                <p className="font-semibold mb-4 text-base">Applicant Details</p>
                <div className="grid grid-cols-3 gap-y-4 border-b pb-4">
                  <div className="text-gray-500">
                    Applicant Name
                  </div>
                  <div className="col-span-2">
                    {data?.user?.first_name} {data?.user?.other_name} {data?.user?.last_name}
                  </div>
                  <div className="text-gray-500">
                    Applicant Email
                  </div>
                  <div className="col-span-2">
                    {data?.user?.email}
                  </div>
                  <div className="text-gray-500">
                    Phone Number
                  </div>
                  <div className="col-span-2">
                    {data?.user?.phone}
                  </div>
                  <div className="text-gray-500">
                    Index Number
                  </div>
                  <div className="col-span-2">
                    {data?.index_number}
                  </div>
                  <div className="text-gray-500 mt-2">
                    Applicant Picture
                  </div>
                  <div className="col-span-2 w-10 h-10 rounded-full bg-gray-200">
                    <img src={data?.user?.profile_photo_url} alt="" />
                  </div>
                </div>
              </div>

              <div className="-mt-4">
                <section className="mb-3 flex items-center justify-between">
                  <div className="w-full flex gap-2 items-center">
                    <p className="font-semibold ">Attachments</p>
                  </div>

                  <Button
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
                    <FaDownload className="text-red-600"/>
                    Download all
                  </Button>
                </section>

                <section className="grid grid-cols-2 gap-2">
                  <div className="gap-3 p-2 rounded-lg border dark:border-white/10">
                    <div className="w-full flex flex-col gap-1">
                      <p className="font-semibold">{data?.document_type?.name}</p>
                      <p>GH¢ {data?.total_amount}</p>

                      <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                          <Chip size="sm">{data?.file?.extension}</Chip>
                          <p>{filesize(data?.file?.size ?? 1000)}</p>
                        </div>
                        <div
                          className="flex space-x-1 cursor-pointer py-1 px-2 rounded-md bg-primary text-white text-xs"
                          onClick={() => {
                            window.location.href =
                              "https://backend.baccheck.online/api/document/download" +
                              "?path=" +
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
              </div>

              <div>
                {data?.status == "rejected" && (
                  <div className="mt-3">
                    <Card className="dark:bg-slate-950">
                      <CardHeader>
                        <p className="font-bold">Rejection Reason</p>
                      </CardHeader>
                      <CardBody>
                        <p>{data?.rejection_reason}</p>
                      </CardBody>
                    </Card>

                    <div className="mt-3">
                      <Card className="dark:bg-slate-950">
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
                              {moment(data?.updated_at).format("Do MMMM, YYYY")}
                            </p>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ):(
            <div className="-mt-2">
              <div className="">
                {/* <div className="mb-4">
                  <p className="text-base">Student Information</p>
                  <p className="font-light text-gray-700 text-xs">Student Information or Bio Data</p>
                </div> */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-6">
                  {/* {questions.map((question) => (
                    <div key={question.id} className="flex flex-col">
                      
                      <div>
                        <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{question.text}</label>
                        <input type="text" id="first_name" value={'Joseph Abban'} class="border bg-white border-gray-300 text-gray-700 font-normal text-sm rounded-sm focus:outline-none block w-full p-2.5" placeholder="John" required />
                      </div>

                      <div className="flex space-x-4 text-base text-gray-600 font-normal mt-1">
                        
                        <div
                          className={`flex items-center justify-center space-x-2 cursor-pointer ${
                            answers[question.id] === "yes" ? "text-green-600" : "text-gray-600"
                          }`}
                          onClick={() => handleAnswerChange(question.id, "yes")}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value="yes"
                            checked={answers[question.id] === "yes"}
                            onChange={() => handleAnswerChange(question.id, "yes")}
                            className="hidden"
                          />
                          <FaRegCircleCheck size={18} />
                          <p>Yes</p>
                        </div>

                        <div
                          className={`flex items-center justify-center space-x-2 cursor-pointer ${
                            answers[question.id] === "no" ? "text-red-600" : "text-gray-600"
                          }`}
                          onClick={() => handleAnswerChange(question.id, "no")}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value="no"
                            checked={answers[question.id] === "no"}
                            onChange={() => handleAnswerChange(question.id, "no")}
                            className="hidden"
                          />
                          <GiCancel size={18} />
                          <p>No</p>
                        </div>
                      </div>
                    </div>
                  ))} */}
                  
                </div>
                <div className="space-y-2">
                {checkListSections.sections && checkListSections.sections.length > 0 ? (
                  checkListSections.sections.map((section) => (
                    <div key={section.id} className="space-y-4 pb-4 border p-3 rounded-md">
                      {/* Section Header */}
                      <h2 className="text-base">{section.name}</h2>
                      {section.description && (
                        <p className="font-light text-gray-700 text-xs">{section.description}</p>
                      )}

                      {/* Render Items */}
                    <div className="space-y-4">
                      {section.items.map((item) => (
                        <div key={item.id} className="space-y-2">
                          {/* Question Text */}
                          <p className="text-sm font-normal">{item.question_text}</p>

                          {/* Input Types */}
                          {item.input_type === "yes_no" && (
                            <div className="flex space-x-4 text-base text-gray-600">
                              {/* Yes Option */}
                              <div
                                className={`flex items-center justify-center space-x-2 cursor-pointer border pr-2 font-normal rounded-[4px] py-0.5 ${
                                  answers[item.id] === "yes"
                                    ? "text-green-600 border-green-600"
                                    : "text-gray-600"
                                }`}
                                onClick={() => handleChange(item.id, "yes")}
                              >
                                <input
                                  type="radio"
                                  name={item.id}
                                  value="yes"
                                  checked={answers[item.id] === "yes"}
                                  onChange={() => handleChange(item.id, "yes")}
                                  className="hidden"
                                />
                                <FaRegCircleCheck size={18} />
                                <span>Yes</span>
                              </div>

                              {/* No Option */}
                              <div
                                className={`flex items-center justify-center space-x-2 cursor-pointer border font-normal rounded-[4px] pr-2 py-0.5 ${
                                  answers[item.id] === "no"
                                    ? "text-red-600 border-red-600"
                                    : "text-gray-600"
                                }`}
                                onClick={() => handleChange(item.id, "no")}
                              >
                                <input
                                  type="radio"
                                  name={item.id}
                                  value="no"
                                  checked={answers[item.id] === "no"}
                                  onChange={() => handleChange(item.id, "no")}
                                  className="hidden"
                                />
                                <GiCancel size={18} />
                                <span>No</span>
                              </div>
                            </div>
                          )}

                          {item.input_type === "text" && (
                            <textarea
                              className="w-full border rounded p-2 text-gray-700 focus:outline-none"
                              rows="3"
                              placeholder="Enter your answer..."
                              value={answers[item.id] || ""}
                              onChange={(e) => handleChange(item.id, e.target.value)}
                            ></textarea>
                          )}

                          {item.input_type === "dropdown" && (
                            <select
                              className="w-full border rounded p-2.5 text-gray-700 focus:outline-none"
                              value={answers[item.id] || ""}
                              onChange={(e) => handleChange(item.id, e.target.value)}
                            >
                              <option value="" disabled>
                                Select an option...
                              </option>
                              {item.options.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      ))}
                    </div>

                    </div>
                  ))
                ) : (
                  <div className="md:!h-[65vh] h-[60vh] flex flex-col gap-8 items-center justify-center">
                    <img src="/assets/img/no-data.svg" alt="No data" className="w-1/4 h-auto" />
                    <p className="text-center text-slate-500 dark:text-slate-400 font-montserrat font-medium text-base -mt-6">
                      No questions available
                    </p>
                  </div>
                )}
                

                </div>
              </div>
              
              
            </div>
          )
          }
          

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

            {(data?.status == "received" || data?.status == "submitted") && (
              <Button
                radius="none"
                size="md"
                className="w-1/2 bg-gray-300 text-gray-800 font-medium !rounded-md"
                onClick={() => declineDisclosure.onOpen()}
              >
                Decline Request
              </Button>
            )}

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
                  onClick={handleSubmitValidationAnswers}
                  disabled={!checkListSections.sections || checkListSections.sections.length === 0} // Disable if no sections
                >
                  Submit Validations
                </Button>
              )}
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        processing={processing}
        disclosure={changeStatusDisclosure}
        title="Change Request Status"
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
                status:
                  data?.status == "submitted"
                    ? "received"
                    : data?.status == "received"
                    ? "processing"
                    : data?.status == "rejected" || "cancelled"
                    ? "received"
                    : "completed",
              }
            )
            .then((res) => {
              console.log(res);
              if(data?.status == "processing"){
                fetchValidationChecklist()
              }

              setData(res?.data);
              setProcessing(false);
              toast.success("Request status updated successfully");
              institutionValidationRequests();
              //mutate("/institution/requests/validation-requests");
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
          Are you sure to change status to{" "}
          <span className="font-semibold">
            {data?.status == "submitted"
              ? "Received"
              : data?.status == "received"
              ? "Processing"
              : data?.status == "rejected" || "cancelled"
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
              console.log(res);

              setData(res?.data);
              setProcessing(false);
              toast.success("Request declined successfully");
              institutionValidationRequests();
              //mutate("/institution/requests/validation-requests");
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
          <span className="font-semibold">Delicne Request</span>?
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
  );
}
