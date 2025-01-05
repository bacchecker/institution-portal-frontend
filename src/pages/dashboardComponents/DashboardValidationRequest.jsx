import React, { useState } from "react";
import { useGetInstitutionValidationRequestsQuery } from "../../redux/apiSlice";
import LoadItems from "../../components/LoadItems";
import formatText from "../../components/FormatText";
import DocumentRequestDetails from "../requests/DocumentRequestDetails";
import moment from "moment";

function DashboardValidationRequest() {
    let currentDate = new Date().toISOString().split("T")[0];

    const [selectedRequest, setSelectedRequest] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const {
        data: institutionValidationRequests,
        isLoading,
        isFetching,
    } = useGetInstitutionValidationRequestsQuery({
        page: pageNumber,
        selectedFrom: currentDate,
        selectedTo: currentDate,
        ...(searchValue !== undefined &&
            searchValue !== "" &&
            searchValue !== null && { searchValue }),
        ...(sortBy !== undefined && sortBy !== "" && sortBy !== null && { sortBy }),
        ...(sortOrder !== undefined &&
            sortOrder !== "" &&
            sortOrder !== null && { sortOrder }),
    });



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

    const handleOpenModal = (request) => {
        setOpenModal(true);
        setSelectedRequest(request);
    };

    return (
        <>
            <div className="flex justify-between items-center p-[1vw] content">
                <h4 className="font-[600] md:text-[1.2vw] text-[3.5vw]">Recent Validation Requests</h4>
                <div className="relative md:w-[15vw] w-[55vw] md:h-[2.3vw] h-[10vw] md:rounded-[0.3vw!important] rounded-[1vw!important] overflow-hidden bg-white border border-[#ddd]">
                    <i className="z-[1] bx bx-search absolute top-[50%] translate-y-[-50%] md:left-[0.5vw] left-[3vw] md:text-[1vw] text-[5vw]"></i>
                    <input
                        type="text"
                        id="search"
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full h-full md:pl-[2vw] md:pr-[0.5vw] pl-[10vw] pr-[2vw] md:text-[0.85vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0"
                        placeholder="Search Document"
                    />
                </div>
            </div>
            <div className="w-full h-full gap-[3vw] overflow-auto bg-[#f8f8f8] p-[1vw] table-cover scroll-width">
                <table className="md:w-full w-[230vw] border-collapse md:text-[0.85vw] text-[3.5vw] relative">
                    <thead className="bg-white sticky top-0 z-[20]">
                        <tr className="text-left">
                            <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b ">
                                <div
                                    className="flex gap-[1vw] cursor-pointer"
                                    onClick={() => {
                                        setSortBy("unique_code");
                                        handleSortOrder("unique_code");
                                    }}
                                >
                                    <div className="flex flex-col items-center justify-center md:gap-[0.01vw] gap-[0.3vw]">
                                        <i
                                            className={`bx bxs-up-arrow md:text-[0.5vw] text-[2vw] ${(!sortOrder || sortOrder === "desc") &&
                                                sortBy === "unique_code"
                                                ? "text-[#ffffff]"
                                                : ""
                                                }`}
                                        ></i>
                                        <i
                                            className={`bx bxs-down-arrow md:text-[0.5vw] text-[2vw] ${(!sortOrder || sortOrder === "asc") &&
                                                sortBy === "unique_code"
                                                ? "text-[#ffffff]"
                                                : ""
                                                }`}
                                        ></i>
                                    </div>
                                    <h4 className="md:text-[0.85vw] text-[3.5vw]">ID</h4>
                                </div>
                            </th>
                            <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b w-[15%]">
                                <div
                                    className="flex gap-[1vw] cursor-pointer"
                                    onClick={() => {
                                        setSortBy("user_full_name");
                                        handleSortOrder("user_full_name");
                                    }}
                                >
                                    <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.1vw]">
                                        <i
                                            className={`bx bxs-up-arrow md:text-[0.5vw] text-[2vw] ${(!sortOrder || sortOrder === "desc") &&
                                                sortBy === "user_full_name"
                                                ? "text-[#ffffff]"
                                                : ""
                                                }`}
                                        ></i>
                                        <i
                                            className={`bx bxs-down-arrow md:text-[0.5vw] text-[2vw] mt-[-0.1vw] ${(!sortOrder || sortOrder === "asc") &&
                                                sortBy === "user_full_name"
                                                ? "text-[#ffffff]"
                                                : ""
                                                }`}
                                        ></i>
                                    </div>
                                    <h4 className="md:text-[0.85vw] text-[3.5vw]">
                                        Requested By
                                    </h4>
                                </div>
                            </th>
                            <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b ">
                                <div
                                    className="flex gap-[1vw] cursor-pointer"
                                    onClick={() => {
                                        setSortBy("created_at");
                                        handleSortOrder("created_at");
                                    }}
                                >
                                    <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                                        <i
                                            className={`bx bxs-up-arrow md:text-[0.5vw] text-[2vw] ${(!sortOrder || sortOrder === "desc") &&
                                                sortBy === "created_at"
                                                ? "text-[#ffffff]"
                                                : ""
                                                }`}
                                        ></i>
                                        <i
                                            className={`bx bxs-down-arrow md:text-[0.5vw] text-[2vw] mt-[-0.1vw] ${(!sortOrder || sortOrder === "asc") &&
                                                sortBy === "created_at"
                                                ? "text-[#ffffff]"
                                                : ""
                                                }`}
                                        ></i>
                                    </div>
                                    <h4 className="md:text-[0.85vw] text-[3.5vw]">
                                        Date
                                    </h4>
                                </div>
                            </th>

                            {/* <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b ">
                  <div
                    className="flex gap-[1vw] cursor-pointer"
                    onClick={() => {
                      setSortBy("created_at");
                      handleSortOrder("created_at");
                    }}
                  >
                    <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                      <i
                        className={`bx bxs-up-arrow md:text-[0.5vw] text-[2vw] ${
                          (!sortOrder || sortOrder === "desc") &&
                          sortBy === "created_at"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                      <i
                        className={`bx bxs-down-arrow md:text-[0.5vw] text-[2vw] ${
                          (!sortOrder || sortOrder === "asc") &&
                          sortBy === "created_at"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                    </div>
                    <h4 className="md:text-[0.85vw] text-[3.5vw]">Date</h4>
                  </div>
                </th> */}
                            <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b ">
                                <div
                                    className="flex gap-[1vw] cursor-pointer"
                                    onClick={() => {
                                        setSortBy("document_type_name");
                                        handleSortOrder("document_type_name");
                                    }}
                                >
                                    <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                                        <i
                                            className={`bx bxs-up-arrow md:text-[0.5vw] text-[2vw] ${(!sortOrder || sortOrder === "desc") &&
                                                sortBy === "document_type_name"
                                                ? "text-[#ffffff]"
                                                : ""
                                                }`}
                                        ></i>
                                        <i
                                            className={`bx bxs-down-arrow md:text-[0.5vw] text-[2vw] mt-[-0.1vw] ${(!sortOrder || sortOrder === "asc") &&
                                                sortBy === "document_type_name"
                                                ? "text-[#ffffff]"
                                                : ""
                                                }`}
                                        ></i>
                                    </div>
                                    <h4 className="md:text-[0.85vw] text-[3.5vw]">Document</h4>
                                </div>
                            </th>
                            <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b ">
                                <div
                                    className="flex gap-[1vw] cursor-pointer"
                                    onClick={() => {
                                        setSortBy("total_amount");
                                        handleSortOrder("total_amount");
                                    }}
                                >
                                    <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                                        <i
                                            className={`bx bxs-up-arrow md:text-[0.5vw] text-[2vw] ${(!sortOrder || sortOrder === "desc") &&
                                                sortBy === "total_amount"
                                                ? "text-[#ffffff]"
                                                : ""
                                                }`}
                                        ></i>
                                        <i
                                            className={`bx bxs-down-arrow md:text-[0.5vw] text-[2vw] mt-[-0.1vw] ${(!sortOrder || sortOrder === "asc") &&
                                                sortBy === "total_amount"
                                                ? "text-[#ffffff]"
                                                : ""
                                                }`}
                                        ></i>
                                    </div>
                                    <h4 className="md:text-[0.85vw] text-[3.5vw]">Amount</h4>
                                </div>
                            </th>
                            <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b ">
                                <div
                                    className="flex gap-[1vw] cursor-pointer"
                                    onClick={() => {
                                        setSortBy("status");
                                        handleSortOrder("status");
                                    }}
                                >
                                    <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                                        <i
                                            className={`bx bxs-up-arrow md:text-[0.5vw] text-[2vw] ${(!sortOrder || sortOrder === "desc") &&
                                                sortBy === "status"
                                                ? "text-[#ffffff]"
                                                : ""
                                                }`}
                                        ></i>
                                        <i
                                            className={`bx bxs-down-arrow md:text-[0.5vw] text-[2vw] mt-[-0.1vw] ${(!sortOrder || sortOrder === "asc") &&
                                                sortBy === "status"
                                                ? "text-[#ffffff]"
                                                : ""
                                                }`}
                                        ></i>
                                    </div>
                                    <h4 className="md:text-[0.85vw] text-[3.5vw]">Status</h4>
                                </div>
                            </th>
                            {/* <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b ">
                <div className="flex gap-[1vw]">
                  <h4 className="md:text-[0.85vw] text-[3.5vw]">Action</h4>
                </div>
              </th> */}
                        </tr>
                    </thead>
                    <tbody className="">
                        {!isFetching && !isLoading ? (
                            <>
                                {institutionValidationRequests?.paginatedRequests?.data
                                    ?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} rowSpan={5}>
                                            <div className="w-full h-[30vw] flex flex-col justify-center items-center">
                                                <img
                                                    src="/assets/img/no-data.svg"
                                                    alt=""
                                                    className="w-[10vw]"
                                                />
                                                <h4 className="md:text-[1vw] text-[3.5vw] font-[600]">
                                                    No Document Available
                                                </h4>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {institutionValidationRequests?.paginatedRequests?.data?.map(
                                            (request, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td className="py-[1vw] px-[1vw] border-b ">
                                                            {request?.unique_code}
                                                        </td>
                                                        <td className="py-[1vw] border-b  ">
                                                            <div className="flex gap-[0.2vw]">
                                                                <div className="w-[2.5vw] h-[2.5vw] bg-[#cb3cff33] rounded-[50%] flex overflow-hidden">
                                                                    {request?.user?.photo && (
                                                                        <img
                                                                            src={`https://admin-dev.baccheck.online/storage/${request?.user?.photo}`}
                                                                            alt=""
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col justify-between">
                                                                    <h4 className="text-[0.85vw]">
                                                                        {request?.user?.first_name}{" "}
                                                                        {request?.user?.other_name}{" "}
                                                                        {request?.user?.last_name}
                                                                    </h4>
                                                                    <h4 className="text-[#AEB9E1] text-[0.85vw]">
                                                                        {request?.user?.email}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="py-[1vw] px-[2.5vw] border-b ">
                                                            {moment(request?.created_at).format("ll")}
                                                        </td>
                                                        {/* <td className="py-[1vw] px-[2.5vw] border-b ">
                                {moment(request?.created_at).format("ll")}
                              </td> */}
                                                        <td
                                                            className="py-[1vw] px-[2.5vw] border-b"
                                                        >
                                                            {request.institution_document_type
                                                                ? request?.institution_document_type?.document_type?.name
                                                                : request?.document_type?.name}
                                                        </td>
                                                        <td className="py-[1vw] px-[2.5vw] border-b ">
                                                            GH¢ {request?.total_amount}
                                                        </td>
                                                        <td className="md:py-[1vw] py-[3vw] md:px-[2.5vw] px-[6vw] border-b ">
                                                            <div
                                                                className={`md:py-[0.3vw] py-[0.5vw] md:px-[1vw] px-[3vw] w-[fit-content] border ${request?.status?.toLowerCase() === "submitted"
                                                                    ? "border-[#f8e5cc] bg-[#fbf5ee]"
                                                                    : request?.status?.toLowerCase() ===
                                                                        "cancelled"
                                                                        ? "border-[#ffc7c7] bg-[#eaeaea]"
                                                                        : request?.status?.toLowerCase() ===
                                                                            "processing"
                                                                            ? "border-[#bdbdfd] bg-[#ededfd]"
                                                                            : request?.status?.toLowerCase() ===
                                                                                "completed"
                                                                                ? "border-[#fdd1d8] bg-[#fbecef]"
                                                                                : request?.status?.toLowerCase() ===
                                                                                    "created"
                                                                                    ? "border-[#858585] bg-[#efefef]"
                                                                                    : "border-[#C4FFE1] bg-[#ECFFF5]"
                                                                    } flex items-center justify-center md:rounded-[2vw] rounded-[4vw]`}
                                                            >
                                                                <h4
                                                                    className={`md:text-[0.85vw] text-[3vw] ${request?.status?.toLowerCase() ===
                                                                        "submitted"
                                                                        ? "text-[#FFA52D]"
                                                                        : request?.status?.toLowerCase() ===
                                                                            "cancelled"
                                                                            ? "text-[#ff0404]"
                                                                            : request?.status?.toLowerCase() ===
                                                                                "processing"
                                                                                ? "text-[#0000ff]"
                                                                                : request?.status?.toLowerCase() ===
                                                                                    "completed"
                                                                                    ? "text-[#ffc0cb]"
                                                                                    : request?.status?.toLowerCase() ===
                                                                                        "created"
                                                                                        ? "text-[#000]"
                                                                                        : "text-[#00612D]"
                                                                        } capitalize`}
                                                                >
                                                                    {request?.status}
                                                                </h4>
                                                            </div>
                                                        </td>

                                                        {/* <td className="px-[1vw] border-b ">
                              <button
                                type="button"
                                onClick={() => handleOpenModal(request)}
                                className="new-btn text-[#ff0404] underline"
                              >
                                view
                              </button>
                            </td> */}
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

            <DocumentRequestDetails
                setOpenModal={setOpenModal}
                openModal={openModal}
                selectedRequest={selectedRequest}
            />
        </>
    );
}

export default DashboardValidationRequest;
