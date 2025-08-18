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

export default function VerificationRequest({data}) {
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
                    {data?.map((item) => (
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
                                await fetchVerificationChecklist(
                                    item?.document_type?.id
                                );
                                }
        
                                setOpenDrawer(true);
                                setItemData(item);
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
            `Request Details`
        }
        isOpen={openDrawer}
        setIsOpen={setOpenDrawer}
        classNames="w-[100vw] md:w-[45vw] z-10"
        >
        <div className="h-full flex flex-col -mt-2 xl:pl-2 font-semibold justify-between">
            {itemData?.status != "processing" ? (
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
                <div className="text-gray-500">Document Fee</div>
                <div className="col-span-2">GH¢ {itemData?.total_amount}</div>
                </div>
                <div className="p">
                <p className="font-semibold mb-4 text-base">Document Owner</p>
                <div className="grid grid-cols-3 gap-y-3 border-b pb-4">
                    <div className="text-gray-500">Full Name</div>
                    <div className="col-span-2">
                    {itemData?.doc_owner_full_name}
                    </div>
                    <div className="text-gray-500">Email Addres</div>
                    <div className="col-span-2">{itemData?.doc_owner_email}</div>
                    <div className="text-gray-500">Phone Number</div>
                    <div className="col-span-2">{itemData?.doc_owner_phone}</div>
                    <div className="text-gray-500">Date of Birth</div>
                    <div className="col-span-2">{itemData?.doc_owner_dob}</div>
                </div>
                </div>
                <div className="py-4">
                <p className="font-semibold mb-4 text-base">
                    Verifying Institution
                </p>
                <div className="grid grid-cols-3 gap-y-4 border-b pb-4">
                    <div className="text-gray-500">Institution Name</div>
                    <div className="col-span-2">
                    {itemData?.receiving_institution?.name}
                    </div>
                    <div className="text-gray-500">Institution Email</div>
                    <div className="col-span-2">
                    {itemData?.receiving_institution?.institution_email}
                    </div>
                    <div className="text-gray-500">Phone Number</div>
                    <div className="col-span-2">
                    {itemData?.receiving_institution?.helpline_contact}
                    </div>
                    <div className="text-gray-500 mt-2">Institution Logo</div>
                    <div className="col-span-2 w-10 h-10 rounded-full bg-gray-200">
                    <img
                        src={`${import.meta.env.VITE_BACCHECKER_URL}storage/${itemData?.receiving_institution?.logo}`}
                        alt=""
                    />
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

                <section className="grid grid-cols-1 xl:grid-cols-2 gap-2">
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
                                "${import.meta.env.VITE_BACCHECKER_API_URL}/download-pdf?path=" +
                                encodeURIComponent(itemData?.file?.path);
                            }}
                            /* onClick={() => {
                            window.location.href =
                                "${import.meta.env.VITE_BACCHECKER_API_URL}/document/download" +
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
            ) : (
            <div className="-mt-2">
                <div className="">
                <div className="space-y-2">
                    {checkListSections.sections &&
                    checkListSections.sections.length > 0 ? (
                    checkListSections.sections.map((section) => (
                        <div
                        key={section.id}
                        className="space-y-4 pb-4 border p-3 rounded-md"
                        >
                        {/* Section Header */}
                        <h2 className="text-base">{section.name}</h2>
                        {section.description && (
                            <p className="font-light text-gray-700 text-xs">
                            {section.description}
                            </p>
                        )}

                        {/* Render Items */}
                        <div className="space-y-4">
                            {section.items.map((item) => (
                            <div key={item.id} className="space-y-2">
                                {/* Question Text */}
                                <p className="text-sm font-normal">
                                {item.question_text}
                                </p>

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
                                    onClick={() =>
                                        handleChange(item.id, "yes")
                                    }
                                    >
                                    <input
                                        type="radio"
                                        name={item.id}
                                        value="yes"
                                        checked={answers[item.id] === "yes"}
                                        onChange={() =>
                                        handleChange(item.id, "yes")
                                        }
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
                                    onClick={() =>
                                        handleChange(item.id, "no")
                                    }
                                    >
                                    <input
                                        type="radio"
                                        name={item.id}
                                        value="no"
                                        checked={answers[item.id] === "no"}
                                        onChange={() =>
                                        handleChange(item.id, "no")
                                        }
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
                                    onChange={(e) =>
                                    handleChange(item.id, e.target.value)
                                    }
                                ></textarea>
                                )}

                                {item.input_type === "dropdown" && (
                                <select
                                    className="w-full border rounded p-2.5 text-gray-700 focus:outline-none"
                                    value={answers[item.id] || ""}
                                    onChange={(e) =>
                                    handleChange(item.id, e.target.value)
                                    }
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

            {/* {data?.status !== "created" &&
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
                onClick={handleSubmitVerificationAnswers}
                disabled={
                    !checkListSections.sections ||
                    checkListSections.sections.length === 0
                } // Disable if no sections
                >
                Submit Verifications
                </Button>
            )} */}
            </div>
        </div>
        </Drawer>

    </div>
  );
}
