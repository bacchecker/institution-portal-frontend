import React, { useState } from "react";
import AuthLayout from "@components/AuthLayout";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  DateRangePicker,
  Input,
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
import { filesize } from "filesize";
import ClipIcon from "@assets/icons/clip";
import DownloadIcon from "@assets/icons/download";
import ConfirmModal from "../../components/confirm-modal";
import toast from "react-hot-toast";

const ItemCard = ({ title, value }) => (
  <div className="flex gap-4 items-center">
    <p className="dark:text-white/80 text-black/55">{title}</p>
    <div className="">{value}</div>
  </div>
);

export default function ValidationRequest() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const { mutate } = useSWRConfig();
  const [dateRange, setDateRange] = useState({});
  const [bulkDownloadLoading, setBulkDownloadLoading] = useState(false);
  const [filters, setFilters] = useState({
    search_query: "",
    status: "",
    payment_status: "",
  });

  const { data: resData, error } = useSWR(
    "/institution/requests/validation-requests",
    (url) => axios.get(url).then((res) => res.data)
  );

  console.log(resData);

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

  const changeStatusDisclosure = useDisclosure();

  return (
    <AuthLayout title="Validation Request">
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
                // value={{
                //     start: dateRange.start
                //         ? parseDate(dateRange.start)
                //         : null,
                //     end: dateRange.end
                //         ? parseDate(dateRange.end)
                //         : null,
                // }}
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
                  avatarSrc={item?.user?.photo}
                  name={`${item?.user?.first_name} ${item?.user?.last_name}`}
                  email={`${item?.user?.email}`}
                />
              </TableCell>
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
        title="Request Details"
        isOpen={openDrawer}
        setIsOpen={setOpenDrawer}
        classNames="w-[100vw] md:w-[40vw]"
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
              <ItemCard
                title="Payment Status"
                value={<StatusChip status={data?.payment_status} />}
              />
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
                {data?.records?.map((item) => (
                  <div
                    key={item?.id}
                    className="gap-3 p-2 rounded-lg border dark:border-white/10"
                  >
                    <div className="w-full flex flex-col gap-1">
                      <p className="font-semibold">
                        {item?.document_type?.name}
                      </p>
                      <p>
                        GH¢{" "}
                        {Math.floor(
                          item?.document_type?.base_fee +
                            item?.number_of_copies *
                              item?.document_type?.printing_fee
                        ).toFixed(2)}
                      </p>

                      <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                          <Chip size="sm">{item?.file?.extension}</Chip>
                          <p>{filesize(item?.file?.size ?? 1000)}</p>
                        </div>
                        <p
                          className="cursor-pointer p-1 rounded-lg bg-primary text-white text-xs"
                          onClick={() => {
                            window.location.href =
                              "https://backend.baccheck.online/api/document/download" +
                              "?path=" +
                              encodeURIComponent(item?.file?.path);
                          }}
                        >
                          Download
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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

      <ConfirmModal
        processing={processing}
        disclosure={changeStatusDisclosure}
        title="Change Request Status"
        onButtonClick={async () => {
          setProcessing(true);
          const resss = await axios.post(
            `/institution/requests/validation-requests/${data?.unique_code}/status`,
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
          mutate("/institution/requests/validation-requests");
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
