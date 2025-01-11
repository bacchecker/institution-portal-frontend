import React, { useCallback, useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DateRangePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
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
import DownloadIcon from "../../assets/icons/download";
import PdfIcon from "../../assets/icons/pdf";
import WordIcon from "../../assets/icons/word";
import { filesize } from "filesize";
import { PlusIcon } from "../../assets/icons/plus";
import ExcelIcon from "../../assets/icons/excel";
import Elipsis from "../../assets/icons/elipsis";
import ConfirmModal from "@/components/confirm-modal";
import { toast } from "sonner";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { PiQueueFill } from "react-icons/pi";
import { FcCancel } from "react-icons/fc";
import { MdOutlineFileDownload, MdOutlineFilterAlt } from "react-icons/md";
import { MdOutlineFilterAltOff } from "react-icons/md";
import DeleteModal from "@/components/DeleteModal";
import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function DocumentRequest() {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const fileUploadDisclosure = useDisclosure();
  const changeStatusDisclosure = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [bulkDownloadLoading, setBulkDownloadLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [documentRequests, setDocumentRequests] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [status, setStatus] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const declineDisclosure = useDisclosure();
  const [allRequests, setAllRequests] = useState(0);
  const [pending, setPending] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [approved, setApproved] = useState(0);
  const [filters, setFilters] = useState({
    search_query: "",
    document_type: null,
    start_date: null,
    end_date: null,
  });

  const [submittedFilters, setSubmittedFilters] = useState({});

  const institutionDocumentRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "/institution/requests/document-requests",
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

      const docRequest = response.data.paginatedRequests;

      setAllRequests(response.data.allRequests);
      setPending(response.data.pending);
      setApproved(response.data.approved);
      setRejected(response.data.rejected);
      setDocumentRequests(docRequest.data);
      setCurrentPage(docRequest.current_page);
      setLastPage(docRequest.last_page);
      setTotal(docRequest.total);
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
    institutionDocumentRequests();
  }, [submittedFilters, currentPage, sortBy, sortOrder, status]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedFilters({ ...filters });
    setCurrentPage(1); // Reset to first page on filter submit
  };

  const handleBulkDownload = async (filePaths) => {
    try {
      const csrfTokenMeta = document?.querySelector('meta[name="csrf-token"]');
      const csrfToken = csrfTokenMeta?.getAttribute("content");

      const headers = {
        "Content-Type": "application/json",
      };

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

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    const fileInput = e.target;
    if (fileInput.files.length > 0) {
      handleFiles(fileInput.files);
    }
  };

  const handleFiles = (files) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    const validFiles = Array.from(files).filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (validFiles.length > 0) {
      setData((prev) => ({
        ...prev,
        documents: validFiles,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        documents: [],
      }));
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "application/pdf":
        return <PdfIcon className="size-6 text-danger" />;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <WordIcon className="size-6 text-blue-600" />;
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/vnd.ms-excel":
        return <ExcelIcon className="size-6 text-green-500" />;
      default:
        return <Elipsis />;
    }
  };

  const handleDocumentTypeChange = (event) => {
    setFilters({ ...filters, document_type: event.target.value });
  };

  return (
    <div title="Document Request">
      <section className="px-0 lg:px-3">
        <Card className="md:w-full w-full mx-auto rounded-none shadow-none border-none">
          <CardBody className="w-full bg-gray-100 p-3 lg:p-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-row gap-3 items-center"
            >
              <input
                type="text"
                className={`bg-white text-gray-900 text-sm rounded-[4px] font-[400] focus:outline-none block w-[260px] p-[9.5px] placeholder:text-gray-500`}
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
                visibleMonths={2}
                variant="underlined"
                classNames={{
                  base: "bg-white border border-white", // This sets the input background to white
                }}
                className="w-[280px] rounded-[4px] date-range-picker-input border border-white bg-white"
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
                <p className="font-medium">All Documents</p>
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
            /* "Delivery Address", */
            "Date",
            "Document",
            "Format",
            "Status",
            "Amount",
            "Actions",
          ]}
          loadingState={isLoading}
          columnSortKeys={{
            ID: "unique_code",
            "Requested By": "user_full_name",
            "Delivery Address": "delivery_address",
            Date: "created_at",
            Document: "document_type_name",
            Format: "document_format",
            Status: "status",
            Amount: "total_amount",
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
        >
          {documentRequests?.map((item) => (
            <TableRow
              key={item?.id}
              className="odd:bg-gray-100 even:bg-gray-50 border-b"
            >
              <TableCell className="font-semibold">
                {item?.unique_code}
              </TableCell>
              <TableCell className="font-semibold">
                <CustomUser
                  avatarSrc={`https://admin-dev.baccheck.online/storage/${item?.user?.photo}`}
                  name={`${item?.user?.first_name} ${item?.user?.last_name}`}
                  email={`${item?.user?.email}`}
                />
              </TableCell>
              {/* <TableCell>{item?.delivery_address ?? "N/A"}</TableCell> */}
              <TableCell>
                {moment(item?.created_at).format("MMM D, YYYY")}
              </TableCell>
              <TableCell>{item?.document_type?.name}</TableCell>
              <TableCell>
                {item?.document_format == "hard_copy"
                  ? "Hard Copy"
                  : "Soft Copy"}
              </TableCell>
              <TableCell>
                <StatusChip status={item?.status} />
              </TableCell>
              <TableCell>GH¢ {item?.total_amount}</TableCell>

              <TableCell className="flex items-center h-16 gap-3">
                <Button
                  radius="none"
                  size="sm"
                  color="success"
                  className="rounded-[4px] text-white"
                  onClick={() => {
                    setData(item);
                    setOpenDrawer(true);
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
        title="Request Details"
        isOpen={openDrawer}
        setIsOpen={setOpenDrawer}
        classNames="w-[100vw] md:w-[40vw] z-10"
      >
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col -mt-2 xl:pl-2 font-semibold">
            <div className="grid grid-cols-3 gap-y-4 gap-x-2 border-b pb-4">
              <div className="text-gray-500">Request ID</div>
              <div className="col-span-2">#{data?.unique_code}</div>
              <div className="text-gray-500">Requested Date</div>
              <div className="col-span-2">
                {moment(data?.created_at).format("Do MMMM, YYYY")}
              </div>
              <div className="text-gray-500">Delivery Address</div>
              <div className="col-span-2">
                {data?.delivery_address || "N/A"}
              </div>
              <div className="text-gray-500">Total Cash</div>
              <div className="col-span-2">GH¢ {data?.total_amount}</div>
            </div>
            <div className="py-4">
              <p className="font-semibold mb-4 text-base">Applicant Details</p>
              <div className="grid grid-cols-3 gap-y-4 border-b pb-4">
                <div className="text-gray-500">Applicant Name</div>
                <div className="col-span-2">
                  {data?.user?.first_name} {data?.user?.other_name}{" "}
                  {data?.user?.last_name}
                </div>
                <div className="text-gray-500">Applicant Email</div>
                <div className="col-span-2">{data?.user?.email}</div>
                <div className="text-gray-500">Phone Number</div>
                <div className="col-span-2">{data?.user?.phone}</div>
                <div className="text-gray-500 mt-2">Applicant Picture</div>
                <div className="col-span-2 w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  {data?.user?.photo && (
                    <img
                      src={`https://admin-dev.baccheck.online/storage/${data?.user?.photo}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="pb-2">
              <p className="font-semibold mb-4 text-base">
                Document Request Summary
              </p>
              <div className="grid grid-cols-3 gap-y-4 border-b pb-4">
                <div className="text-gray-500">{data?.document_type.name}</div>
                <div className="col-span-2">
                  {data?.document_type.description}
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

                <div className="text-gray-500">Format</div>
                <div className="col-span-2">
                  {data?.document_format === "soft_copy"
                    ? "Soft Copy"
                    : "Hard Copy"}
                </div>
                <div className="text-gray-500">Copies</div>
                <div className="col-span-2">
                  {data?.number_of_copies} Copies
                </div>
              </div>
            </div>

            {data?.document_format == "soft_copy" ? (
              <div className="mb-4">
                <section className="mb-3 flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <p className="font-semibold text-base">Attachments</p>
                  </div>

                  {data?.files.length >= 1 && (
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
                      startContent={<DownloadIcon />}
                    >
                      Download all
                    </Button>
                  )}
                </section>

                <section className="w-full grid grid-cols-2 gap-3">
                  {data?.files.length >= 1
                    ? data?.files?.map((item) => (
                        <div
                          key={item?.id}
                          className="flex items-center gap-3 p-2 rounded-lg border"
                        >
                          {item?.extension === "pdf" ? (
                            <PdfIcon className="size-11" color="red" />
                          ) : (
                            <WordIcon className="size-11" color="blue" />
                          )}
                          <div className="w-full flex flex-col h-full">
                            <p className="font-semibold line-clamp-2">
                              {item?.name}
                            </p>

                            <div className="flex justify-between items-center mt-auto">
                              <p>{filesize(item.size)}</p>
                              <p
                                className="cursor-pointer px-2 py-1 rounded-md bg-primary text-white text-xs"
                                onClick={() => {
                                  window.location.href =
                                    "https://backend.baccheck.online/api/document/download" +
                                    "?path=" +
                                    encodeURIComponent(item.path);
                                }}
                              >
                                <MdOutlineFileDownload size={20} />
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    : data?.status != "rejected" && (
                        <p className="border rounded-md py-1.5 pl-4">
                          No file attached
                        </p>
                      )}

                  {data?.status == "processing" && (
                    <div className="flex items-center">
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => {
                          fileUploadDisclosure.onOpen();
                        }}
                        startContent={<PlusIcon />}
                      >
                        Upload Document
                      </Button>
                    </div>
                  )}
                </section>
              </div>
            ) : null}
          </div>
          <div className="w-full mb-2 -mt-4">
            {data?.status == "rejected" && (
              <div className="w-full">
                <div className="border rounded-md bg-white p-2 shadow-md">
                  <div className="flex-row">
                    <div className="flex-1 mb-2">
                      <div>
                        <p className="font-semibold text-bChkRed">
                          Rejection Reason
                        </p>
                      </div>
                      <div>
                        <p>{data?.rejection_reason}</p>
                      </div>
                    </div>
                    <div className="flex-1 mb-2">
                      <p className="font-semibold text-bChkRed">Rejected By:</p>
                      <p className="col-span-4">
                        {data?.rejected_by
                          ? `${data.rejected_by.first_name} ${data.rejected_by.last_name}`
                          : "N/A"}
                      </p>
                    </div>

                    <div className="flex-1 mb-2">
                      <p className="font-semibold text-bChkRed">
                        Rejection Date
                      </p>
                      <p>{moment(data?.updated_at).format("Do MMMM, YYYY")}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full flex items-center space-x-2 justify-center border-t pt-2">
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
              <PermissionWrapper permission={['document-requests.cancel']}>
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
              </PermissionWrapper>
              <PermissionWrapper permission={['document-requests.process']}>
                {data?.status !== "created" && data?.status !== "completed" && (
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
                      : data?.status == "processing"
                      ? "Complete Request"
                      : data?.status == "rejected"
                      ? "Revert Rejection"
                      : "Acknowledge Request"}
                  </Button>
                )}
              </PermissionWrapper>
            
          </div>
        </div>
      </Drawer>

      <Modal
        isOpen={fileUploadDisclosure.isOpen}
        onOpenChange={fileUploadDisclosure.onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        className="z-[99]"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload Documents
              </ModalHeader>
              <ModalBody>
                <div>
                  <div className="sticky top-0 z-50 bg-white pb-5">
                    <div className="border-2 border-primary shadow-sm rounded-xl p-4 bg-gray-50">
                      <div
                        className={`p-3 border-2 border-dashed rounded-lg ${
                          dragActive
                            ? "border-blue-400 bg-red-50"
                            : "border-gray-300"
                        }`}
                      >
                        <input
                          type="file"
                          multiple
                          id="file-upload"
                          name="document"
                          className="hidden"
                          onChange={handleChange}
                          accept=".pdf,.docx,.doc,.txt,.xlsx,.xls"
                        />

                        {data.documents && data.documents.length > 0 ? (
                          <div className="flex flex-col">
                            {data.documents.map((file, index) => (
                              <label
                                key={index}
                                htmlFor="file-upload"
                                className="flex items-center cursor-pointer mb-2"
                              >
                                <p className="flex items-center text-base font-semibold text-slate-600">
                                  <span className="mr-2">
                                    {getFileIcon(file.type)}
                                  </span>
                                  {file.name}
                                </p>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center h-full py-0 text-center cursor-pointer gap-x-2"
                          >
                            <svg
                              className="w-8 h-8 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              ></path>
                            </svg>
                            <div className="text-left">
                              <p className="text-sm text-slate-600">
                                Click to select or attach documents
                              </p>
                              <p className="text-xs text-slate-600">
                                (PDF, DOCX, XLSX, or Text files only)
                              </p>
                            </div>
                          </label>
                        )}
                        {dragActive && (
                          <div
                            className="absolute inset-0 z-50"
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                          ></div>
                        )}
                      </div>
                      {/* {errors?.documents && (
                        <small className="mt-2 text-sm text-danger">
                          {errors.documents}
                        </small>
                      )} */}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isLoading={processing}
                  isDisabled={data?.documents?.length < 1 || processing}
                  color="danger"
                  onClick={async () => {
                    setProcessing(true);

                    const resss = await axios.post(
                      `/institution/upload-document`,
                      {
                        documents: data?.documents,
                        unique_code: data?.unique_code,
                        institution_id: data?.institution_id,
                        id: data?.id,
                      },
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );

                    if (resss.status !== 200) {
                      toast.error("Failed to upload file(s)");
                      setProcessing(false);
                      toast.error("Documents uploaded failed");
                      return;
                    }

                    setData(resss?.data);
                    setProcessing(false);
                    toast.success("Documents uploaded successfully");
                    institutionDocumentRequests();
                    //mutate("/institution/requests/document-requests");
                    fileUploadDisclosure.onClose();
                  }}
                >
                  Upload Documents
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ConfirmModal
        processing={processing}
        disclosure={changeStatusDisclosure}
        title="Change Request Status"
        onButtonClick={async () => {
          setProcessing(true);
          const resss = await axios.post(
            `/institution/requests/document-requests/${data?.id}/status`,
            {
              status:
                data?.status == "submitted"
                  ? "received"
                  : data?.status == "received"
                  ? "processing"
                  : data?.status == "rejected"
                  ? "received"
                  : "completed",
            }
          );

          if (resss.status !== 200) {
            toast.error("Failed to update request status");
            setProcessing(false);
            toast.error("Request status updated failed");
            return;
          }

          setData(resss?.data);
          setProcessing(false);
          toast.success("Request status updated successfully");
          institutionDocumentRequests();
          //mutate("/institution/requests/document-requests");
          changeStatusDisclosure.onClose();
        }}
      >
        <p className="font-quicksand">
          Are you sure to change status to{" "}
          <span className="font-semibold">
            {data?.status == "submitted"
              ? "Received"
              : data?.status == "received"
              ? "Processing"
              : data?.status == "rejected"
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
              `/institution/requests/document-requests/${data?.id}/status`,
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
              //mutate("/institution/requests/document-requests");
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
  );
}
