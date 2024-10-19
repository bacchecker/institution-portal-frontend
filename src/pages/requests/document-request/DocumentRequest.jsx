import React, { useCallback, useState } from "react";
import AuthLayout from "@components/AuthLayout";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  TableCell,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import CustomTable from "@components/CustomTable";
import useSWR, { useSWRConfig } from "swr";
import moment from "moment";
import axios from "@utils/axiosConfig";
import StatusChip from "@components/status-chip";
import Drawer from "@components/Drawer";
import CustomUser from "@components/custom-user";
import { useNavigate } from "react-router-dom";
import ClipIcon from "@assets/icons/clip";
import DownloadIcon from "@assets/icons/download";
import PdfIcon from "../../../assets/icons/pdf";
import WordIcon from "../../../assets/icons/word";
import { filesize } from "filesize";
import { PlusIcon } from "../../../assets/icons/plus";
import ExcelIcon from "../../../assets/icons/excel";
import Elipsis from "../../../assets/icons/elipsis";
import ConfirmModal from "../../../components/confirm-modal";
import toast from "react-hot-toast";

const ItemCard = ({ title, value }) => (
  <div className="flex gap-4 items-center">
    <p className="dark:text-white/80 text-black/55">{title}</p>
    <div className="">{value}</div>
  </div>
);

