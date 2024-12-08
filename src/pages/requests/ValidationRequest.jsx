import React, { useState, useEffect } from "react";
import AuthLayout from "@components/AuthLayout";
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
import CustomTable from "@components/CustomTable";
import useSWR, { useSWRConfig } from "swr";
import moment from "moment";
import axios from "@utils/axiosConfig";
import StatusChip from "@components/status-chip";
import Drawer from "@components/Drawer";
import CustomUser from "@components/custom-user";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { filesize } from "filesize";
import ClipIcon from "@assets/icons/clip";
import DownloadIcon from "@assets/icons/download";
import ConfirmModal from "../../components/confirm-modal";
import DeleteModal from "../../components/DeleteModal";
import toast from "react-hot-toast";
import { parseDate } from "@internationalized/date";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { PiQueueFill } from "react-icons/pi";
import { FcCancel } from "react-icons/fc";

const ItemCard = ({ title, value }) => (
  <div className="flex gap-4 items-center">
    <p className="dark:text-white/80 text-black/55">{title}</p>
    <div className="">{value}</div>
  </div>
);

export default function ValidationRequest() {
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();

  const changeStatusDisclosure = useDisclosure();
  const declineDisclosure = useDisclosure();

  const [bulkDownloadLoading, setBulkDownloadLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dateRange, setDateRange] = useState({});
  const [validationRequests, setValidationRequests] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    search_query: searchParams.get("search_query") || "",
    status: searchParams.get("status") || "",
    start_date: searchParams.get("start_date") || "",
    end_date: searchParams.get("end_date") || "",
  });

  const [pending, setPending] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [approved, setApproved] = useState(0);
  const { data: resData, error } = useSWR(
    `/institution/requests/validation-requests?${createSearchParams(filters)}`,
    (url) => axios.get(url).then((res) => res.data)
  );

  const institutionValidationRequests = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("/institution/requests/validation-requests", {
        params: {
          search,
          page: currentPage,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });

      const valRequest = response.data.paginatedRequests;

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
    institutionValidationRequests();
  }, [search, currentPage, sortBy, sortOrder]);

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

  console.log(data);

  return (
    <div title="Validation Request">
      <section className="px-2">
        <Card className="md:w-full w-[98vw] mx-auto rounded-none dark:bg-slate-900">
          <CardBody className="w-full">
            <form
              method="get"
              className="flex flex-row gap-3 items-center"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({
                  // pathname: "listing",
                  search: createSearchParams(filters).toString(),
                });
              }}
            >
              <Input
                name="search_query"
                placeholder="Search unique code, user name, user phone number"
                defaultValue={filters.search_query}
                // startContent={<SearchIconDuotone />}
                size="sm"
                className="max-w-xs min-w-[200px]"
                onChange={(e) =>
                  setFilters({ ...filters, search_query: e.target.value })
                }
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
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                {[
                  {
                    key: "submitted",
                    label: "submitted",
                  },
                  {
                    key: "received",
                    label: "received",
                  },
                  {
                    key: "processing",
                    label: "processing",
                  },
                  {
                    key: "completed",
                    label: "completed",
                  },
                  {
                    key: "cancelled",
                    label: "cancelled",
                  },
                ].map((item) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select>

              <DateRangePicker
                visibleMonths={2}
                className="w-[30%]"
                value={{
                  start: filters.start_date
                    ? parseDate(filters.start_date)
                    : null,
                  end: filters.end_date ? parseDate(filters.end_date) : null,
                }}
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

                  setFilters({
                    ...filters,
                    start_date: moment(newStartDate, "ddd MMM DD YYYY")
                      .format("YYYY-MM-DD")
                      .toString(),
                    end_date: moment(newEndDate, "ddd MMM DD YYYY")
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
        
        <Card className="my-3 md:w-full w-[98vw] mx-auto border-none shadow-none rounded-lg dark:bg-slate-900">
          <CardBody className="grid w-full grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-md bg-gray-100 p-4 flex space-x-4">
                <div className="flex items-center justify-center bg-purple-200 text-purple-800 rounded-full w-10 h-10">
                  <IoDocuments size={18}/>
                </div>
                <div className="">
                  <p className="font-medium">Total Documents</p>
                  <p className="text-gray-500">{total}</p>
                </div>
            </div>
            <div className="rounded-md bg-gray-100 p-4 flex space-x-4">
                <div className="flex items-center justify-center bg-yellow-200 text-yellow-500 rounded-full w-10 h-10">
                  <PiQueueFill size={18}/>
                </div>
                <div className="">
                  <p className="font-medium">Pending</p>
                  <p className="text-gray-500">{pending}</p>
                </div>
            </div>
            <div className="rounded-md bg-gray-100 p-4 flex space-x-4">
                <div className="flex items-center justify-center bg-green-200 text-green-600 rounded-full w-10 h-10">
                  <FaHeart size={18}/>
                </div>
                <div className="">
                  <p className="font-medium">Approved</p>
                  <p className="text-gray-500">{approved}</p>
                </div>
            </div>
            <div className="rounded-md bg-gray-100 p-4 flex space-x-4">
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
                  onClick={() => {
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
        title="Request Details"
        isOpen={openDrawer}
        setIsOpen={setOpenDrawer}
        classNames="w-[100vw] md:w-[45vw]"
      >
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex flex-col gap-1">
              <ItemCard title="Request ID" value={data?.unique_code} />
              <ItemCard
                title="Requested On"
                value={moment(data?.created_at).format("Do MMMM, YYYY")}
              />
              <ItemCard title="Total Cost (GH¢)" value={data?.total_amount} />
              {/* <ItemCard
                title="Payment Status"
                value={<StatusChip status={data?.payment_status} />}
              /> */}
              <ItemCard
                title="Request Status"
                value={<StatusChip status={data?.status} />}
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

                  <div className="grid grid-cols-5 gap-1">
                    <p className="font-semibold">Index Number:</p>
                    <p className="col-span-4">{data?.index_number}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="mt-11">
              <section className="mb-3 flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <ClipIcon />
                  <p className="font-semibold ">Attachmets</p>
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
                  startContent={<DownloadIcon />}
                >
                  Download all
                </Button>
              </section>

              <section className="grid grid-cols-2 gap-3">
                <div className="gap-3 p-2 rounded-lg border dark:border-white/10">
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-semibold">{data?.document_type?.name}</p>
                    <p>GH¢ {data?.total_amount}</p>

                    <div className="flex justify-between">
                      <div className="flex gap-2 items-center">
                        <Chip size="sm">{data?.file?.extension}</Chip>
                        <p>{filesize(data?.file?.size ?? 1000)}</p>
                      </div>
                      <p
                        className="cursor-pointer p-1 rounded-lg bg-primary text-white text-xs"
                        onClick={() => {
                          window.location.href =
                            "https://backend.baccheck.online/api/document/download" +
                            "?path=" +
                            encodeURIComponent(data?.file?.path);
                        }}
                      >
                        Download
                      </p>
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

            {(data?.status == "received" || data?.status == "submitted") && (
              <Button
                color="danger"
                className="font-montserrat font-semibold w-1/2"
                size="sm"
                onClick={() => declineDisclosure.onOpen()}
              >
                Decline Request
              </Button>
            )}

            {data?.status !== "created" &&
              data?.status !== "completed" &&
              data?.status !== "rejected" && (
                <Button
                  color="danger"
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
                    : "completed",
              }
            )
            .then((res) => {
              console.log(res);

              setData(res?.data);
              setProcessing(false);
              toast.success("Request status updated successfully");
              mutate("/institution/requests/validation-requests");
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
              mutate("/institution/requests/validation-requests");
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
