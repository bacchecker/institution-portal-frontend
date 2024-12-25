import React, { useCallback, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  TableCell,
  TableRow,
} from "@nextui-org/react";
import CustomTable from "@/components/CustomTable";
import moment from "moment";
import StatusChip from "@/components/status-chip";
import Drawer from "@/components/Drawer";
import CustomUser from "@/components/custom-user";
import { filesize } from "filesize";
import { FaDownload } from "react-icons/fa6";

export default function ValidationRequest({data}) {
  const [isLoading, setIsLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [bulkDownloadLoading, setBulkDownloadLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [itemData, setItemData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");


  

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

  return (
    <div>

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
          {data?.map((item) => (
            <TableRow key={item?.id} className="odd:bg-gray-100 even:bg-gray-50 border-b">
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
                    setItemData(item);
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
        classNames="w-[100vw] md:w-[40vw] z-10"
      >
        <div className="h-full flex flex-col justify-between">
        <div className="flex flex-col gap-2 mb-6">
            <div className="grid grid-cols-3 gap-y-4 gap-x-2 border-b pb-4">
                <div className="text-gray-500">Request ID</div>
                <div className="col-span-2">#{itemData?.unique_code}</div>
                <div className="text-gray-500">Requested Date</div>
                <div className="col-span-2">
                {moment(itemData?.created_at).format("Do MMMM, YYYY")}
                </div>
                <div className="text-gray-500">Status</div>
                <div
                className={`col-span-2 flex items-center justify-center py-1 space-x-2 w-28 
                    ${
                    itemData?.status === "cancelled" ||
                    itemData?.status === "rejected"
                        ? "text-red-600 bg-red-200"
                        : itemData?.status === "completed"
                        ? "text-green-600 bg-green-200"
                        : itemData?.status === "processing" ||
                        itemData?.status === "received"
                        ? "text-yellow-600 bg-yellow-200"
                        : "text-gray-600 bg-gray-200"
                    }`}
                >
                <div
                    className={`h-2 w-2 rounded-full ${
                    itemData?.status === "cancelled" ||
                    itemData?.status === "rejected"
                        ? "bg-red-600"
                        : itemData?.status === "completed"
                        ? "bg-green-600"
                        : itemData?.status === "processing" ||
                        itemData?.status === "received"
                        ? "bg-yellow-600"
                        : "bg-gray-600"
                    }`}
                ></div>
                <p>
                    {itemData?.status}
                </p>
                </div>
                <div className="text-gray-500">Total Cash</div>
                <div className="col-span-2">GH¢ {itemData?.total_amount}</div>
            </div>
            <div className="py-4">
                <p className="font-semibold mb-4 text-base">
                Applicant Details
                </p>
                <div className="grid grid-cols-3 gap-y-4 border-b pb-4">
                <div className="text-gray-500">Applicant Name</div>
                <div className="col-span-2">
                    {itemData?.user?.first_name} {itemData?.user?.other_name}{" "}
                    {itemData?.user?.last_name}
                </div>
                <div className="text-gray-500">Applicant Email</div>
                <div className="col-span-2">{itemData?.user?.email}</div>
                <div className="text-gray-500">Phone Number</div>
                <div className="col-span-2">{itemData?.user?.phone}</div>
                <div className="text-gray-500">Index Number</div>
                <div className="col-span-2">{itemData?.index_number}</div>
                <div className="text-gray-500 mt-2">Applicant Picture</div>
                <div className="col-span-2 w-10 h-10 rounded-full bg-gray-200">
                    <img src={itemData?.user?.profile_photo_url} alt="" />
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
                    handleBulkDownload(itemData.files.map((f) => f.path));
                    }}
                >
                    <FaDownload className="text-red-600" />
                    Download all
                </Button>
                </section>

                <section className="grid grid-cols-2 gap-2">
                <div className="gap-3 p-2 rounded-lg border">
                    <div className="w-full flex flex-col gap-1">
                    <p className="font-semibold">
                        {itemData?.document_type?.name}
                    </p>
                    <p>GH¢ {itemData?.total_amount}</p>

                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                        <Chip size="sm">{itemData?.file?.extension}</Chip>
                        <p>{filesize(itemData?.file?.size ?? 1000)}</p>
                        </div>
                        <div
                        className="flex space-x-1 cursor-pointer py-1 px-2 rounded-md bg-primary text-white text-xs"
                        // onClick={() => downloadFile(itemData?.file?.name)}
                        onClick={() => {
                            window.location.href =
                            "https://admin-dev.baccheck.online/api/download-pdf?path=" +
                            encodeURIComponent(itemData?.file?.path);
                        }}
                        /* onClick={() => {
                            window.location.href =
                            "https://admin-dev.baccheck.online/api/document/download" +
                            "?path=" +
                            encodeURIComponent(itemData?.file?.path);
                        }} */
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
                {itemData?.status == "rejected" && (
                <div className="mt-3">
                    <Card className="">
                    <CardHeader>
                        <p className="font-bold">Rejection Reason</p>
                    </CardHeader>
                    <CardBody>
                        <p>{itemData?.rejection_reason}</p>
                    </CardBody>
                    </Card>

                    <div className="mt-3">
                    <Card className="">
                        <CardBody className="flex-row">
                        <div className="flex-1">
                            <p className="font-semibold">Rejected By:</p>
                            <p className="col-span-4">
                            {itemData?.rejected_by?.first_name}{" "}
                            {itemData?.rejected_by?.last_name}
                            </p>
                        </div>

                        <div className="flex-1">
                            <p className="font-bold">Rejection Date</p>
                            <p>
                            {moment(itemData?.updated_at).format(
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

          <div className="w-full flex items-center space-x-2 justify-center border-t pt-2">
            <Button
              radius="none"
              size="md"
              className="w-1/4 bg-black text-white font-medium !rounded-md"
              onClick={() => {
                setOpenDrawer(false);
                setItemData(null);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Drawer>

    </div>
  );
}