export default function DocumentRequest() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const fileUploadDisclosure = useDisclosure();
  const changeStatusDisclosure = useDisclosure();
  const [dateRange, setDateRange] = useState({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const [bulkDownloadLoading, setBulkDownloadLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [filters, setFilters] = useState({
    search_query: "",
    status: "",
    payment_status: "",
  });
  const { mutate } = useSWRConfig();

  const { data: resData, error } = useSWR(
    "/institution/requests/document-requests",
    (url) => axios.get(url).then((res) => res.data)
  );

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
      a.download = "bulk_download.zip"; // You can set a dynamic name if needed
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setBulkDownloadLoading(false);
    } catch (error) {
      console.error("Error downloading files:", error);
    }
  };

  const [dragActive, setDragActive] = useState(false);

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
        return <WordIcon className="size-6 text-blue-600 dark:text-blue-400" />;
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/vnd.ms-excel":
        return (
          <ExcelIcon className="size-6 text-green-500 dark:text-green-400" />
        );
      default:
        return <Elipsis />;
    }
  };

  return (
    <AuthLayout title="Document Request">
      <section className="md:px-3">
        <Card className="my-3 md:w-full w-[98vw] mx-auto dark:bg-slate-900">
          <CardBody className="w-full">
            <form method="get" className="flex flex-row gap-3 items-center">
              <input type="hidden" name="start_date" value={dateRange.start} />
              <input type="hidden" name="end_date" value={dateRange.end} />

              <Input
                name="search_query"
                placeholder="Search unique code, user name, user phone number"
                defaultValue={filters.search_query}
                // startContent={<SearchIconDuotone />}
                size="sm"
                className="max-w-xs min-w-[200px]"
              />
              {/* 
              <Select
                size="sm"
                placeholder="Document Type"
                className="max-w-xs"
                name="document_type"
                defaultSelectedKeys={[filters?.document_type]}
              >
                {documentTypes.map((item) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select> */}

              <Select
                size="sm"
                placeholder="Status"
                className="max-w-[130px] min-w-[130px]"
                name="status"
                defaultSelectedKeys={[filters?.status]}
              >
                {[
                  {
                    key: "active",
                    label: "Active",
                  },
                  {
                    key: "inactive",
                    label: "Inactive",
                  },
                ].map((item) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select>

              <Select
                size="sm"
                placeholder="Payment Status"
                className="max-w-[130px] min-w-[130px]"
                name="payment_status"
                defaultSelectedKeys={[filters?.payment_status]}
              >
                {[
                  {
                    key: "pending",
                    label: "Pending",
                  },
                  {
                    key: "failed",
                    label: "Failed",
                  },
                  {
                    key: "paid",
                    label: "Paid",
                  },
                ].map((item) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select>

              <DateRangePicker
                visibleMonths={2}
                className="w-[30%]"
                onChange={(date) => {
                  let newStartDate;
                  if (date) {
                    newStartDate = new Date(
                      date.start.year,
                      date.start.month - 1, // month is 0-based
                      date.start.day
                    ).toDateString();
                  }

                  let newEndDate;
                  if (date) {
                    newEndDate = new Date(
                      date.end.year,
                      date.end.month - 1, // month is 0-based
                      date.end.day
                    ).toDateString();
                  }

                  setDateRange({
                    start: moment(newStartDate, "ddd MMM DD YYYY")
                      .format("YYYY-MM-DD")
                      .toString(),
                    end: moment(newEndDate, "ddd MMM DD YYYY")
                      .format("YYYY-MM-DD")
                      .toString(),
                  });
                }}
              />

              <Button size="sm" type="submit" color="danger">
                Filter
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>

      <section className="md:px-3 md:w-full w-[98vw] mx-auto">
        <CustomTable
          columns={[
            "ID",
            "Requested By",
            "Delivery Address",
            "Date",
            "Documents",
            "Status",
            "Total Amount",
            "Payment Status",
            "",
          ]}
          loadingState={resData ? false : true}
          page={resData?.current_page}
          setPage={(page) =>
            navigate(
              `?region=${filters.region || ""}&search_query=${
                filters.search_query || ""
              }&status=${filters.status || ""}&page=${page}`
            )
          }
          totalPages={Math.ceil(resData?.total / resData?.per_page)}
        >
          {resData?.data?.map((item) => (
            <TableRow key={item?.id}>
              <TableCell className="font-semibold">
                {item?.unique_code}
              </TableCell>
              <TableCell className="font-semibold">
                <CustomUser
                  avatarSrc={`${
                    import.meta.env.VITE_BASE_URL
                  }/storage/app/public/${item?.user?.photo}`}
                  name={`${item?.user?.first_name} ${item?.user?.last_name}`}
                  email={`${item?.user?.email}`}
                />
              </TableCell>
              <TableCell>{item?.delivery_address}</TableCell>
              <TableCell>
                {moment(item?.created_at).format("Do MMMM, YYYY")}
              </TableCell>
              <TableCell>
                {item?.records?.length > 1 ? (
                  <Popover placement="right">
                    <PopoverTrigger>
                      <Button size="sm" color="danger">
                        {item?.records?.length} Docs
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="px-1 py-2 flex flex-col gap-1">
                        {item?.records?.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-2 justify-between bg-slate-100 dark:text-white dark:bg-gray-800 p-2 rounded-lg"
                          >
                            <div className="text-tiny">
                              {doc.document_type?.name}
                            </div>
                            <div className="text-tiny ml-5">
                              GH¢{" "}
                              {Math.floor(
                                doc?.document_type?.base_fee +
                                  doc?.number_of_copies *
                                    doc?.document_type?.printing_fee
                              ).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  item?.records[0]?.document_type?.name
                )}
              </TableCell>
              <TableCell>
                <StatusChip status={item?.status} />
              </TableCell>
              <TableCell> GH¢ {item?.total_amount}</TableCell>
              <TableCell>
                <StatusChip status={item?.payment_status} />
              </TableCell>
              <TableCell className="flex items-center h-16 gap-3">
                <Button
                  size="sm"
                  color="success"
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
      </section>

      <Drawer
        title="Request Details"
        isOpen={openDrawer}
        setIsOpen={setOpenDrawer}
        classNames="w-[100vw] md:w-[40vw]"
      >
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex flex-col gap-1">
              {/* <div className="flex space-x-2 items-center">
                <p className="font-semibold">
                  Unique Code:{" "}
                  <span className="uppercase">{data?.unique_code}</span>
                </p>
                <div
                  className={`flex items-center border px-4 py-1 rounded-full text-xs uppercase ${
                    data?.payment_status == "paid"
                      ? "bg-green-200 border-green-600 text-green-600"
                      : "bg-gray-200 border-gray-600 text-gray-600"
                  }`}
                >
                  {data?.payment_status}
                  </div>
                  </div> */}
              <ItemCard title="Request ID" value={data?.unique_code} />
              <ItemCard
                title="Requested On"
                value={moment(data?.created_at).format("Do MMMM, YYYY")}
              />

              <ItemCard
                title="Delivery Address"
                value={data?.delivery_address}
              />
              <ItemCard title="Total Cost (GH¢)" value={data?.total_amount} />
              <ItemCard
                title="Payment Status"
                value={<StatusChip status={data?.payment_status} />}
              />
            </div>

            <Card className="dark:bg-slate-950">
              <CardHeader>
                <p className="font-bold">Applicant Info</p>
              </CardHeader>
              <CardBody>
                <div className="flex gap-3">
                  <CustomUser
                    avatarSrc={data?.user?.profile_photo_url}
                    name={`${data?.user?.first_name} ${data?.user?.last_name}`}
                    email={`${data?.user?.email}`}
                  />

                  <div className="grid grid-cols-5 gap-1">
                    <p className="font-semibold">Phone:</p>
                    <p className="col-span-4">{data?.user?.phone}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="dark:bg-slate-950">
              <CardHeader className="flex justify-between">
                <p className="font-bold">Document Request Summary</p>

                <ItemCard
                  title="Status"
                  value={<StatusChip status={data?.status} />}
                />
              </CardHeader>

              <CardBody className="flex flex-col gap-3 px-2">
                {data?.records?.map((item, index) => (
                  <div
                    key={index}
                    className="w-full grid grid-cols-2 xl:grid-cols-3 gap-2"
                  >
                    {/* Document type and description */}
                    <div className="col-span-2 flex items-center space-x-4 w-full">
                      <div>
                        <p className="font-medium text-gray-700">
                          {item?.document_type.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item?.document_type?.description}
                        </p>
                      </div>
                    </div>

                    {/* Copies, Format, and Total Amount */}
                    <div className="text-sm font-semibold text-gray-700">
                      <div className="grid grid-cols-2 gap-2">
                        <p className="">Copies:</p>
                        <p className="">{item?.number_of_copies}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="">Format:</p>
                        <p className="">
                          {item?.document_type.document_format === "soft_copy"
                            ? "Soft Copy"
                            : "Hard Copy"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="">Total Amt:</p>
                        <p>
                          GH¢{" "}
                          {Math.floor(
                            item?.document_type?.base_fee +
                              item?.number_of_copies *
                                item?.document_type?.printing_fee
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            <div className="mt-11">
              <section className="mb-3 flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <ClipIcon />
                  <p className="font-semibold ">Attachmets</p>
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

              <section className="grid grid-cols-2 gap-3">
                {data?.files.length >= 1 ? (
                  data?.files?.map((item) => (
                    <div
                      key={item?.id}
                      className="flex items-center gap-3 p-2 rounded-lg border dark:border-white/10"
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
                            className="cursor-pointer p-1 rounded-lg bg-primary text-white text-xs"
                            onClick={() => {
                              window.location.href =
                                "https://backend.baccheck.online/api/document/download" +
                                "?path=" +
                                encodeURIComponent(item.path);
                            }}
                          >
                            Download
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Nothing here</p>
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
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Button
              size="sm"
              color="default"
              onClick={() => {
                setOpenDrawer(false);
                setData(null);
              }}
            >
              Close
            </Button>

            {data?.status !== "created" && data?.status !== "completed" && (
              <Button
                color="secondary"
                className="font-montserrat font-semibold w-1/2"
                size="sm"
                onClick={() => changeStatusDisclosure.onOpen()}
              >
                {data?.status === "submitted"
                  ? "Acknowledge Request"
                  : data?.status === "received"
                  ? "Process Request"
                  : data?.status == "processing"
                  ? "Complete Request"
                  : "Acknowledge Request"}
              </Button>
            )}
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
                  <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 pb-5">
                    <div className="border-2 border-primary shadow-sm rounded-xl p-4 bg-gray-50 dark:bg-slate-900">
                      <div
                        className={`p-3 border-2 border-dashed rounded-lg ${
                          dragActive
                            ? "border-blue-400 bg-blue-50"
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
                                <p className="flex items-center text-base font-semibold text-slate-600 dark:text-slate-200">
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
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                Click to select or attach documents
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-300">
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
                  isDisabled={data.documents?.length < 1 || processing}
                  color="danger"
                  onClick={async () => {
                    setProcessing(true);

                    const resss = await axios.post(
                      `/institution/upload-document`,
                      {
                        documents: data.documents,
                        unique_code: data.unique_code,
                        institution_id: data.institution_id,
                      }
                    );

                    if (resss.status !== 200) {
                      toast.error("Failed to upload file(s)");
                      return;
                    }

                    console.log(resss?.data);
                    setData(resss?.data[0]);
                    setProcessing(false);
                    toast.success("Documents uploaded successfully");
                    mutate("/institution/requests/document-requests");
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
            `/institution/document-requests/${data?.unique_code}/status`,
            {
              status:
                data?.status == "submitted"
                  ? "received"
                  : data?.status == "received"
                  ? "processing"
                  : "completed",
            }
          );

          if (resss.status !== 200) {
            toast.error("Failed to update request status");
            return;
          }
          console.log(resss?.data);
          setData(resss?.data[0]);
          setProcessing(false);
          toast.success("Request status updated successfully");
          mutate("/institution/requests/document-requests");
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
              : "Complete Request"}
          </span>
        </p>
      </ConfirmModal>
    </AuthLayout>
  );
}
