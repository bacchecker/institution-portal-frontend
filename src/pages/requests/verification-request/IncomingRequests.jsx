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
  Tabs,
  Tab,
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
  FaRegCircleCheck,
  FaCircleUser,
} from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { MdOutlineFilterAlt, MdOutlineFilterAltOff } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";
import { IoIosOpen } from "react-icons/io";
import { BsFillInfoCircleFill } from "react-icons/bs";
import PermissionWrapper from "../../../components/permissions/PermissionWrapper";
import { Worker, Viewer } from '@react-pdf-viewer/core';

export default function IncomingRequests() {
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
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const user = JSON?.parse(secureLocalStorage?.getItem("user"))?.user;
  const [documentTypes, setDocumentTypes] = useState([]);
  const [verificationReport, setVerificationReport] = useState(null);
  const [requestLetter, setRequestLetter] = useState(null);
  const [authLetter, setAuthLetter] = useState(null);
  const [checkListSections, setCheckListSections] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [institutionId, setInstitutionId] = useState(null);
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
    { value: "submitted", name: "Submitted" },
    { value: "received", name: "Received" },
    { value: "processing", name: "Processing" },
    { value: "rejected", name: "Rejected" },
    { value: "completed", name: "Completed" },
  ];
  
  const reasonMappings = {
    // Document Authenticity
    "tamper": ["Signs of tampering (erasures, mismatched fonts, corrections)", "Ink inconsistencies", "Document appears altered"],
    "format": ["Format does not match institution standards", "Unrecognized document template", "Incorrect document type"],
    "valid timeframe": ["Document is expired", "Issued date is missing", "Document issued before/after allowed timeframe"],
  
    // Document Owner Identity
    "name on the document": ["Name mismatch with institution records", "Multiple names found", "Name not legible"],
    "student ID": ["Student ID does not exist", "Mismatch with institution records", "Invalid ID format"],
    "photo": ["Photo is missing", "Photo does not match records", "Photo quality is too low to verify identity"],
  
    // Institution Legitimacy
    "accreditation": ["Institution is not recognized by accreditation bodies", "Accreditation expired", "Accreditation body not verified"],
    "official database": ["Institution not listed in official directories", "Mismatch with official data", "Verification unavailable"],
    "website and contact": ["Website not found", "Invalid contact details", "Institution website is down"],
  
    // Academic Content
    "degree/program": ["Degree/program mismatch with records", "Degree not recognized", "Incorrect program title"],
    "dates": ["Enrollment/graduation dates do not match", "Date format error", "Missing date information"],
    "curriculum": ["Inconsistent academic details", "Course content mismatch", "Unrecognized curriculum"],
  
    // Grades and Credentials
    "grades": ["Grades do not match records", "Grade format error", "Missing grades"],
    "courses": ["Course list mismatch with curriculum", "Course code discrepancies", "Courses missing from transcript"],
    "GPA": ["GPA is inaccurate", "Cumulative score not matching", "Invalid GPA format"],
  
    // Security Features
    "watermark": ["Watermark not found", "Watermark inconsistent with standard", "Faded or unclear watermark"],
    "seal or signature": ["Official seal missing", "Signature mismatch", "Seal appears altered"],
  
    // Authorized Signatory
    "authorized person": ["Unauthorized signatory", "Name/signature does not match records", "Signature missing"],
    "stamped": ["Document not stamped", "Department stamp missing", "Approval not clear"],
  };
  
  
  const getPossibleReasons = (questionText) => {
    const reasons = [];
    Object.keys(reasonMappings).forEach((keyword) => {
      if (questionText.toLowerCase().includes(keyword)) {
        reasons.push(...reasonMappings[keyword]);
      }
    });
    return [...new Set(reasons), "Other (please specify)"]; // Remove duplicates and add "Other"
  };
  
  const [showCustomReason, setShowCustomReason] = useState({});
  const handleReasonChange = (id, value) => {
    if (value === "Other (please specify)") {
      setShowCustomReason((prev) => ({ ...prev, [id]: true }));
      handleChange(id, 0, ""); // Allow custom input
    } else {
      setShowCustomReason((prev) => ({ ...prev, [id]: false }));
      handleChange(id, 0, value);
    }
  };
  
  const handleChange = (itemId, isCorrect, comment = "") => {
    setAnswers((prev) => ({
      ...prev,
      [itemId]: { 
        is_correct: isCorrect ? 1 : 0,
        comment: comment 
      },
    }));
  };

  const institutionVerificationRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "/institution/requests/verification-in-requests",
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
    if (!data?.id || !data?.status) return;
    setIsFetching(true);
  
    const fetchReports = async () => {
      try {
        const requests = [];
  
        requests.push(
          axios.get(`/pdf/request-letter/${data.id}`, { responseType: "blob" })
        );
  
        if (!["created", "rejected"].includes(data.status)) {
          requests.push(
            axios.get(`/pdf/authorization-letter/${data.id}`, { responseType: "blob" })
          );
        } else {
          requests.push(Promise.resolve(null));
        }
  
        if (data.status === "completed") {
          requests.push(
            axios.get(`/pdf/verification-report/${data.id}`, { responseType: "blob" })
          );
        } else {
          requests.push(Promise.resolve(null));
        }
  
        const [reqLetter, authLetter, verificationReport] = await Promise.all(requests);
  
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
  }, [data?.id, data?.status]);
  

  useEffect(() => {
    institutionVerificationRequests();
  }, [submittedFilters, currentPage, sortBy, sortOrder]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedFilters({ ...filters });
    setCurrentPage(1);
  };

  const handleSubmitVerification = async (event) => {
    event.preventDefault();
  
    const invalidItems = Object.entries(answers).filter(
      ([, value]) => value.is_correct === 0 && (!value.comment || value.comment.trim() === "")
    );
  
    if (invalidItems.length > 0) {
      toast.error("Please provide comments for all 'No' selections.");
      return;
    }
  
    const payload = {
      answers: Object.keys(answers).map((itemId) => ({
        institution_verification_checklist_item_id: itemId,
        is_correct: answers[itemId].is_correct,
        comment: answers[itemId].comment?.trim() || null,
      })),
    };
    
    try {
      setIsSaving(true);
  
      const response = await axios.post(
        `institution/requests/verification-requests/${data.id}/checklist-answers`,
        payload
      );
  
        toast.success(response.data.message);
        setAnswers({});
        institutionVerificationRequests()
        setOpenDrawer(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit checklist. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };
  

  const fetchVerificationChecklist = async (requestId) => {
    try {
      setIsLoading(true);
      const url = `/institution/requests/verification-in-requests`;
      const response = await axios.get(url);
  
      if (response?.data?.paginatedRequests?.data?.length > 0) {
        const request = response.data.paginatedRequests.data.find(
          (req) => req.id === requestId
        );
  
        if (request?.institution_document_type?.verification_checklist_sections) {
          const sections = request.institution_document_type.verification_checklist_sections;
          setCheckListSections(sections);
  
          // Initialize answers for checklist items
          const initialAnswers = {};
          sections.forEach((section) => {
            section.items.forEach((item) => {
              initialAnswers[item.id] = "";
            });
          });
          setAnswers(initialAnswers);
        }
      }
    } catch (error) {
      console.error("Error fetching checklist data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <>
      <div title="Incoming Request">
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
                  placeholder="Search by sending institution name or unique code"
                  value={filters.search_query}
                  onChange={(e) =>
                    setFilters({ ...filters, search_query: e.target.value })
                  }
                />

                <select
                  name="status"
                  value={filters.status || ""}
                  className={`bg-white text-sm rounded-[4px] focus:outline-none block w-[220px] p-[9px] ${
                    filters.status ? "text-gray-900" : "text-gray-500"
                  }`}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="" className="text-gray-500" disabled selected>
                    Status
                  </option>
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

        <section className="md:px-3 md:w-full w-[98vw] mx-auto">
          <CustomTable
            columns={[
              "ID",
              "Requested By",
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
                    avatarSrc={`${import.meta.env.VITE_BACCHECKER_URL}storage/${item?.sending_institution?.logo}`}
                    name={`${item?.sending_institution?.name}`}
                    email={`${item?.sending_institution?.institution_email}`}
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
                        await fetchVerificationChecklist(item?.id); // Fetch based on the request ID
                      }

                      setData(item); // Set request-specific data
                      setOpenDrawer(true); // Open modal after data is set
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
          title={`Verification Request Details`}
          isOpen={openDrawer}
          setIsOpen={setOpenDrawer}
          classNames="w-[100vw] 2xl:w-[85vw] h-[100dvh] z-10"
        >
          <div className="w-full flex space-x-4 h-[100dvh] overflow-hidden -mt-4">
            {data?.file?.path ? (
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
            ): (
              <div className="hidden md:flex flex-col w-full h-[90dvh] border md:rounded-[0.3vw] rounded-[1vw] p-6">
                <div className="w-full flex space-x-6">
                  <div className="flex flex-col space-y-2">
                    <FaCircleUser size={41} className="text-gray-400"/>
                    <p className="font-medium text-lg">{data?.doc_owner_full_name}</p>
                    <p>{data?.doc_owner_dob}</p>
                    <p>{data?.doc_owner_phone}</p>
                    <p>{data?.doc_owner_email}</p>
                    
                  </div>
                  <div className="mt-[48px]">
                    <p className="text-base font-medium text-lg">Academic Info</p>
                    <div className="flex flex-col space-y-2 mb-4">
                      <div>
                        <label>Student Number</label>
                        <p className="border rounded-sm bg-gray-50 py-1.5 px-2 mt-1">{data?.doc_owner_index_number}</p>
                      </div>
                      <div>
                        <label>Program of Study</label>
                        <p className="border rounded-sm bg-gray-50 py-1.5 px-2 mt-1">{data?.doc_owner_program_of_study}</p>
                      </div>
                      <div>
                        <label>Mode of Study</label>
                        <p className="border rounded-sm bg-gray-50 py-1.5 px-2 mt-1">{data?.doc_owner_mode_of_study}</p>
                      </div>
                      <div>
                        <label>Start Year</label>
                        <p className="border rounded-sm bg-gray-50 py-1.5 px-2 mt-1">{data?.doc_owner_start_year}</p>
                      </div>
                      <div>
                        <label>End Year</label>
                        <p className="border rounded-sm bg-gray-50 py-1.5 px-2 mt-1">{data?.doc_owner_end_year}</p>
                      </div>
                    </div>
                  </div>
                  
                </div>
                <div className='hidden md:block w-full h-full overflow-hidden'>
                  {["jpg", "jpeg", "png", "gif"].includes(
                      data?.related_document?.extension
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
                
              </div>
            )}
            <div className="w-full lg:w-[50vw] xl:w-[45vw] h-full overflow-y-auto flex flex-col font-semibold justify-between">
              {data?.status != "processing" ? (
                <div className="flex flex-col gap-2 mb-6">
                  <div className="grid grid-cols-3 gap-y-4 gap-x-2 border-b pb-4">
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
                    {/* <div className="text-gray-500">Document Fee</div>
                    <div className="col-span-2">GH¢ {data?.total_amount}</div> */}
                  </div>
                  <div className="p">
                    <p className="font-semibold mb-4 text-base">Document Owner</p>
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
                  <div className="py-4">
                    <p className="font-semibold mb-4 text-base">
                      Requesting Institution
                    </p>
                    <div className="grid grid-cols-3 gap-y-4 border-b pb-4">
                      <div className="text-gray-500">Institution Name</div>
                      <div className="col-span-2">
                        {data?.sending_institution?.name}
                      </div>
                      <div className="text-gray-500">Institution Email</div>
                      <div className="col-span-2">
                        {data?.sending_institution?.institution_email}
                      </div>
                      <div className="text-gray-500">Phone Number</div>
                      <div className="col-span-2">
                        {data?.sending_institution?.helpline_contact}
                      </div>
                      <div className="text-gray-500 mt-2">Institution Logo</div>
                      <div className="col-span-2 w-10 h-10 rounded-full bg-gray-200">
                        <img
                          src={`${import.meta.env.VITE_BACCHECKER_URL}storage/${data?.sending_institution?.logo}`}
                          alt=""
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
                          {/* <p>GH¢ {data?.total_amount}</p> */}

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
                                      `${import.meta.env.VITE_BACCHECKER_API_URL}/download-pdf?path=` +
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
                            {/* Display Reports if available */}
                            {requestLetter && (
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
                            )}
                            {authLetter && (
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
                            )}
    
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
                            {!authLetter && !requestLetter && !verificationReport && (
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
                          <p className="font-semibold text-red-600">
                            Rejection Reason
                          </p>
                          <p className="font-normal">{data?.rejection_reason}</p>
                        </div>

                        <div className="mt-3">
                          <div className="flex flex-row">
                            {data?.status == "cancelled" ? (
                              <div className="flex-1">
                                <p className="font-semibold text-red-600">
                                  Rejected By:
                                </p>
                                <p className="font-normal">
                                  {data?.doc_owner_full_name}
                                </p>
                                <p className="text-[11px] font-normal">
                                  {data?.doc_owner_email}
                                </p>
                              </div>
                            ) : (
                              <div className="flex-1">
                                <p className="font-semibold text-red-600">
                                  Rejected By:
                                </p>
                                <p className="font-normal">
                                  {data?.rejected_by?.first_name}{" "}
                                  {data?.rejected_by?.last_name}
                                </p>
                                <p className="text-[11px] font-normal">
                                  {data?.rejected_by?.email}
                                </p>
                              </div>
                            )}

                            <div className="flex-1">
                              <p className="font-semibold text-red-600">
                                Rejection Date
                              </p>
                              <p className="font-normal">
                                {moment(data?.updated_at).format("Do MMMM, YYYY")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="-mt-2">
                  <div className="">
                    <div className="space-y-2">
                      {checkListSections &&
                      checkListSections.length > 0 ? (
                        checkListSections.map((section) => (
                          <div
                            key={section.id}
                            className="pb-4 border p-3 rounded-md"
                          >
                            {/* Section Header */}
                            <div className="mb-4">
                              <h2 className="text-base text-bChkRed">{section.name}</h2>
                              <p className="font-light text-gray-700 text-xs">{section?.description}</p>
                            </div>

                            {/* Render Items */}
                            <div className="space-y-4">
                            {section.items.map((item) => {
                              const possibleReasons = getPossibleReasons(item.question_text);

                              return (
                                <div key={item.id} className="space-y-1">
                                  <p className="text-sm font-normal">{item.question_text}</p>

                                  {/* Yes/No Options */}
                                  <div className="flex space-x-4 text-base text-gray-600">
                                    {/* Yes Option */}
                                    <div
                                      className={`flex items-center justify-center space-x-2 cursor-pointer border pr-2 font-normal rounded-[4px] py-1 text-[13px] ${
                                        answers[item.id]?.is_correct === 1 ? "text-green-600 border-green-600" : "text-gray-500"
                                      }`}
                                      onClick={() => handleChange(item.id, 1, "")}
                                    >
                                      <input
                                        type="radio"
                                        name={item.id}
                                        value="yes"
                                        checked={answers[item.id]?.is_correct === 1}
                                        onChange={() => handleChange(item.id, 1, "")}
                                        className="hidden"
                                      />
                                      <FaRegCircleCheck size={18} />
                                      <span>Yes</span>
                                    </div>

                                    {/* No Option */}
                                    <div
                                      className={`flex items-center justify-center space-x-2 cursor-pointer border font-normal rounded-[4px] pr-2 py-1 text-[13px] ${
                                        answers[item.id]?.is_correct === 0 ? "text-red-600 border-red-600" : "text-gray-500"
                                      }`}
                                      onClick={() => handleChange(item.id, 0, answers[item.id]?.comment || "")}
                                    >
                                      <input
                                        type="radio"
                                        name={item.id}
                                        value="no"
                                        checked={answers[item.id]?.is_correct === 0}
                                        onChange={() => handleChange(item.id, 0, answers[item.id]?.comment || "")}
                                        className="hidden"
                                      />
                                      <GiCancel size={18} />
                                      <span>No</span>
                                    </div>
                                  </div>

                                  {/* Show dropdown and textarea when "No" is selected */}
                                  {answers[item.id]?.is_correct === 0 && (
                                    <>
                                      <select
                                        className="w-full border rounded p-2 text-gray-700 focus:outline-none font-normal"
                                        value={answers[item.id]?.comment || ""}
                                        onChange={(e) => handleReasonChange(item.id, e.target.value)}
                                      >
                                        <option value="" disabled>Select a reason...</option>
                                        {possibleReasons.map((reason, index) => (
                                          <option key={index} value={reason}>
                                            {reason}
                                          </option>
                                        ))}
                                      </select>

                                      {/* Show textarea if "Other" is selected */}
                                      {showCustomReason[item.id] && (
                                        <textarea
                                          className="w-full border rounded p-2 text-gray-700 focus:outline-none font-normal mt-2"
                                          rows="3"
                                          placeholder="Enter your custom reason..."
                                          value={answers[item.id]?.comment || ""}
                                          onChange={(e) => handleChange(item.id, 0, e.target.value)}
                                        ></textarea>
                                      )}

                                      <p className="text-right text-[10px] font-medium text-bChkRed">
                                        Note: <span className="text-black">It is required to provide a reason</span>
                                      </p>
                                    </>
                                  )}
                                </div>
                              );
                            })}

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

                {data?.status == "processing" && (
                  <PermissionWrapper
                    permission={["e-check.cancel"]}
                  >
                    <Button
                      radius="none"
                      size="md"
                      className="w-1/2 bg-gray-300 text-gray-800 font-medium !rounded-md"
                      onClick={() => declineDisclosure.onOpen()}
                    >
                      Decline Request
                    </Button>
                  </PermissionWrapper>
                )}

                {data?.status !== "created" &&
                  data?.status !== "completed" &&
                  data?.status !== "rejected" &&
                  data?.status !== "processing" && (
                  <PermissionWrapper
                    permission={["e-check.process"]}
                  >
                    <Button
                      radius="none"
                      className="bg-bChkRed text-white font-medium w-1/2 !rounded-md"
                      size="md"
                      onClick={() => changeStatusDisclosure.onOpen()}
                    >
                      {data?.status === "submitted"
                        ? "Acknowledge Request"
                        : data?.status === "received"
                        ? "Verify Document"
                        : "Acknowledge Request"}
                    </Button>
                  </PermissionWrapper>
                    
                  )}
                {data?.status === "processing" && (
                  <PermissionWrapper
                    permission={["e-check.process"]}
                  >
                    <Button
                      isLoading={isSaving}
                      radius="none"
                      className="bg-bChkRed text-white font-medium w-1/2 !rounded-md"
                      size="md"
                      onClick={handleSubmitVerification}
                      disabled={Object.keys(answers).length === 0}
                    >
                      Submit Verifications
                    </Button>
                  </PermissionWrapper>
                )}
              </div>
            </div>
          </div>
          
        </Drawer>

        <ConfirmModal
          processing={processing}
          disclosure={changeStatusDisclosure}
          title="Change Request Status"
          size="xl"
          onButtonClick={async () => {
            if (data?.status === "received" && !isChecked) {
              return toast.error("Please confirm that you have reviewed the documents.");
            }

            setProcessing(true);
            await axios
              .post(
                `/institution/requests/verification-requests/${data?.id}/status`,
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
                      : data?.status == "rejected" || data?.status == "cancelled"
                      ? "received"
                      : "completed",
                }
              )
              .then(async (res) => {
                if (res?.data?.status === "processing") {
                  await fetchVerificationChecklist(data?.id);
                }

                setData(res?.data);
                setProcessing(false);
                toast.success("Request status updated successfully");
                institutionVerificationRequests();
                changeStatusDisclosure.onClose();
              })
              .catch((err) => {
                console.log(err);
                toast.error(err.response?.data?.message || "An error occurred");
                setProcessing(false);
                changeStatusDisclosure.onClose();
              });
          }}
        >
          <p className="font-quicksand">
            Are you sure to change status to{" "}
            <span className="font-semibold">
              {data?.status == "submitted"
                ? "Received"
                : data?.status == "received"
                ? "Process Request"
                : data?.status == "rejected" || data?.status == "cancelled"
                ? "Received"
                : "Complete Request"}
            </span>
          </p>

          {data?.status == "received" && (
            <div className="border-l-2 border-bChkRed bg-red-50 shadow-md p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2 font-semibold text-black">
                  <BsFillInfoCircleFill size={20} />
                  <p>Notice</p>
                </div>
                <p>
                  Please review all attached documents before processing this request, ensuring all necessary consent and compliance documents are in order.
                </p>

                {/* ✅ Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="reviewCheckbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="w-4 h-5 cursor-pointer accent-bChkRed"
                  />
                  <label htmlFor="reviewCheckbox" className="text-sm font-semibold">
                    I have reviewed the documents
                  </label>
                </div>
              </div>
            </div>
          )}
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
            radius="none"
            onChange={(e) =>
              setData((prev) => ({ ...prev, rejection_reason: e.target.value }))
            }
          />
        </DeleteModal>
      </div>
    </>
  );
}
