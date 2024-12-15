import React, { useState } from "react";
import SelectInput from "../../components/SelectInput";
import { useGetInstitutionDocumentRequestsQuery } from "../../redux/apiSlice";
import LoadItems from "../../components/LoadItems";
import formatText from "../../components/FormatText";
import moment from "moment";

function DocumentRequests({
  institutionDocumentTypes,
  isDocTypesLoading,
  isDocTypesFetching,
}) {
  let currentDate = new Date().toISOString().split("T")[0];
  const initialUserInput = {
    from: currentDate,
    to: currentDate,
  };
  const [selectedDocumentType, setSelectedDocumentType] = useState({});
  const [submitButton, setSubmitButton] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [userInput, setUserInput] = useState(initialUserInput);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectedDocumentType = (item) => {
    setSelectedDocumentType(item);
  };

  const {
    data: institutionDocumentRequests,
    isLoading,
    isFetching,
  } = useGetInstitutionDocumentRequestsQuery({
    page: pageNumber,
    selectedFrom: selectedFrom != "" ? selectedFrom : currentDate,
    selectedTo: selectedTo != "" ? selectedTo : currentDate,
    ...(searchValue !== undefined &&
      searchValue !== "" &&
      searchValue !== null && { searchValue }),
    ...(sortBy !== undefined && sortBy !== "" && sortBy !== null && { sortBy }),
    ...(sortOrder !== undefined &&
      sortOrder !== "" &&
      sortOrder !== null && { sortOrder }),
    ...(selectedStatus !== undefined &&
      selectedStatus !== "" &&
      selectedStatus !== null && {
        selectedStatus,
      }),
  });

  const handleSearchTransaction = (e) => {
    e.preventDefault();
    const submitterName = e.nativeEvent.submitter?.name;
    setSubmitButton(submitterName);
    const { to, from } = userInput;
    const currentDate = new Date().toISOString().split("T")[0];
    if (from !== "") {
      setSelectedFrom(from);
    }
    if (to !== "") {
      setSelectedTo(to ? to : currentDate);
    }
  };

  const handleClearFields = () => {
    setSelectedFrom(currentDate);
    setSelectedTo(currentDate);
    setUserInput((userInput) => ({
      ...userInput,
      from: currentDate,
      to: currentDate,
    }));
  };

  const handleSortOrder = (name) => {
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
          onSubmit={handleSearchTransaction}
        >
          <div className="flex items-center gap-[1vw]">
            <div className="relative md:w-[15vw] w-[60vw] md:h-[2.3vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1vw!important] overflow-hidden bg-white border border-[#ddd]">
              <i className="z-[1] bx bx-search absolute top-[50%] translate-y-[-50%] md:left-[0.5vw] left-[3vw] md:text-[1vw] text-[5vw]"></i>
              <input
                type="text"
                id="search"
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-full md:pl-[2vw] md:pr-[0.5vw] pl-[10vw] pr-[2vw] md:text-[0.9vw] text-[3.5vw] focus:outline-none bg-white absolute left-0 right-0 bottom-0 top-0"
                placeholder="Search Document"
              />
            </div>
            <SelectInput
              placeholder={"Document Types"}
              data={institutionDocumentTypes?.document_types?.data}
              inputValue={selectedDocumentType?.name}
              isLoading={isDocTypesFetching || isDocTypesLoading}
              onItemSelect={handleSelectedDocumentType}
              className="custom-dropdown-class11"
            />
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
          </div>
          <div className="flex items-center gap-[0.5vw]">
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
                    filter
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
      <div className="flex items-center justify-between">
        <div
          className="w-[24%] h-[5vw] bg-[#F8F8F8] rounded-[0.2vw] flex items-center gap-[0.5vw] pl-[1vw] cursor-pointer"
          onClick={() => {
            setSelectedStatus("");
          }}
        >
          <div className="w-[3vw] h-[3vw] bg-[#cb3cff33] rounded-[50%] flex items-center justify-center">
            <img src="/assets/img/users.svg" alt="" className="w-[1.3vw]" />
          </div>
          <div className="flex flex-col justify-between">
            <h4 className="text-[1vw] font-[600]">Total Documents</h4>
            <h4 className="text-[#AEB9E1] text-[1vw]">
              {institutionDocumentRequests?.allRequests.toLocaleString() ?? 0}
            </h4>
          </div>
        </div>
        <div
          className="w-[24%] h-[5vw] bg-[#F8F8F8] rounded-[0.2vw] flex items-center gap-[0.5vw] pl-[1vw] cursor-pointer"
          onClick={() => {
            setSelectedStatus("pending");
          }}
        >
          <div className="w-[3vw] h-[3vw] bg-[#fdb72a33] rounded-[50%] flex items-center justify-center">
            <img src="/assets/img/user.svg" alt="" className="w-[1.3vw]" />
          </div>
          <div className="flex flex-col justify-between">
            <h4 className="text-[1vw] font-[600]">Pending</h4>
            <h4 className="text-[#AEB9E1] text-[1vw]">
              {institutionDocumentRequests?.pending.toLocaleString() ?? 0}
            </h4>
          </div>
        </div>
        <div
          className="w-[24%] h-[5vw] bg-[#F8F8F8] rounded-[0.2vw] flex items-center gap-[0.5vw] pl-[1vw] cursor-pointer"
          onClick={() => {
            setSelectedStatus("approved");
          }}
        >
          <div className="w-[3vw] h-[3vw] bg-[#05c16933] rounded-[50%] flex items-center justify-center">
            <img src="/assets/img/heart.svg" alt="" className="w-[1.3vw]" />
          </div>
          <div className="flex flex-col justify-between">
            <h4 className="text-[1vw] font-[600]">Approved</h4>
            <h4 className="text-[#AEB9E1] text-[1vw]">
              {institutionDocumentRequests?.approved.toLocaleString() ?? 0}
            </h4>
          </div>
        </div>
        <div
          className="w-[24%] h-[5vw] bg-[#F8F8F8] rounded-[0.2vw] flex items-center gap-[0.5vw] pl-[1vw] cursor-pointer"
          onClick={() => {
            setSelectedStatus("rejected");
          }}
        >
          <div className="w-[3vw] h-[3vw] bg-[#086dd933] rounded-[50%] flex items-center justify-center">
            <img src="/assets/img/dots.svg" alt="" className="w-[1.3vw]" />
          </div>
          <div className="flex flex-col justify-between">
            <h4 className="text-[1vw] font-[600]">Not Approved</h4>
            <h4 className="text-[#AEB9E1] text-[1vw]">
              {institutionDocumentRequests?.rejected.toLocaleString() ?? 0}
            </h4>
          </div>
        </div>
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
                      setSortBy("document_type_name");
                      handleSortOrder("document_type_name");
                    }}
                  >
                    <div className="flex flex-col items-center justify-center md:gap-[0.01vw] gap-[0.3vw]">
                      <i
                        className={`bx bxs-up-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "desc") &&
                          sortBy === "document_type_name"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>

                      <i
                        className={`bx bxs-down-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "asc") &&
                          sortBy === "document_type_name"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                    </div>
                    <h4 className="md:text-[0.9vw] text-[3.5vw]">Document</h4>
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
                    <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                      <i
                        className={`bx bxs-up-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "desc") &&
                          sortBy === "user_full_name"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                      <i
                        className={`bx bxs-down-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "asc") &&
                          sortBy === "user_full_name"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                    </div>
                    <h4 className="md:text-[0.9vw] text-[3.5vw]">
                      Requested By
                    </h4>
                  </div>
                </th>
                <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[15%]">
                  <div
                    className="flex gap-[1vw] cursor-pointer"
                    onClick={() => {
                      setSortBy("delivery_address");
                      handleSortOrder("delivery_address");
                    }}
                  >
                    <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                      <i
                        className={`bx bxs-up-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "desc") &&
                          sortBy === "delivery_address"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                      <i
                        className={`bx bxs-down-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "asc") &&
                          sortBy === "delivery_address"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                    </div>
                    <h4 className="md:text-[0.9vw] text-[3.5vw]">
                      Delivery Address
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
                        className={`bx bxs-up-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "desc") &&
                          sortBy === "created_at"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                      <i
                        className={`bx bxs-down-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "asc") &&
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
                      setSortBy("document_format");
                      handleSortOrder("document_format");
                    }}
                  >
                    <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                      <i
                        className={`bx bxs-up-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "desc") &&
                          sortBy === "document_format"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                      <i
                        className={`bx bxs-down-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "asc") &&
                          sortBy === "document_format"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                    </div>
                    <h4 className="md:text-[0.9vw] text-[3.5vw]">Format</h4>
                  </div>
                </th>
                <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[15%]">
                  <div
                    className="flex gap-[1vw] cursor-pointer"
                    onClick={() => {
                      setSortBy("total_amount");
                      handleSortOrder("total_amount");
                    }}
                  >
                    <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                      <i
                        className={`bx bxs-up-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "desc") &&
                          sortBy === "total_amount"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                      <i
                        className={`bx bxs-down-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "asc") &&
                          sortBy === "total_amount"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                    </div>
                    <h4 className="md:text-[0.9vw] text-[3.5vw]">Amount</h4>
                  </div>
                </th>
                <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b max-w-[10%]">
                  <div
                    className="flex gap-[1vw] cursor-pointer"
                    onClick={() => {
                      setSortBy("status");
                      handleSortOrder("status");
                    }}
                  >
                    <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                      <i
                        className={`bx bxs-up-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "desc") &&
                          sortBy === "status"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                      <i
                        className={`bx bxs-down-arrow text-[0.6vw] ${
                          (!sortOrder || sortOrder === "asc") &&
                          sortBy === "status"
                            ? "text-[#ffffff]"
                            : ""
                        }`}
                      ></i>
                    </div>
                    <h4 className="md:text-[0.9vw] text-[3.5vw]">Status</h4>
                  </div>
                </th>
                <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b w-[10%]">
                  <div className="flex gap-[1vw]">
                    <h4 className="md:text-[0.9vw] text-[3.5vw]">Action</h4>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="">
              {!isFetching && !isLoading ? (
                <>
                  {institutionDocumentRequests?.paginatedRequests?.data
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
                            No Document Available
                          </h4>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {institutionDocumentRequests?.paginatedRequests?.data.map(
                        (request, i) => {
                          return (
                            <tr key={i}>
                              <td className="py-[1vw] px-[1vw] border-b max-w-[15%]">
                                {request?.document_type?.name}
                              </td>
                              <td className="py-[1vw] px-[2.5vw] border-b max-w-[15%]">
                                {moment(request?.created_at).format("ll")}
                              </td>

                              <td className="py-[1vw] px-[2.5vw] border-b max-w-[15%]">
                                {request?.document_format === "soft_copy"
                                  ? "Not Applicable"
                                  : request?.delivery_address}
                              </td>
                              <td className="py-[1vw] px-[2.5vw] border-b max-w-[15%]">
                                {moment(request?.created_at).format("ll")}
                              </td>
                              <td
                                className={`py-[1vw] px-[2.5vw] border-b max-w-[13%] ${
                                  request?.document_format === "soft_copy"
                                    ? "text-[#FFA52D]"
                                    : "text-[#000000]"
                                }`}
                              >
                                {formatText(request?.document_format)}
                              </td>
                              <td className="py-[1vw] px-[2.5vw] border-b max-w-[10%]">
                                GH¢ {request?.total_amount}
                              </td>
                              <td className="md:py-[1vw] py-[3vw] md:px-[2.5vw] px-[6vw] border-b max-w-[10%]">
                                <div
                                  className={`md:py-[0.3vw] py-[0.5vw] md:px-[1vw] px-[3vw] w-[fit-content] border ${
                                    request?.status?.toLowerCase() ===
                                    "submitted"
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
                                    className={`md:text-[0.8vw] text-[3vw] ${
                                      request?.status?.toLowerCase() ===
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

                              <td className="px-[1vw] border-b w-[10%]">
                                <button
                                  type="button"
                                  onClick={() => handleOpenModal(request)}
                                  className="new-btn text-[#ff0404] underline"
                                >
                                  view
                                </button>
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
              {institutionDocumentRequests?.paginatedRequests?.last_page}
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
                    institutionDocumentRequests?.paginatedRequests?.last_page
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

export default DocumentRequests;
