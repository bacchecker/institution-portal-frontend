import React, { useState, useEffect } from "react";
import moment from "moment";
import { useGetInstitutionReportsQuery } from "../../redux/apiSlice";
import LoadItems from "../../components/LoadItems";
import formatText from "../../components/FormatText";
import SelectInput from "../../components/SelectInput";

function DashboardDocumentRequestReport() {
    const statuses = [
        { title: "All", value: "" },
        { title: "Submitted", value: "submitted" },
        { title: "Received", value: "received" },
        { title: "Processing", value: "processing" },
        { title: "Completed", value: "completed" },
        { title: "Cancelled", value: "cancelled" },
    ];

    const timeFrames = [
        { title: "All", value: "" },
        { title: "Weekly", value: "week" },
        { title: "Monthly", value: "month" },
        { title: "Quarterly", value: "quarter" },
        { title: "Yearly", value: "year" },
    ];

    let currentDate = new Date().toISOString().split("T")[0];
    const initialUserInput = {
        from: currentDate,
        to: currentDate,
    };

    const [selectedStatus, setSelectedStatus] = useState({});
    const [selectedTimeFrame, setSelectedTimeFrame] = useState({});
    const [selectedFrom, setSelectedFrom] = useState("");
    const [submitButton, setSubmitButton] = useState("");
    const [selectedTo, setSelectedTo] = useState("");
    const [userInput, setUserInput] = useState(initialUserInput);
    const [pageNumber, setPageNumber] = useState(1);
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const {
        data: institutionDocumentRequestReports,
        isLoading,
        isFetching,
    } = useGetInstitutionReportsQuery({
        page: pageNumber,
        selectedFrom: selectedFrom != "" ? selectedFrom : currentDate,
        selectedTo: selectedTo != "" ? selectedTo : currentDate,
        ...(sortBy !== undefined && sortBy !== "" && sortBy !== null && { sortBy }),
        ...(sortOrder !== undefined &&
            sortOrder !== "" &&
            sortOrder !== null && { sortOrder }),
        ...(selectedTimeFrame?.value !== undefined &&
            selectedTimeFrame?.value !== "" &&
            selectedTimeFrame?.value !== null && {
            selectedDateRange: selectedTimeFrame?.value,
        }),
        ...(selectedStatus?.value !== undefined &&
            selectedStatus?.value !== "" &&
            selectedStatus?.value !== null && {
            selectedStatus: selectedStatus?.value,
        }),
    });

    const handleUserInput = (e) => {
        setUserInput((userInput) => ({
            ...userInput,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSelectedStatus = (item) => {
        setSelectedStatus(item);
    };
    const handleSelectedTimeFrame = (item) => {
        setSelectedTimeFrame(item);
        setSelectedFrom("");
        setSelectedTo("");
    };
    const handleSortOrder = () => {
        if (!sortBy && !sortOrder) {
            setSortOrder("asc");
        } else if (sortOrder === "asc") {
            setSortOrder("desc");
        } else {
            setSortOrder("");
            setSortBy("");
        }
    };



    return (
        <>
            <div className="bg-[#f8f8f8] p-[1vw] my-[1vw] rounded-[0.2vw]">
                <form
                    className="flex justify-between items-center"
                >
                    <h4 className="md:text-[1.1vw] font-[600] text-[3.5vw]">Recent Document Request Report</h4>
                    <div className="flex items-center gap-[1vw]">
                        <SelectInput
                            placeholder={"Status"}
                            data={statuses}
                            inputValue={selectedStatus?.title}
                            onItemSelect={handleSelectedStatus}
                            className="custom-dropdown-class11"
                        />
                        <SelectInput
                            placeholder={"Time Frame"}
                            data={timeFrames}
                            inputValue={selectedTimeFrame?.title}
                            onItemSelect={handleSelectedTimeFrame}
                            className="custom-dropdown-class11"
                        />
                    </div>
                </form>
            </div>
            <div className="content pb-[2vw]">
                <div className="w-full md:min-h-[40vw] min-h-[100vw] gap-[3vw] overflow-auto bg-[#f8f8f8] p-[1vw] table-cover md:mt-[1vw] mt-[6vw] scroll-width">
                    <table className="md:w-full w-[230vw] border-collapse md:text-[0.9vw] text-[3.5vw] relative">
                        <thead className="bg-white sticky top-0 z-[20]">
                            <tr className="text-left">
                                <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[13%]">
                                    <div
                                        className="flex gap-[1vw] cursor-pointer"
                                        onClick={() => {
                                            setSortBy("unique_code");
                                            handleSortOrder("unique_code");
                                        }}
                                    >
                                        <div className="flex flex-col items-center justify-center md:gap-[0.01vw] gap-[0.3vw]">
                                            <i
                                                className={`bx bxs-up-arrow text-[0.6vw] ${(!sortOrder || sortOrder === "desc") &&
                                                    sortBy === "unique_code"
                                                    ? "text-[#ffffff]"
                                                    : ""
                                                    }`}
                                            ></i>

                                            <i
                                                className={`bx bxs-down-arrow text-[0.6vw] ${(!sortOrder || sortOrder === "asc") &&
                                                    sortBy === "unique_code"
                                                    ? "text-[#ffffff]"
                                                    : ""
                                                    }`}
                                            ></i>
                                        </div>
                                        <h4 className="md:text-[0.9vw] text-[3.5vw]">
                                            Unique Code
                                        </h4>
                                    </div>
                                </th>
                                <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b w-[15%]">
                                    <div
                                        className="flex gap-[1vw] cursor-pointer"
                                        onClick={() => {
                                            setSortBy("document_type.name");
                                            handleSortOrder("document_type.name");
                                        }}
                                    >
                                        <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                                            <i
                                                className={`bx bxs-up-arrow text-[0.6vw] ${(!sortOrder || sortOrder === "desc") &&
                                                    sortBy === "document_type.name"
                                                    ? "text-[#ffffff]"
                                                    : ""
                                                    }`}
                                            ></i>
                                            <i
                                                className={`bx bxs-down-arrow text-[0.6vw] ${(!sortOrder || sortOrder === "asc") &&
                                                    sortBy === "document_type.name"
                                                    ? "text-[#ffffff]"
                                                    : ""
                                                    }`}
                                            ></i>
                                        </div>
                                        <h4 className="md:text-[0.9vw] text-[3.5vw]">
                                            Document Type
                                        </h4>
                                    </div>
                                </th>
                                <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[15%]">
                                    <div
                                        className="flex gap-[1vw] cursor-pointer"
                                        onClick={() => {
                                            setSortBy("document_requests.format");
                                            handleSortOrder("document_requests.format");
                                        }}
                                    >
                                        <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                                            <i
                                                className={`bx bxs-up-arrow text-[0.6vw] ${(!sortOrder || sortOrder === "desc") &&
                                                    sortBy === "document_requests.format"
                                                    ? "text-[#ffffff]"
                                                    : ""
                                                    }`}
                                            ></i>
                                            <i
                                                className={`bx bxs-down-arrow text-[0.6vw] ${(!sortOrder || sortOrder === "asc") &&
                                                    sortBy === "document_requests.format"
                                                    ? "text-[#ffffff]"
                                                    : ""
                                                    }`}
                                            ></i>
                                        </div>
                                        <h4 className="md:text-[0.9vw] text-[3.5vw]">
                                            Document Format
                                        </h4>
                                    </div>
                                </th>

                                <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[15%]">
                                    <div
                                        className="flex gap-[1vw] cursor-pointer"
                                        onClick={() => {
                                            setSortBy("created_at");
                                            handleSortOrder("created_at");
                                        }}
                                    >
                                        <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                                            <i
                                                className={`bx bxs-up-arrow text-[0.6vw] ${(!sortOrder || sortOrder === "desc") &&
                                                    sortBy === "created_at"
                                                    ? "text-[#ffffff]"
                                                    : ""
                                                    }`}
                                            ></i>
                                            <i
                                                className={`bx bxs-down-arrow text-[0.6vw] ${(!sortOrder || sortOrder === "asc") &&
                                                    sortBy === "created_at"
                                                    ? "text-[#ffffff]"
                                                    : ""
                                                    }`}
                                            ></i>
                                        </div>
                                        <h4 className="md:text-[0.9vw] text-[3.5vw]">Date</h4>
                                    </div>
                                </th>
                                <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[10%]">
                                    <div
                                        className="flex gap-[1vw] cursor-pointer"
                                        onClick={() => {
                                            setSortBy("document_requests.status");
                                            handleSortOrder("document_requests.status");
                                        }}
                                    >
                                        <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                                            <i
                                                className={`bx bxs-up-arrow text-[0.6vw] ${(!sortOrder || sortOrder === "desc") &&
                                                    sortBy === "document_requests.status"
                                                    ? "text-[#ffffff]"
                                                    : ""
                                                    }`}
                                            ></i>
                                            <i
                                                className={`bx bxs-down-arrow text-[0.6vw] ${(!sortOrder || sortOrder === "asc") &&
                                                    sortBy === "document_requests.status"
                                                    ? "text-[#ffffff]"
                                                    : ""
                                                    }`}
                                            ></i>
                                        </div>
                                        <h4 className="md:text-[0.9vw] text-[3.5vw]">Status</h4>
                                    </div>
                                </th>
                                <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[15%]">
                                    <div
                                        className="flex gap-[1vw] cursor-pointer"
                                        onClick={() => {
                                            setSortBy("amount");
                                            handleSortOrder("amount");
                                        }}
                                    >
                                        <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                                            <i
                                                className={`bx bxs-up-arrow text-[0.6vw] ${(!sortOrder || sortOrder === "desc") &&
                                                    sortBy === "amount"
                                                    ? "text-[#ffffff]"
                                                    : ""
                                                    }`}
                                            ></i>
                                            <i
                                                className={`bx bxs-down-arrow text-[0.6vw] ${(!sortOrder || sortOrder === "asc") &&
                                                    sortBy === "amount"
                                                    ? "text-[#ffffff]"
                                                    : ""
                                                    }`}
                                            ></i>
                                        </div>
                                        <h4 className="md:text-[0.9vw] text-[3.5vw]">Revenue</h4>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {!isFetching && !isLoading ? (
                                <>
                                    {institutionDocumentRequestReports?.requestPayments?.data
                                        ?.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} rowSpan={5}>
                                                <div className="w-full h-[35vw] flex flex-col justify-center items-center">
                                                    <img
                                                        src="/assets/img/no-data.svg"
                                                        alt=""
                                                        className="w-[10vw]"
                                                    />
                                                    <h4 className="md:text-[1vw] text-[3.5vw] font-[600]">
                                                        No Payment Available
                                                    </h4>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {institutionDocumentRequestReports?.requestPayments?.data?.map(
                                                (payment, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                                                {payment.unique_code}
                                                            </td>
                                                            <td className="py-[1vw] px-[2.5vw] border-b max-w-[15%]">
                                                                {payment.document_request?.document_type?.name}
                                                            </td>
                                                            <td
                                                                className={`py-[1vw] px-[2.5vw] border-b max-w-[13%] ${payment.document_request?.document_format ===
                                                                    "soft_copy"
                                                                    ? "text-[#FFA52D]"
                                                                    : "text-[#000000]"
                                                                    }`}
                                                            >
                                                                {formatText(
                                                                    payment.document_request?.document_format
                                                                )}
                                                            </td>

                                                            <td className="py-[1vw] px-[2.5vw] border-b max-w-[15%]">
                                                                {moment(payment?.created_at).format("ll")}
                                                            </td>
                                                            <td className="md:py-[1vw] py-[3vw] md:px-[2.5vw] px-[6vw] border-b max-w-[10%]">
                                                                <div
                                                                    className={`md:py-[0.3vw] py-[0.5vw] md:px-[1vw] px-[3vw] w-[fit-content] border ${payment.document_request?.status?.toLowerCase() ===
                                                                        "submitted"
                                                                        ? "border-[#f8e5cc] bg-[#fbf5ee]"
                                                                        : payment.document_request?.status?.toLowerCase() ===
                                                                            "cancelled"
                                                                            ? "border-[#ffc7c7] bg-[#eaeaea]"
                                                                            : payment.document_request?.status?.toLowerCase() ===
                                                                                "processing"
                                                                                ? "border-[#bdbdfd] bg-[#ededfd]"
                                                                                : payment.document_request?.status?.toLowerCase() ===
                                                                                    "completed"
                                                                                    ? "border-[#fdd1d8] bg-[#fbecef]"
                                                                                    : payment.document_request?.status?.toLowerCase() ===
                                                                                        "created"
                                                                                        ? "border-[#858585] bg-[#efefef]"
                                                                                        : "border-[#C4FFE1] bg-[#ECFFF5]"
                                                                        } flex items-center justify-center md:rounded-[2vw] rounded-[4vw]`}
                                                                >
                                                                    <h4
                                                                        className={`md:text-[0.8vw] text-[3vw] ${payment.document_request?.status?.toLowerCase() ===
                                                                            "submitted"
                                                                            ? "text-[#FFA52D]"
                                                                            : payment.document_request?.status?.toLowerCase() ===
                                                                                "cancelled"
                                                                                ? "text-[#ff0404]"
                                                                                : payment.document_request?.status?.toLowerCase() ===
                                                                                    "processing"
                                                                                    ? "text-[#0000ff]"
                                                                                    : payment.document_request?.status?.toLowerCase() ===
                                                                                        "completed"
                                                                                        ? "text-[#ffc0cb]"
                                                                                        : payment.document_request?.status?.toLowerCase() ===
                                                                                            "created"
                                                                                            ? "text-[#000]"
                                                                                            : "text-[#00612D]"
                                                                            } capitalize`}
                                                                    >
                                                                        {payment.document_request?.status}
                                                                    </h4>
                                                                </div>
                                                            </td>

                                                            <td className="py-[1vw] px-[2.5vw] border-b max-w-[10%]">
                                                                GH¢ {payment?.amount}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={7} rowSpan={5}>
                                        <div className="w-full h-[35vw] flex items-center justify-center">
                                            <LoadItems color={"#000000"} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default DashboardDocumentRequestReport;
