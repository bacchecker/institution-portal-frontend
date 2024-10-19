import React, { useState } from "react";
import AuthLayout from "@components/AuthLayout";
import {
  Button,
  Card,
  CardBody,
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
} from "@nextui-org/react";
import CustomTable from "@components/CustomTable";
import useSWR from "swr";
import moment from "moment";
import axios from "@utils/axiosConfig";
import StatusChip from "@components/status-chip";
import Drawer from "@components/Drawer";
import CustomUser from "@components/custom-user";
import { useNavigate, useSearchParams } from "react-router-dom";
import { filesize } from "filesize";

const ItemCard = ({ title, value }) => (
  <div className="grid grid-cols-5 w-full items-center">
    <p className="col-span-2 dark:text-white/80 text-black/55">{title}</p>
    <div className="col-span-3">{value}</div>
  </div>
);

export default function ValidationRequest() {
  const [filters, setFilters] = useState({
    search_query: "",
    status: "",
    payment_status: "",
  });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const { data: resData, error } = useSWR(
    "/institution/requests/validation-requests",
    (url) => axios.get(url).then((res) => res.data)
  );

  console.log(resData);

  const [dateRange, setDateRange] = useState({});

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
                    // router.visit(
                    //     route(
                    //         "requests.document-requests.show",
                    //         item.id
                    //     )
                    // );
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
          <div className="flex flex-col gap-11 mb-6">
            <div className="grid grid-cols-2 gap-2 gap-y-4">
              <ItemCard title="Request ID" value={data?.unique_code} />
              <ItemCard
                title="Status"
                value={<StatusChip status={data?.status} />}
              />
              <ItemCard
                title="Payment Status"
                value={<StatusChip status={data?.payment_status} />}
              />
              <ItemCard
                title="Requested On"
                value={moment(data?.created_at).format("Do MMMM, YYYY")}
              />
              <ItemCard
                title="Requested By"
                value={
                  <CustomUser
                    avatarSrc={data?.user?.profile_photo_url}
                    name={`${data?.user?.first_name} ${data?.user?.last_name}`}
                    email={`${data?.user?.email}`}
                  />
                }
              />
              <ItemCard
                title="Institution"
                // value={data?.institution?.name}
                value={
                  <div className="flex gap-2 items-center">
                    <p>{data?.institution?.name}</p>
                    {!data?.institution?.user_id && (
                      <Chip size="sm" variant="faded" color="warning">
                        Temporary
                      </Chip>
                    )}
                  </div>
                }
              />
              <ItemCard
                title="Delivery Address"
                value={data?.delivery_address}
              />

              <ItemCard title="Total Cost (GH¢)" value={data?.total_amount} />
            </div>

            <div>
              <section className="mb-3 flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <p className="font-semibold ">Documents</p>
                </div>
              </section>

              <section className="grid grid-cols-2 gap-3">
                {data?.records?.map((item) => (
                  <div
                    key={item?.id}
                    className="gap-3 p-2 rounded-lg border dark:border-white/10"
                  >
                    <div className="w-full flex flex-col ">
                      <p className="font-semibold">
                        {item?.document_type?.name}
                      </p>

                      <div className="flex justify-between">
                        <p>
                          GH¢{" "}
                          {Math.floor(
                            item?.document_type?.base_fee +
                              item?.number_of_copies *
                                item?.document_type?.printing_fee
                          ).toFixed(2)}
                        </p>

                        <div className="flex gap-2 items-center">
                          <Chip size="sm">{item?.file?.extension}</Chip>
                          <p>{filesize(item?.file?.size ?? 1000)}</p>
                        </div>
                      </div>

                      <Button
                        color="primary"
                        size="sm"
                        className="cursor-pointer ml-auto mt-2"
                        onClick={() => {
                          window.location.href =
                            route("download-document") +
                            "?path=" +
                            encodeURIComponent(item?.file?.path);
                        }}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </section>
            </div>

            {/* <div>
                            <section className="mb-3 flex items-center justify-between">
                                <div className="flex gap-2 items-center">
                                    <ClipIcon />
                                    <p className="font-semibold ">Attachmets</p>
                                </div>

                                {data?.files?.length >= 1 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        color="primary"
                                        isLoading={bulkDownloadLoading}
                                        isDisabled={bulkDownloadLoading}
                                        onClick={() => {
                                            setBulkDownloadLoading(true);
                                            handleBulkDownload(
                                                data.files.map(
                                                    (f) => f.path
                                                )
                                            );
                                        }}
                                        startContent={<DownloadIcon />}
                                    >
                                        Download all
                                    </Button>
                                )}
                            </section>

                            <section className="grid grid-cols-2 gap-3">
                                {data?.files?.length >= 1 ? (
                                    data?.files?.map((item) => (
                                        <div
                                            key={item?.id}
                                            className="flex items-center gap-3 p-2 rounded-lg border dark:border-white/10"
                                        >
                                            {item?.extension === "pdf" ? (
                                                <PdfIcon
                                                    className="size-11"
                                                    color="red"
                                                />
                                            ) : (
                                                <WordIcon
                                                    className="size-11"
                                                    color="blue"
                                                />
                                            )}
                                            <div className="w-full">
                                                <p className="font-semibold line-clamp-2">
                                                    {item?.name}
                                                </p>

                                                <div className="flex justify-between">
                                                    <p>{filesize(item.size)}</p>
                                                    <p
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            window.location.href =
                                                                route(
                                                                    "download-document"
                                                                ) +
                                                                "?path=" +
                                                                encodeURIComponent(
                                                                    item.path
                                                                );
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

                                <div className="flex items-center">
                                    <Button
                                        size="sm"
                                        color="danger"
                                        onClick={() => {
                                            fileUploadDisclosure.onOpen();
                                        }}
                                    >
                                        <PlusIcon />
                                        Upload Document
                                    </Button>
                                </div>
                            </section>
                        </div> */}
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Button
              // className="w-1/2"
              size="sm"
              color="default"
              onClick={() => {
                setOpenDrawer(false);
                setData(null);
              }}
            >
              Close
            </Button>

            <Button
              color="danger"
              className="font-montserrat font-semibold w-1/2"
              //       isLoading={processing}
              type="submit"
              size="sm"
            >
              Turn In Document
            </Button>
          </div>
        </div>
      </Drawer>

      {/* <ConfirmModal
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
      </ConfirmModal> */}
    </AuthLayout>
  );
}
