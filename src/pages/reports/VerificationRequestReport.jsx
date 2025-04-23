import React, { useState } from "react";
import moment from "moment";
import {
  useGetInstitutionVerificationReportsQuery,
} from "../../redux/apiSlice";
import LoadItems from "../../components/LoadItems";
import SelectInput from "../../components/SelectInput";

function VerificationRequestReport() {
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
  const initialUserInput = { from: currentDate, to: currentDate };

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
    data: institutionVerificationReports,
    isLoading,
    isFetching,
  } = useGetInstitutionVerificationReportsQuery({
    page: pageNumber,
    selectedFrom: selectedFrom,
    selectedTo: selectedTo,
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
    ...(selectedTimeFrame?.value && { selectedDateRange: selectedTimeFrame.value }),
    ...(selectedStatus?.value && { selectedStatus: selectedStatus.value }),
  });

  const handleUserInput = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleSearchTransaction = (e) => {
    e.preventDefault();
    setSubmitButton(e.nativeEvent.submitter?.name);
    const { to, from } = userInput;
    if (from) setSelectedFrom(from);
    if (to) setSelectedTo(to || currentDate);
  };

  const handleClearFields = () => {
    setSelectedFrom(currentDate);
    setSelectedTo(currentDate);
    setUserInput({ from: currentDate, to: currentDate });
    setSelectedStatus({});
    setSelectedTimeFrame({});
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

  const handleSelectedStatus = (item) => {
    setSelectedStatus(item);
  };
  const handleSelectedTimeFrame = (item) => {
    setSelectedTimeFrame(item);
    setSelectedFrom("");
    setSelectedTo("");
  };

  return (
    <>
        <div className="bg-[#f8f8f8] p-[1vw] my-[1vw] rounded-[0.2vw]">
            <form
                className="flex justify-between items-center"
                onSubmit={handleSearchTransaction}
            >
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
                <div className="flex items-center gap-[0.5vw]">
                <div className="flex items-center md:gap-[0.5vw] gap-[2vw]">
                    <h4 className="md:text-[1vw] text-[3.5vw]">From</h4>
                    <div className="relative md:w-[9vw] w-[80vw] md:h-[2.3vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1vw!important] overflow-hidden bg-white border border-[#ddd]">
                    <input
                        type="date"
                        id="from"
                        name="from"
                        value={userInput.from}
                        onChange={(e) => handleUserInput(e)}
                        required={userInput.to != ""}
                        className="w-full h-full md:text-[0.9vw] text-[3.5vw] px-[1vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0"
                    />
                    </div>
                </div>
                <div className="flex items-center md:gap-[0.5vw] gap-[2vw]">
                    <h4 className="md:text-[1vw] text-[3.5vw]">To</h4>
                    <div className="relative md:w-[9vw] w-[85vw] md:h-[2.3vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1vw!important] overflow-hidden bg-white border border-[#ddd]">
                    <input
                        type="date"
                        id="to"
                        name="to"
                        value={userInput.to}
                        onChange={(e) => handleUserInput(e)}
                        min={userInput.from}
                        className="w-full h-full md:text-[0.9vw] text-[3.5vw] focus:outline-none px-[1vw] bg-white absolute left-0 right-0 bottom-0 top-0"
                    />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isFetching && submitButton === "searchTransactionBtn"}
                    name="searchTransactionBtn"
                    className="new-btn bg-[#FF0404] px-[1vw]  md:mt-0 mt-[3vw] flex justify-center items-center md:py-[0.7vw] py-[2vw] md:h-[2.3vw] h-[12vw] md:rounded-[0.3vw] rounded-[1vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#f48181]"
                >
                    {isFetching && submitButton === "searchTransactionBtn" ? (
                    <LoadItems color={"#ffffff"} size={14} />
                    ) : (
                    <>
                        <i class="bx bxs-filter-alt text-[#ffffff]"></i>
                        <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                        Filter
                        </h4>
                    </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={handleClearFields}
                    disabled={
                    userInput?.to === currentDate && userInput?.from === currentDate
                    }
                    className="new-btn bg-[#000000] px-[1vw]  md:mt-0 mt-[3vw] flex justify-center items-center md:py-[0.7vw] py-[2vw] md:h-[2.3vw] h-[12vw] md:rounded-[0.3vw] rounded-[1vw] gap-[0.5vw] hover:bg-[#202020] transition-all duration-300 disabled:bg-[#414141] disabled:cursor-not-allowed"
                >
                    <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                    Clear
                    </h4>
                </button>
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
                                <h4 className="md:text-[0.9vw] text-[3.5vw]">Institution</h4>
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
                    {institutionVerificationReports?.verificationPayments?.data
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
                        {institutionVerificationReports?.verificationPayments?.data?.map(
                            (payment, i) => {
                            return (
                                <tr key={i}>
                                <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                    {payment.unique_code}
                                </td>
                                <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                    {payment?.sending_institution?.name}
                                </td>
                                <td className="py-[1vw] px-[2.5vw] border-b max-w-[15%]">
                                    {payment.verification_request?.institution_document_type?.document_type
                                    ?.name ? payment.verification_request?.institution_document_type
                                        ?.document_type?.name :
                                    payment.document_type
                                        ?.name
                                    }
                                </td>
                                <td className="py-[1vw] px-[2.5vw] border-b max-w-[15%]">
                                    {moment(payment?.created_at).format("ll")}
                                </td>
                                {/* <td className="md:py-[1vw] py-[3vw] md:px-[2.5vw] px-[6vw] border-b max-w-[10%]">
                                    <div
                                    className={`md:py-[0.3vw] py-[0.5vw] md:px-[1vw] px-[3vw] w-[fit-content] border ${payment.verification_request?.status?.toLowerCase() ===
                                        "submitted"
                                        ? "border-[#f8e5cc] bg-[#fbf5ee]"
                                        : payment.verification_request?.status?.toLowerCase() ===
                                        "cancelled"
                                        ? "border-[#ffc7c7] bg-[#eaeaea]"
                                        : payment.verification_request?.status?.toLowerCase() ===
                                            "processing"
                                            ? "border-[#bdbdfd] bg-[#ededfd]"
                                            : payment.verification_request?.status?.toLowerCase() ===
                                            "completed"
                                            ? "border-[#fdd1d8] bg-[#fbecef]"
                                            : payment.verification_request?.status?.toLowerCase() ===
                                                "created"
                                                ? "border-[#858585] bg-[#efefef]"
                                                : "border-[#C4FFE1] bg-[#ECFFF5]"
                                        } flex items-center justify-center md:rounded-[2vw] rounded-[4vw]`}
                                    >
                                    <h4
                                        className={`md:text-[0.8vw] text-[3vw] ${payment.verification_request?.status?.toLowerCase() ===
                                        "submitted"
                                        ? "text-[#FFA52D]"
                                        : payment.verification_request?.status?.toLowerCase() ===
                                            "cancelled"
                                            ? "text-[#ff0404]"
                                            : payment.verification_request?.status?.toLowerCase() ===
                                            "processing"
                                            ? "text-[#0000ff]"
                                            : payment.verification_request?.status?.toLowerCase() ===
                                                "completed"
                                                ? "text-[#ffc0cb]"
                                                : payment.verification_request?.status?.toLowerCase() ===
                                                "created"
                                                ? "text-[#000]"
                                                : "text-[#00612D]"
                                        } capitalize`}
                                    >
                                        {payment.verification_request?.status}
                                    </h4>
                                    </div>
                                </td> */}

                                <td className="py-[1vw] px-[2.5vw] border-b max-w-[10%]">
                                    GH¢ {payment?.total_amount}
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
            <div className="w-full flex justify-end items-center md:gap-[1vw] gap-[3vw] md:mt-[1vw] mt-[4vw]">
            <h4 className="md:text-[1vw] text-[3.5vw]">
                Page <span>{pageNumber}</span> of{" "}
                <span>
                {
                    institutionVerificationReports?.verificationPayments
                    ?.last_page
                }
                </span>
            </h4>
            <div className="flex md:gap-[1vw] gap-[3vw]">
                <button
                type="button"
                onClick={() => {
                    setPageNumber((prev) => Math.max(prev - 1, 1));
                }}
                className="md:w-[2.5vw] md:h-[2.5vw] w-[10vw] h-[10vw] rounded-[50%] bg-[#d0d0d0] flex justify-center items-center"
                >
                <img
                    src="/assets/img/arr-b.svg"
                    alt=""
                    className="md:w-[1.1vw] w-[4vw]"
                />
                </button>
                <button
                type="button"
                onClick={() => {
                    setPageNumber((prev) =>
                    Math.min(
                        prev + 1,
                        institutionVerificationRequestReports?.verificationPayments
                        ?.last_page
                    )
                    );
                }}
                className="md:w-[2.5vw] md:h-[2.5vw] w-[10vw] h-[10vw] rounded-[50%] bg-[#d0d0d0] flex justify-center items-center"
                >
                <img
                    src="/assets/img/arr-f.svg"
                    alt=""
                    className="md:w-[1.1vw] w-[4vw]"
                />
                </button>
            </div>
            </div>
        </div>
    </>
  );
}

export default VerificationRequestReport;
